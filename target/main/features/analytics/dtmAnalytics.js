var dtmAnalyticsFeature = false;
{
    dtmAnalyticsFeature = true;
}

(function (app) {
    'use strict';

    app.service('DtmAnalyticsService', function (Card) {
        var currentPage;

        var prettyPathFromURL = function (fullUrl) {
            return fullUrl.toLowerCase().replace(/^.+#\/|\/$/g, '').replace(/\/(\:+)?/g, ':').replace(/\-/g, ' ');
        };

        var cleanPathId = function (prettyPath) {
            return prettyPath
                .replace(/^(.*pay multiple(:confirm|:results)?).*$/, '$1')
                .replace(/^(.*:view).*$/, '$1')
                .replace(/^(.*account preferences).*$/, '$1');
        };

        var modifyFunctionsForNavigation = {
            'login,.*': function (analyticsProperties) {
                analyticsProperties.loginStatus = "guest";
                updatePageProperties('login', analyticsProperties);
            },
            'new registered,.*': function (analyticsProperties, currentUrl, previousUrl) {
                var registrationSuccess = false;
                if (previousUrl.indexOf('otp:verify') >= 0) {
                    analyticsProperties.loginStatus = 'logged in';
                    analyticsProperties.userLoginSuccess = true;
                    analyticsProperties.userRegistrationSuccess = true;
                } else {
                    analyticsProperties.userRegistrationSuccess = "";
                }
                updatePageProperties('registration:new user registration options', analyticsProperties);
            },
            'register,.*': function (analyticsProperties) {
                updatePageProperties('registration:step 1 create digital id', analyticsProperties);
            },
            'otp:verify,register': function (analyticsProperties) {
                updatePageProperties('registration:step 2 verification code', analyticsProperties);
            },
            'linkcard,.*': function (analyticsProperties) {
                updatePageProperties('profile:link card step 1 details', analyticsProperties);
            },
            'otp:verify,linkcard': function (analyticsProperties) {
                updatePageProperties('profile:link card step 2 otp', analyticsProperties);
            },
            'migrate,.*': function (analyticsProperties) {
                updatePageProperties('profile:migration step 1 details', analyticsProperties);
            },
            'otp:verify,migrate': function (analyticsProperties) {
                updatePageProperties('profile:migration step 2 otp', analyticsProperties);
            },
            'transaction:dashboard,.*': function (analyticsProperties) {
                updatePageProperties('transact dashboard', analyticsProperties);
            },
            'beneficiaries:add,beneficiaries:add': function (analyticsProperties) {
                updatePageProperties('beneficiaries:add new step 2 confirmation', analyticsProperties);
            },
            'beneficiaries:add,(transaction:dashboard|beneficiaries:list)': function (analyticsProperties) {
                updatePageProperties('beneficiaries:add new step 1 details', analyticsProperties);
            },
            'otp:verify,beneficiaries:add': function (analyticsProperties) {
                updatePageProperties('beneficiaries:add new step 3 otp', analyticsProperties);
            },
            'beneficiaries:edit,beneficiaries:edit': function (analyticsProperties) {
                updatePageProperties('beneficiaries:edit step 2 confirmation', analyticsProperties);
            },
            'beneficiaries:edit,beneficiaries:list': function (analyticsProperties) {
                updatePageProperties('beneficiaries:edit step 1 details', analyticsProperties);
            },
            'otp:verify,beneficiaries:edit': function (analyticsProperties) {
                updatePageProperties('beneficiaries:edit otp', analyticsProperties);
            },
            'beneficiaries:groups:list,.*': function (analyticsProperties) {
                updatePageProperties('beneficiaries:list groups', analyticsProperties);
            },
            'beneficiaries:groups:view,.*': function (analyticsProperties) {
                updatePageProperties('beneficiaries:view group', analyticsProperties);
            },
            'beneficiaries:pay group:results:.*,.*': function (analyticsProperties) {
                updatePageProperties('payment:pay beneficiary group step 3 results', analyticsProperties);
            },
            'beneficiaries:pay group:confirm:.*,.*': function (analyticsProperties) {
                updatePageProperties('payment:pay beneficiary group step 2 confirmation', analyticsProperties);
            },
            'beneficiaries:pay group:.*,.*': function (analyticsProperties) {
                updatePageProperties('payment:pay beneficiary group step 1 setup', analyticsProperties);
            },
            'beneficiaries:groups:add,.*': function (analyticsProperties) {
                updatePageProperties('beneficiaries:add beneficiary to group', analyticsProperties);
            },
            'otp:verify,beneficiaries:groups:add': function (analyticsProperties) {
                updatePageProperties('beneficiaries:add beneficiary to group otp', analyticsProperties);
            },
            'beneficiaries:pay multiple:confirm,.*': function (analyticsProperties) {
                updatePageProperties('payment:pay multiple beneficiaries step 2 confirmation', analyticsProperties);
            },
            'beneficiaries:pay multiple:results,.*': function (analyticsProperties) {
                updatePageProperties('payment:pay multiple beneficiaries step 3 results', analyticsProperties);
            },
            'beneficiaries:pay multiple,.*': function (analyticsProperties) {
                updatePageProperties('payment:pay multiple beneficiaries step 1 select beneficiary', analyticsProperties);
            },
            'payment:onceoff:confirm,.*': function (analyticsProperties) {
                updatePageProperties('payment:onceoff payment step 2 confirmation', analyticsProperties);
            },
            'otp:verify,payment:onceoff': function (analyticsProperties) {
                updatePageProperties('payment:onceoff payment step 3 otp', analyticsProperties);
            },
            'payment:onceoff:success,.*': function (analyticsProperties) {
                updatePageProperties('payment:onceoff payment step 4 results', analyticsProperties);
            },
            'payment:onceoff,.*': function (analyticsProperties) {
                updatePageProperties('payment:onceoff payment step 1 details', analyticsProperties);
            },
            '^payment:beneficiary$,.*': function (analyticsProperties) {
                updatePageProperties('payment:pay single beneficiary step 1 details', analyticsProperties);
            },
            '^international payment$,.*': function (analyticsProperties) {
                updatePageProperties('payment:international payment overview', analyticsProperties);
            },
            '^international payment:personal details$,.*': function (analyticsProperties) {
                updatePageProperties('payment:international payment step 1 details', analyticsProperties);
            },
            '^international payment:beneficiary:details$,.*': function (analyticsProperties) {
                updatePageProperties('payment:international payment step 2 beneficiary:details', analyticsProperties);
            },
            '^international payment:beneficiary:bank details$,.*': function (analyticsProperties) {
                updatePageProperties('payment:international payment step 2 beneficiary:banking details', analyticsProperties);
            },
            '^international payment:beneficiary:preferences$,.*': function (analyticsProperties) {
                updatePageProperties('payment:international payment step 2 beneficiary:preferences', analyticsProperties);
            },
            '^international payment:reason$,.*': function (analyticsProperties) {
                updatePageProperties('payment:international payment step 3 reason for payment', analyticsProperties);
            },
            '^international payment:pay$,^international payment:reason$': function (analyticsProperties) {
                updatePageProperties('payment:international payment step 4 payment', analyticsProperties);
            },
            'otp:verify,^international payment:pay$': function (analyticsProperties) {
                updatePageProperties('payment:international payment step 5 otp', analyticsProperties);
            },
            '^international payment:confirm$,otp:verify': function (analyticsProperties) {
                updatePageProperties('payment:international payment step 6 confirmation', analyticsProperties);
            },
            '^statements\\:?([0-9-\\s]+)?,.*': function (analyticsProperties, currentUrl) {
                var currentUrlLC = currentUrl.toLowerCase();
                var daysExtract = '';
                var newPageName = 'statements:view provisional statement';
                if (currentUrl.indexOf('statementtype') > 0) {
                    if (currentUrlLC.indexOf('thirty') > 0) {
                        daysExtract = '30';
                    } else if (currentUrlLC.indexOf('sixty') > 0) {
                        daysExtract = '60';
                    } else if (currentUrlLC.indexOf('ninety') > 0) {
                        daysExtract = '90';
                    } else if (currentUrlLC.indexOf('onehundredeighty') > 0) {
                        daysExtract = '180';
                    }
                    newPageName = 'statements:view history statement ' + daysExtract;
                    if (currentUrlLC.indexOf('provisional') > 0) {
                        newPageName = 'statements:view provisional statement';
                    }
                }
                updatePageProperties(newPageName, analyticsProperties);
            },
            '^formal statements$,.*': function (analyticsProperties) {
                updatePageProperties('statements:view formal statement', analyticsProperties);
            },
            '^payment notification:history.*,.*': function (analyticsProperties) {
                updatePageProperties('payment:notifications history', analyticsProperties);
            },
            '^payment:scheduled:manage,.*': function (analyticsProperties) {
                updatePageProperties('payment:view scheduled payments', analyticsProperties);
            },
            '^payment:scheduled:modify$,.*': function (analyticsProperties) {
                updatePageProperties('payment:modify scheduled payment step 1 details', analyticsProperties);
            },
            '^payment:scheduled:modify:confirm,.*': function (analyticsProperties) {
                updatePageProperties('payment:modify scheduled payment step 2 confirmation', analyticsProperties);
            },
            'transfers,transaction:dashboard': function (analyticsProperties) {
                updatePageProperties('transfers:transfer between accounts step 1 details', analyticsProperties);
            },
            '^instant money$,.*': function (analyticsProperties) {
                updatePageProperties('transfers:instant money overview', analyticsProperties);
            },
            '^instant money:details,.*': function (analyticsProperties) {
                updatePageProperties('transfers:instant money:send money step 1 details', analyticsProperties);
            },
            '^instant money:confirm,instant money:details': function (analyticsProperties) {
                updatePageProperties('transfers:instant money:send money step 2 confirmation', analyticsProperties);
            },
            'otp:verify,instant money:confirm': function (analyticsProperties) {
                updatePageProperties('transfers:instant money:send money step 3 otp', analyticsProperties);
            },
            'instant money:success,otp:verify': function (analyticsProperties) {
                updatePageProperties('transfers:instant money:send money step 4 complete', analyticsProperties);
            },
            '^instant money:change pin$': function (analyticsProperties) {
                updatePageProperties('transfers:instant money:change pin step 1 details', analyticsProperties);
            },
            '^instant money:change pin:confirm': function (analyticsProperties) {
                updatePageProperties('transfers:instant money:change pin step 2 confirmation', analyticsProperties);
            },
            '^instant money:change pin:success': function (analyticsProperties) {
                updatePageProperties('transfers:instant money:change pin step 3 complete', analyticsProperties);
            },
            '^apply:(puresave|marketlink|taxfreecallaccount)$,.*': function (analyticsProperties, currentUrl) {
                if (currentUrl.indexOf('puresave') > 0) {
                    updatePageProperties('account application:pure save overview', analyticsProperties);
                } else if (currentUrl.indexOf('marketlink') > 0) {
                    updatePageProperties('account application:market link overview', analyticsProperties);
                } else {
                    updatePageProperties('account application:tax free call account overview', analyticsProperties);
                }
            },

            '^apply:pure save:(transfer|accept|finish|declined)$,.*': function (analyticsProperties, currentUrl) {
                if (currentUrl.indexOf('transfer') > 0) {
                    updatePageProperties('account application:pure save step 2 transfer', analyticsProperties);
                } else if (currentUrl.indexOf('accept') > 0) {
                    updatePageProperties('account application:pure save step 3 confirmation', analyticsProperties);
                } else if (currentUrl.indexOf('finish') > 0) {
                    updatePageProperties('account application:pure save step 4 complete', analyticsProperties);
                } else {
                    updatePageProperties('account application:pure save declined', analyticsProperties);
                }
            },
            '^apply:pure save:profile(:edit)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:pure save step 1 details:profile', analyticsProperties);
            },
            'otp:verify,^apply:pure save:profile:edit$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:pure save step 1 details:profile otp', analyticsProperties);
            },
            '^apply:pure save:address$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:pure save step 1 details:address', analyticsProperties);
            },
            '^apply:pure save:employment(:edit|:add)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:pure save step 1 details:employment', analyticsProperties);
            },
            'otp:verify,^apply:pure save:employment:(edit|add)$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:pure save step 1 details:employment otp', analyticsProperties);
            },
            '^apply:pure save:income(:edit)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:pure save step 1 details:income and expenses', analyticsProperties);
            },
            'otp:verify,^apply:pure save:income:edit$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:pure save step 1 details:income and expenses otp', analyticsProperties);
            },
            '^apply:pure save:submit(:edit)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:pure save step 1 details:submit application', analyticsProperties);
            },
            'otp:verify,^apply:pure save:submit:edit$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:pure save step 1 details:submit application otp', analyticsProperties);
            },
            '^apply:market link:(transfer|accept|finish|declined)$,.*': function (analyticsProperties, currentUrl) {
                if (currentUrl.indexOf('transfer') > 0) {
                    updatePageProperties('account application:market link step 2 transfer', analyticsProperties);
                } else if (currentUrl.indexOf('accept') > 0) {
                    updatePageProperties('account application:market link step 3 confirmation', analyticsProperties);
                } else if (currentUrl.indexOf('finish') > 0) {
                    updatePageProperties('account application:market link step 4 complete', analyticsProperties);
                } else {
                    updatePageProperties('account application:market link declined', analyticsProperties);
                }
            },
            '^apply:market link:profile(:edit)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:market link step 1 details:profile', analyticsProperties);
            },
            'otp:verify,^apply:market link:profile:edit$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:market link step 1 details:profile otp', analyticsProperties);
            },
            '^apply:market link:address$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:market link step 1 details:address', analyticsProperties);
            },
            '^apply:market link:employment(:edit|:add)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:market link step 1 details:employment', analyticsProperties);
            },
            'otp:verify,^apply:market link:employment:(edit|add)$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:market link step 1 details:employment otp', analyticsProperties);
            },
            '^apply:market link:income(:edit)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:market link step 1 details:income and expenses', analyticsProperties);
            },
            'otp:verify,^apply:market link:income:edit$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:market link step 1 details:income and expenses otp', analyticsProperties);
            },
            '^apply:market link:submit(:edit)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:market link step 1 details:submit application', analyticsProperties);
            },
            'otp:verify,^apply:market link:submit:edit$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:market link step 1 details:submit application otp', analyticsProperties);
            },
            '^apply:tax free call account:(transfer|accept|finish|declined)$,.*': function (analyticsProperties, currentUrl) {
                if (currentUrl.indexOf('transfer') > 0) {
                    updatePageProperties('account application:tax free call account step 2 transfer', analyticsProperties);
                } else if (currentUrl.indexOf('accept') > 0) {
                    updatePageProperties('account application:tax free call account step 3 confirmation', analyticsProperties);
                } else if (currentUrl.indexOf('finish') > 0) {
                    updatePageProperties('account application:tax free call account step 4 complete', analyticsProperties);
                } else {
                    updatePageProperties('account application:tax free call account declined', analyticsProperties);
                }
            },
            '^apply:tax free call account:profile(:edit)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:tax free call account step 1 details:profile', analyticsProperties);
            },
            'otp:verify,^apply:tax free call account:profile:edit$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:tax free call account step 1 details:profile otp', analyticsProperties);
            },
            '^apply:tax free call account:address$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:tax free call account step 1 details:address', analyticsProperties);
            },
            '^apply:tax free call account:employment(:edit|:add)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:tax free call account step 1 details:employment', analyticsProperties);
            },
            'otp:verify,^apply:tax free call account:employment:(edit|add)$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:tax free call account step 1 details:employment otp', analyticsProperties);
            },
            '^apply:tax free call account:income(:edit)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:tax free call account step 1 details:income and expenses', analyticsProperties);
            },
            'otp:verify,^apply:tax free call account:income:edit$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:tax free call account step 1 details:income and expenses otp', analyticsProperties);
            },
            '^apply:tax free call account:submit(:edit)?$,.*': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:tax free call account step 1 details:submit application', analyticsProperties);
            },
            'otp:verify,^apply:tax free call account:submit:edit$': function (analyticsProperties, currentUrl) {
                updatePageProperties('account application:tax free call account step 1 details:submit application otp', analyticsProperties);
            },
            'apply:savings and investments,.*': function (analyticsProperties) {
                updatePageProperties('account application:savings and investments:select an account', analyticsProperties);
            },
            '^apply:rcp$,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp overview', analyticsProperties);
            },
            'apply:rcp:pre screen,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp pre-screening', analyticsProperties);
            },
            'apply:rcp:(profile|profile:new|profile:edit|contact:edit),.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:profile', analyticsProperties);
            },
            'otp:verify,apply:rcp:(profile|profile:new|profile:edit|contact:edit)': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:profile otp', analyticsProperties);
            },
            'apply:rcp:address(:edit)?,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:address', analyticsProperties);
            },
            'otp:verify,apply:rcp:address(:edit)?': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:address otp', analyticsProperties);
            },
            'apply:rcp:employment(:edit|add)?,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:employment', analyticsProperties);
            },
            'otp:verify,apply:rcp:employment(:edit|add)?': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:employment otp', analyticsProperties);
            },
            'apply:rcp:income(:edit)?,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:income and expenses', analyticsProperties);
            },
            'otp:verify,apply:rcp:income(:edit)?': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:income and expenses otp', analyticsProperties);
            },
            'apply:rcp:submit(:edit)?,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:submit application', analyticsProperties);
            },
            'otp:verify,apply:rcp:submit(:edit)?': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 1 details:submit application otp', analyticsProperties);
            },
            '^apply:rcp:declined$,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp application declined', analyticsProperties);
            },
            '^apply:rcp:offer$,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 2 offer', analyticsProperties);
            },
            '^apply:rcp:confirm$,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 3 confirmation', analyticsProperties);
            },
            '^apply:rcp:finish$,.*': function (analyticsProperties) {
                updatePageProperties('account application:rcp step 4 complete', analyticsProperties);
            },
            '^apply:current account:unsupported$,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account unsupported offer', analyticsProperties);
            },
            'apply:current account:(profile|profile:new|profile:edit|contact:edit),.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:profile', analyticsProperties);
            },
            'otp:verify,apply:current account:(profile|profile:new|profile:edit|contact:edit)': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:profile otp', analyticsProperties);
            },
            'apply:current account:address(:edit)?,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:address', analyticsProperties);
            },
            'otp:verify,apply:current account:address(:edit)?': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:address otp', analyticsProperties);
            },
            'apply:current account:employment(:edit|add)?,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:employment', analyticsProperties);
            },
            'otp:verify,apply:current account:employment(:edit|add)?': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:employment otp', analyticsProperties);
            },
            'apply:current account:income(:edit)?,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:income and expenses', analyticsProperties);
            },
            'otp:verify,apply:current account:income(:edit)?': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:income and expenses otp', analyticsProperties);
            },
            'apply:current account:submit(:edit)?,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:submit application', analyticsProperties);
            },
            'otp:verify,apply:current account:submit(:edit)?': function (analyticsProperties) {
                updatePageProperties('account application:current account step 1 details:submit application otp', analyticsProperties);
            },
            'apply:current account:offer,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 2 offer', analyticsProperties);
            },
            '^apply:current account:accept$,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 3 confirmation:account', analyticsProperties);
            },
            '^apply:current account:debit order switching$,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 3 confirmation:debit order switching', analyticsProperties);
            },
            '^apply:current account:accept:card$,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 3 confirmation:accept card', analyticsProperties);
            },
            '^apply:current account:finish$,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account step 4 complete', analyticsProperties);
            },
            '^apply:current account:pre screen$,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account pre-screening', analyticsProperties);
            },
            '^apply:current account:declined$,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account application declined', analyticsProperties);
            },
            '^apply:current account$,.*': function (analyticsProperties) {
                updatePageProperties('account application:current account overview', analyticsProperties);
            },
            '^apply$,.*': function (analyticsProperties) {
                updatePageProperties('account application:select an account', analyticsProperties);
            },
            '^targetedoffers:([a-z0-9\\s\\:]+)$,.*': function (analyticsProperties, currentUrl) {
                var targetedOffersCategory = currentUrl.replace(/(\?.*)?/g, '');
                targetedOffersCategory = targetedOffersCategory.split(':');
                targetedOffersCategory.shift();
                targetedOffersCategory = targetedOffersCategory.join(':');
                updatePageProperties('targeted offers:' + targetedOffersCategory, analyticsProperties);
            },
            'prepaid:history,.*': function (analyticsProperties) {
                updatePageProperties('prepaid:view history', analyticsProperties);
            },
            'prepaid:recharge:(mtn|vodacom|cellc|telkom mobile|virgin|electricity):confirm,.*': function (analyticsProperties) {
                var editedPageName = analyticsProperties.pageName.replace(/\:(mtn|vodacom|cellc|telkom\smobile|virgin|electricity):confirm/ig, ' $1') + ' step 2 confirmation';
                updatePageProperties(editedPageName, analyticsProperties);
            },
            'otp:verify,prepaid:recharge:(mtn|vodacom|cellc|telkom mobile|virgin|electricity):confirm': function (analyticsProperties, currentUrl, previousUrl) {
                var editedPageName = previousUrl.replace(/\:(mtn|vodacom|cellc|telkom\smobile|virgin|electricity):confirm/ig, ' $1') + ' step 3 otp';
                updatePageProperties(editedPageName, analyticsProperties);
            },
            'prepaid:recharge:(mtn|vodacom|cellc|telkom mobile|virgin|electricity):results,otp:verify': function (analyticsProperties) {
                var editedPageName = analyticsProperties.pageName.replace(/\:(mtn|vodacom|cellc|telkom\smobile|virgin|electricity):results/ig, ' $1') + ' step 4 results';
                updatePageProperties(editedPageName, analyticsProperties);
            },
            'prepaid:recharge:(mtn|vodacom|cellc|telkom mobile|virgin|electricity),.*': function (analyticsProperties) {
                var editedPageName = analyticsProperties.pageName.replace(/\:(mtn|vodacom|cellc|telkom\smobile|virgin|electricity)/ig, ' $1') + ' step 1 details';
                updatePageProperties(editedPageName, analyticsProperties);
            },
            '^prepaid$,.*': function (analyticsProperties) {
                updatePageProperties('prepaid:selection', analyticsProperties);
            },
            'secure message:confirm,.*': function (analyticsProperties) {
                updatePageProperties('secure message:send step 2 confirmation', analyticsProperties);
            },
            'otp:verify,secure message:confirm': function (analyticsProperties) {
                updatePageProperties('secure message:send step 3 otp', analyticsProperties);
            },
            'secure message:results,otp:verify': function (analyticsProperties) {
                updatePageProperties('secure message:send step 4 results', analyticsProperties);
            },
            'secure message,.*': function (analyticsProperties) {
                updatePageProperties('secure message:send step 1 message', analyticsProperties);
            },
            'otp:verify,adddashboard': function (analyticsProperties) {
                updatePageProperties('dashboard:add dashboard step 2 otp', analyticsProperties);
            },
            'adddashboard:savename,.*': function (analyticsProperties) {
                updatePageProperties('dashboard:add dashboard step 3 save name', analyticsProperties);
            },
            '^adddashboard$,.*': function (analyticsProperties) {
                updatePageProperties('dashboard:add dashboard step 1 details', analyticsProperties);
            },
            'choose dashboard,.*': function (analyticsProperties) {
                updatePageProperties('dashboard:choose dashboard', analyticsProperties);
            },
            'switchdashboard,.*': function (analyticsProperties) {
                updatePageProperties('dashboard:switch dashboard', analyticsProperties);
            },
            '^dashboard,.*': function (analyticsProperties) {
                updatePageProperties('profile:dashboard', analyticsProperties);
            },
            'monthly payment limit,.*': function (analyticsProperties) {
                updatePageProperties('profile:monthly payment limit', analyticsProperties);
            },
            'otp:verify,monthly payment limit': function (analyticsProperties) {
                updatePageProperties('profile:monthly payment limit increase otp', analyticsProperties);
            },
            'internet banking,.*': function (analyticsProperties) {
                updatePageProperties('profile:internet banking', analyticsProperties);
            },
            '^account preferences(\:[0-9])?,.*': function (analyticsProperties) {
                updatePageProperties('profile:product preferences', analyticsProperties);
            },
            '^edit account preferences(\:[0-9])?,.*': function (analyticsProperties) {
                updatePageProperties('profile:edit product preferences step 1 details', analyticsProperties);
            },
            'otp:verify,^edit account preferences(\:[0-9])?': function (analyticsProperties) {
                updatePageProperties('profile:edit product preferences step 2 otp', analyticsProperties);
            },
            'change password,.*': function (analyticsProperties) {
                updatePageProperties('profile:change password', analyticsProperties);
            },
            'reset password:details,.*': function (analyticsProperties) {
                updatePageProperties('profile:reset password step 2 details', analyticsProperties);
            },
            'reset password,.*': function (analyticsProperties) {
                updatePageProperties('profile:reset password step 1', analyticsProperties);
            },
            'otp:verify,reset password': function (analyticsProperties) {
                updatePageProperties('profile:reset password step 3 otp', analyticsProperties);
            },
            '^otp:activate:([0-9]+|profileid),.*': function (analyticsProperties) {
                updatePageProperties('profile:activate your otp setp 1 details', analyticsProperties);
            },
            '^otp:activate:confirm:([0-9]+|profileid),^otp:activate:([0-9]+|profileid)': function (analyticsProperties) {
                updatePageProperties('profile:activate your otp setp 2 confirmation', analyticsProperties);
            },
            'otp:verify,^otp:activate:confirm:([0-9]+|profileid)': function (analyticsProperties) {
                updatePageProperties('profile:activate your otp setp 3 otp', analyticsProperties);
            },
            'otp:activate:success:([0-9]+|profileid)+,otp:verify': function (analyticsProperties) {
                updatePageProperties('profile:activate your otp setp 4 results', analyticsProperties);
            },
             'otp:verify,choose dashboard': function (analyticsProperties) {
                updatePageProperties('profile:activate your internet banking', analyticsProperties);
            },
            undefined: function () {
            }
        };

        var matchNavigationFor = function (currentPath, previousPath) {
            var navigationMatch = Object.keys(modifyFunctionsForNavigation).filter(function (element) {
                var navigationPaths = element.split(',');
                return new RegExp(navigationPaths[0]).test(currentPath) &&
                    new RegExp(navigationPaths[1]).test(previousPath);
            });

            return navigationMatch[0];
        };

        var modifyPropertiesForNavigation = function (currentPath, previousPath, properties) {
            // Make sure that the data only conain hash path and excl any ? and query params
            var currentPathCleanStrict = currentPath.replace(/(\?.*)?/g, '');
            var previousPathCleanStrict = previousPath.replace(/(\?.*)?/g, '');

            var modifyFunction = modifyFunctionsForNavigation[matchNavigationFor(currentPathCleanStrict, previousPathCleanStrict)];
            modifyFunction(properties, currentPath, previousPath);
        };

        var updatePageProperties = function (pageName, properties) {
            var currentPathSplit = pageName.split(':');
            properties.pageName = pageName;
            properties.pageCategory = currentPathSplit[0];
            properties.pageSubSection1 = currentPathSplit.length > 1 ? currentPathSplit[0] + ":" + currentPathSplit[1] : currentPathSplit[0];
            properties.pageSubSection2 = currentPathSplit.length > 2 ? currentPathSplit[0] + ":" + currentPathSplit[1] + ":" + currentPathSplit[2] : "";
            properties.pageSubSection3 = currentPathSplit.length > 3 ? currentPathSplit[0] + ":" + currentPathSplit[1] + ":" + currentPathSplit[2] + ":" + currentPathSplit[3] : "";
            properties.pageSubSection4 = currentPathSplit.length > 4 ? currentPathSplit[0] + ":" + currentPathSplit[1] + ":" + currentPathSplit[2] + ":" + currentPathSplit[3] + ":" + currentPathSplit[4] : "";
        };

        var formAnalytics = function (analyticsProperties) {
            for (var property in analyticsProperties) {
                dataLayer[property] = analyticsProperties[property];
            }
        };


        return {
            recordLogin: function () {
                if (!dtmAnalyticsFeature) {
                    return;
                }

                formAnalytics({'userLoginSuccess': true, 'loginStatus': 'logged in'});
            },

            recordFormSubmission: function () {
                if (!dtmAnalyticsFeature) {
                    return;
                }
                formAnalytics({'formisSubmitted': true});
            },

            recordFormSubmissionCompletion: function () {
                if (!dtmAnalyticsFeature) {
                    return;
                }
                formAnalytics({'formStatus': "complete", 'formisSubmitted': false});
            },

            cancelFormSubmissionRecord: function () {
                if (!dtmAnalyticsFeature) {
                    return;
                }
                formAnalytics({'formStatus': "", 'formisSubmitted': false});
            },

            sendError: function (errorMessage, errorCode, url) {
                if (!dtmAnalyticsFeature || typeof _satellite === "undefined" || !_satellite) {
                    return;
                }

                if (!errorCode && dataLayer.siteErrorCode && dataLayer.siteErrorCode.indexOf('|')) {
                    errorCode = dataLayer.siteErrorCode.split('|')[0];
                }

                if (errorMessage) {
                    errorCode = errorCode && errorCode != 'null' ? errorCode : 'noerrorcode';
                    dataLayer.siteErrorCode = errorCode + '|' + errorMessage;

                    if (url) {
                        dataLayer.siteErrorCode = dataLayer.siteErrorCode + '|' + url;
                    }

                    _satellite.track('sendSiteErrorCode');
                } else {
                    dataLayer.siteErrorCode = errorCode + '|';
                }

            },

            sendPageView: function (currentUrl, previousUrl) {
                if (!dtmAnalyticsFeature || typeof _satellite === "undefined" || !_satellite) {
                    return;
                }

                var currentPrettyPath = cleanPathId(prettyPathFromURL(currentUrl));
                var currentPrettyPathStrict = currentPrettyPath.replace(/(\?.*)?/g, '');
                var previousPrettyPath = prettyPathFromURL(previousUrl);
                currentPage = currentPrettyPath;

                var analyticsProperties = {
                    pageName: "",
                    pageCategory: "",
                    pageSubSection1: "",
                    pageSubSection2: "",
                    pageSubSection3: "",
                    pageSubSection4: ""
                };

                updatePageProperties(currentPrettyPathStrict, analyticsProperties);
                modifyPropertiesForNavigation(currentPrettyPath, previousPrettyPath, analyticsProperties);

                for (var property in analyticsProperties) {
                    dataLayer[property] = analyticsProperties[property];
                }

                if (currentUrl === previousUrl) {
                    _satellite.track('globalVirtualPageView');
                }
            },
            setCustomerSAPBPID: function (customerSAPBPID) {
                if(customerSAPBPID === undefined) {
                    customerSAPBPID = '';
                }
                dataLayer.customerSAPBPID = customerSAPBPID;
            }
        };
    });

    app.directive('dtmAnalytics', function (DtmAnalyticsService, AnalyticsContainer, $location) {
        return {
            restrict: 'E',
            link: function ($scope) {

                AnalyticsContainer.containerUrlForHost().then(function (containerUrl) {
                    $.ajax({
                        url: containerUrl,
                        dataType: 'script',
                        cache: true
                    }).done(function () {
                        _satellite.pageBottom();

                        DtmAnalyticsService.sendPageView($location.absUrl(), $location.absUrl());

                        $scope.$on('$locationChangeSuccess', function (event, current, previous) {
                            DtmAnalyticsService.sendPageView(current, previous);
                        });

                        $scope.$on('unsuccessfulMcaResponse', function (event, errorMessage, errorCode, url) {
                            DtmAnalyticsService.sendError(errorMessage, errorCode, url);
                        });
                    });
                });
            }
        };
    });


})(angular.module('refresh.dtmanalytics', ['refresh.card', 'refresh.analytics.container']));
