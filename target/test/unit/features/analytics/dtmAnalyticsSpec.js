var dataLayer = {
    'applicationID': '',
    'applicationStep': '',
    'articleName': '',
    'deviceType': "Desktop",
    'domainName': window.location.hostname,
    'formName': '',
    'formisSubmitted': false,
    'formStatus': "",
    'numSearchResults': '',
    'pageCategory': '',
    'pageName': '',
    'pageSubSection1': '',
    'pageSubSection2': '',
    'pageSubSection3': '',
    'pageSubSection4': '',
    'searchTerm': '',
    'selfServiceType': '',
    'siteBusinessUnit': 'digital channels',
    'siteCountry': 'South Africa',
    'siteLanguage': 'English',
    'videoName': '',
    'userInteraction': '',
    'userLoginSuccess': '',
    'userRegistrationSuccess': '',
    'loginStatus': '',
    'userID': '',
    'websiteName': 'Internet Banking Refresh',
    'websiteNameCode': 'IBR',
    customerSAPBPID: ''
};

var _satellite = {
    track: function () {
    }, pageBottom: function () {
    }
};

describe('dtm analytics', function () {
    var calledSt, calledStl;
    beforeEach(module('refresh.dtmanalytics', 'refresh.baseUrlHelper', 'refresh.test'));

    beforeEach(function () {
        spyOn(_satellite, 'track');
    });

    describe('DtmAnalyticsService', function () {
        beforeEach(inject(function (DtmAnalyticsService) {
            this.DtmAnalyticsService = DtmAnalyticsService;
        }));

        describe('sendPageView', function () {

            describe('on logged in status ', function () {
                it('should set the user as guest if not logged in', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/login', 'http://localhost:8080/index.html#/login');

                    expect(dataLayer.loginStatus).toEqual('guest');
                });

                it('should set the registration, logged in events and logged in status if user just registered', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/new-registered', 'http://localhost:8080/index.html#/otp/verify');

                    expect(dataLayer.loginStatus).toEqual("logged in");
                    expect(dataLayer.userLoginSuccess).toEqual(true);
                    expect(dataLayer.userRegistrationSuccess).toEqual(true);
                });
            });

            it('should send the page view', function () {
                this.DtmAnalyticsService.sendPageView('', '');

                expect(_satellite.track).toHaveBeenCalledWith('globalVirtualPageView');
            });

            it('should set the page category to the first part of the page name', function () {
                this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/account/dashboard', '');

                expect(dataLayer.pageCategory).toEqual('account');
                expect(dataLayer.pageSubSection1).toEqual('account:dashboard');
            });

            it('Test to see if there are different parts in a particular page name', function () {
                this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/account', '');

                expect(dataLayer.pageSubSection1).toEqual('account');
                expect(dataLayer.pageSubSection2).toEqual('');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });

            it('should set the pageSubSection3 to the first 4 parts of the page name if available', function () {
                this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/account/dashboard/summary/description', '');

                expect(dataLayer.pageSubSection3).toEqual('account:dashboard:summary:description');
            });

            it('should set the pageSubSection2 to the first 3 parts of the page name if available', function () {
                this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/account/dashboard/summary', '');

                expect(dataLayer.pageSubSection2).toEqual('account:dashboard:summary');
            });

            it('should set the pageSubSection4 to the first 5 parts of the page name if available', function () {
                this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/account/dashboard/summary/description/detail', '');

                expect(dataLayer.pageSubSection4).toEqual('account:dashboard:summary:description:detail');
            });


            it('should set the page properties for transact dashboard', function () {
                this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/transaction/dashboard', '');

                expect(dataLayer.pageName).toEqual('transact dashboard');
                expect(dataLayer.pageCategory).toEqual('transact dashboard');
                expect(dataLayer.pageSubSection1).toEqual('transact dashboard');
                expect(dataLayer.pageSubSection2).toEqual('');
            });

            describe('Instant Money Transfer', function () {
                it('Should set the page properties when using instant money overview', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/instant-money', '');

                    expect(dataLayer.pageName).toEqual('transfers:instant money overview');
                    expect(dataLayer.pageCategory).toEqual('transfers');
                    expect(dataLayer.pageSubSection1).toEqual('transfers:instant money overview');
                });
                it('Should set the page properties when using instant money  to send money step 1', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/instant-money/details', '');

                    expect(dataLayer.pageName).toEqual('transfers:instant money:send money step 1 details');
                    expect(dataLayer.pageCategory).toEqual('transfers');
                    expect(dataLayer.pageSubSection1).toEqual('transfers:instant money');
                    expect(dataLayer.pageSubSection2).toEqual('transfers:instant money:send money step 1 details');
                });
                it('Should set the page properties when using instant money  to send money step 2', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/instant-money/confirm', 'http://localhost:8080/#/instant-money/details');

                    expect(dataLayer.pageName).toEqual('transfers:instant money:send money step 2 confirmation');
                    expect(dataLayer.pageCategory).toEqual('transfers');
                    expect(dataLayer.pageSubSection1).toEqual('transfers:instant money');
                    expect(dataLayer.pageSubSection2).toEqual('transfers:instant money:send money step 2 confirmation');
                });
                it('Should set the page properties when using instant money  to send money step 3', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/#/instant-money/confirm');

                    expect(dataLayer.pageName).toEqual('transfers:instant money:send money step 3 otp');
                    expect(dataLayer.pageCategory).toEqual('transfers');
                    expect(dataLayer.pageSubSection1).toEqual('transfers:instant money');
                    expect(dataLayer.pageSubSection2).toEqual('transfers:instant money:send money step 3 otp');
                });
                it('Should set the page properties when using instant money  to send money step 4', function () {
                    this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/instant-money/success', 'http://localhost:8080/index.html#/otp/verify');

                    expect(dataLayer.pageName).toEqual('transfers:instant money:send money step 4 complete');
                    expect(dataLayer.pageCategory).toEqual('transfers');
                    expect(dataLayer.pageSubSection1).toEqual('transfers:instant money');
                    expect(dataLayer.pageSubSection2).toEqual('transfers:instant money:send money step 4 complete');
                });

                it('Should set the page properties when using instant money on change pin step 1', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/instant-money/change-pin', '');

                    expect(dataLayer.pageName).toEqual('transfers:instant money:change pin step 1 details');
                    expect(dataLayer.pageCategory).toEqual('transfers');
                    expect(dataLayer.pageSubSection1).toEqual('transfers:instant money');
                    expect(dataLayer.pageSubSection2).toEqual('transfers:instant money:change pin step 1 details');
                });
                it('Should set the page properties when using instant money on change pin step 2', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/instant-money/change-pin/confirm', '');

                    expect(dataLayer.pageName).toEqual('transfers:instant money:change pin step 2 confirmation');
                    expect(dataLayer.pageCategory).toEqual('transfers');
                    expect(dataLayer.pageSubSection1).toEqual('transfers:instant money');
                    expect(dataLayer.pageSubSection2).toEqual('transfers:instant money:change pin step 2 confirmation');
                });
                it('Should set the page properties when using instant money on change pin step 3', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/instant-money/change-pin/success', '');

                    expect(dataLayer.pageName).toEqual('transfers:instant money:change pin step 3 complete');
                    expect(dataLayer.pageCategory).toEqual('transfers');
                    expect(dataLayer.pageSubSection1).toEqual('transfers:instant money');
                    expect(dataLayer.pageSubSection2).toEqual('transfers:instant money:change pin step 3 complete');
                });

            });

            describe('Account Application', function () {
                it('should set page properties on account application selection page', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply', '');

                    expect(dataLayer.pageName).toEqual('account application:select an account');
                    expect(dataLayer.pageCategory).toEqual('account application');
                    expect(dataLayer.pageSubSection1).toEqual('account application:select an account');
                    expect(dataLayer.pageSubSection2).toEqual('');
                    expect(dataLayer.pageSubSection3).toEqual('');
                    expect(dataLayer.pageSubSection4).toEqual('');
                });

                describe('Saving and Inv account Application', function () {

                    it('should set page properties on account application for puresave', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/puresave', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save overview');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save overview');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when declined', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/declined', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save declined');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save declined');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 1 profile', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/profile', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:profile');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:profile');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on account application for puresave when applying step 1 profile edit needed', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/profile/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:profile');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:profile');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave step 1 profile OTP', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/pure-save/profile/edit');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:profile otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:profile otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 1 address', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/address', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:address');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:address');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 1 employment', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/employment', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 1 employment on edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/employment/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 1 employment on add action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/employment/add', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave step 1 employment OTP after edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/pure-save/employment/edit');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:employment otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:employment otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave step 1 employment OTP after add action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/pure-save/employment/add');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:employment otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:employment otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 1 income and expenses', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/income', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:income and expenses');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:income and expenses');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 1 income and expenses edit needed', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/income/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:income and expenses');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:income and expenses');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave step 1 employment OTP after edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/pure-save/income/edit');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:income and expenses otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:income and expenses otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 1 submit application', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/submit', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:submit application');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:submit application');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 1 submit application on edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/submit/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:submit application');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:submit application');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave step 1 submit application OTP after edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/pure-save/submit/edit');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 1 details:submit application otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:pure save step 1 details:submit application otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });


                    it('should set page properties on account application for puresave when applying step2', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/transfer', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 2 transfer');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 2 transfer');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 3', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/accept', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 3 confirmation');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 3 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for puresave when applying step 4', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/pure-save/finish', '');

                        expect(dataLayer.pageName).toEqual('account application:pure save step 4 complete');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:pure save step 4 complete');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on account application for marketlink', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/marketlink', '');

                        expect(dataLayer.pageName).toEqual('account application:market link overview');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link overview');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when declined', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/declined', '');

                        expect(dataLayer.pageName).toEqual('account application:market link declined');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link declined');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying  step 1', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/profile', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:profile');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:profile');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on account application for marketlink when applying step 1 profile edit needed', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/profile/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:profile');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:profile');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink step 1 profile OTP', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/market-link/profile/edit');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:profile otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:profile otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying step 1 address', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/address', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:address');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:address');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying step 1 employment', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/employment', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying step 1 employment on edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/employment/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying step 1 employment on add action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/employment/add', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink step 1 employment OTP after edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/market-link/employment/edit');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:employment otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:employment otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink step 1 employment OTP after add action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/market-link/employment/add');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:employment otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:employment otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying step 1 income and expenses', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/income', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:income and expenses');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:income and expenses');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying step 1 income and expenses edit needed', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/income/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:income and expenses');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:income and expenses');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink step 1 employment OTP after edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/market-link/income/edit');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:income and expenses otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:income and expenses otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying step 1 submit application', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/submit', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:submit application');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:submit application');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying step 1 submit application on edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/submit/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:submit application');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:submit application');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink step 1 submit application OTP after edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/market-link/submit/edit');

                        expect(dataLayer.pageName).toEqual('account application:market link step 1 details:submit application otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:market link step 1 details:submit application otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on account application for marketlink when applying  step 2', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/transfer', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 2 transfer');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 2 transfer');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying  step 3', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/accept', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 3 confirmation');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 3 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for marketlink when applying  step 4', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/market-link/finish', '');

                        expect(dataLayer.pageName).toEqual('account application:market link step 4 complete');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:market link step 4 complete');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on account application for taxfreecallaccount', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/taxfreecallaccount', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account overview');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account overview');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for taxfreecallaccount when declined', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/declined', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account declined');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account declined');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying  step 1', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/profile', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:profile');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:profile');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying step 1 profile edit needed', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/profile/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:profile');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:profile');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account step 1 profile OTP', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/tax-free-call-account/profile/edit');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:profile otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:profile otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying step 1 address', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/address', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:address');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:address');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying step 1 employment', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/employment', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying step 1 employment on edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/employment/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying step 1 employment on add action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/employment/add', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account step 1 employment OTP after edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/tax-free-call-account/employment/edit');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:employment otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:employment otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account step 1 employment OTP after add action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/tax-free-call-account/employment/add');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:employment otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:employment otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying step 1 income and expenses', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/income', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:income and expenses');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:income and expenses');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying step 1 income and expenses edit needed', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/income/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:income and expenses');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:income and expenses');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account step 1 employment OTP after edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/tax-free-call-account/income/edit');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:income and expenses otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:income and expenses otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying step 1 submit application', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/submit', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:submit application');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:submit application');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying step 1 submit application on edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/submit/edit', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:submit application');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:submit application');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account step 1 submit application OTP after edit action', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/tax-free-call-account/submit/edit');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 1 details:submit application otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:tax free call account step 1 details:submit application otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on account application for tax free call account when applying  step 2', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/transfer', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 2 transfer');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 2 transfer');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying  step 3', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/accept', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 3 confirmation');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 3 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                    it('should set page properties on account application for tax free call account when applying  step 4', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/tax-free-call-account/finish', '');

                        expect(dataLayer.pageName).toEqual('account application:tax free call account step 4 complete');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:tax free call account step 4 complete');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on account application for main savings and inv overview page', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/savings-and-investments', '');

                        expect(dataLayer.pageName).toEqual('account application:savings and investments:select an account');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:savings and investments');
                        expect(dataLayer.pageSubSection2).toEqual('account application:savings and investments:select an account');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                });

                describe('RCP Application', function () {
                    it('should set page properties on application for RCP account overview page', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp overview');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp overview');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account pre screen page', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/pre-screen', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp pre-screening');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp pre-screening');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 profile', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/profile', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:profile');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:profile');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 profile otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/rcp/profile');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:profile otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:profile otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 address', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/address', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:address');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:address');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 address otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/rcp/address');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:address otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:address otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 employment', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/employment', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 employment otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/rcp/employment');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:employment otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:employment otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 income and expenses', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/income', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:income and expenses');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:income and expenses');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 income and expenses otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/rcp/income');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:income and expenses otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:income and expenses otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 submit application', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/submit', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:submit application');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:submit application');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account details step 1 submit application otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/rcp/submit');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 1 details:submit application otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:rcp step 1 details:submit application otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP application declined', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/declined', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp application declined');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp application declined');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account transfer step 2', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/offer', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 2 offer');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 2 offer');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account confirmation step 3', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/confirm', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 3 confirmation');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 3 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for RCP account complete step 4', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/rcp/finish', '');

                        expect(dataLayer.pageName).toEqual('account application:rcp step 4 complete');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:rcp step 4 complete');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                });

                describe('Unsupported offer', function () {
                    it('should set page properties on application for Current Account Unsupported offers', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/unsupported', '');

                        expect(dataLayer.pageName).toEqual('account application:current account unsupported offer');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account unsupported offer');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('Current Account Application', function () {
                    it('should set page properties on application for current account pre screen page', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/pre-screen', '');

                        expect(dataLayer.pageName).toEqual('account application:current account pre-screening');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account pre-screening');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for Current Account application declined', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/declined', '');

                        expect(dataLayer.pageName).toEqual('account application:current account application declined');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account application declined');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 profile application', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/profile', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:profile');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:profile');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 profile application otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/current-account/profile');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:profile otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:profile otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 address', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/address', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:address');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:address');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 address otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/current-account/address');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:address otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:address otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 employment', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/employment', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:employment');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:employment');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 employment otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/current-account/employment');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:employment otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:employment otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 income', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/income', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:income and expenses');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:income and expenses');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 income otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/current-account/income');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:income and expenses otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:income and expenses otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 submit application', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/submit', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:submit application');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:submit application');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account details step 1 submit application otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/apply/current-account/submit');

                        expect(dataLayer.pageName).toEqual('account application:current account step 1 details:submit application otp');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 1 details:submit application otp');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account offer step 2', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/offers', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 2 offer');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 2 offer');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account offer step 3', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/accept', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 3 confirmation:account');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 3 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 3 confirmation:account');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account offer step 3', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/debit-order-switching', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 3 confirmation:debit order switching');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 3 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 3 confirmation:debit order switching');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account offer step 3', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/accept/card', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 3 confirmation:accept card');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 3 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('account application:current account step 3 confirmation:accept card');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application for current account offer step 4', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account/finish', '');

                        expect(dataLayer.pageName).toEqual('account application:current account step 4 complete');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account step 4 complete');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set page properties on application overview page', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/apply/current-account', '');

                        expect(dataLayer.pageName).toEqual('account application:current account overview');
                        expect(dataLayer.pageCategory).toEqual('account application');
                        expect(dataLayer.pageSubSection1).toEqual('account application:current account overview');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                });

            });

            describe('on page name and category mapping', function () {

                describe('Profile & dashboard', function () {

                    it('Should set the page properties for accession the IB setting under profile', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/internet banking', '');

                        expect(dataLayer.pageName).toEqual('profile:internet banking');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:internet banking');
                    });

                    it('Should set the page properties for increasing monthly payment limit OTP step', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/verify', 'http://localhost:8080/#/monthly-payment-limit');

                        expect(dataLayer.pageName).toEqual('profile:monthly payment limit increase otp');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:monthly payment limit increase otp');
                    });

                    it('Should set the page properties for accessing monthly payment limit', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/monthly-payment-limit', '');

                        expect(dataLayer.pageName).toEqual('profile:monthly payment limit');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:monthly payment limit');
                    });

                    it('Should set the page properties for accessing main profile dashboard under profile settings', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/dashboard', '');

                        expect(dataLayer.pageName).toEqual('profile:dashboard');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:dashboard');
                    });

                    it('Should set the page properties for accessing main account preferences under profile settings', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/account-preferences/10000358140', '');

                        expect(dataLayer.pageName).toEqual('profile:product preferences');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:product preferences');
                    });

                    it('Should set the page properties for accessing edit account preferences under profile settings', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/edit-account-preferences/10000358140', '');

                        expect(dataLayer.pageName).toEqual('profile:edit product preferences step 1 details');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:edit product preferences step 1 details');
                    });

                    it('Should set the page properties for accessing edit account preferences under profile settings - OTP step', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/verify', 'http://localhost:8080/#/edit-account-preferences/10000358140');

                        expect(dataLayer.pageName).toEqual('profile:edit product preferences step 2 otp');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:edit product preferences step 2 otp');
                    });

                    it('Should set the page properties when activating your Internet banking coming from choose dashboard', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/verify', 'http://localhost:8080/#/choose-dashboard');

                        expect(dataLayer.pageName).toEqual('profile:activate your internet banking');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:activate your internet banking');
                    });

                    it('Should set the page properties when activating your OTP step 1 details', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/activate/123456', '');

                        expect(dataLayer.pageName).toEqual('profile:activate your otp setp 1 details');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:activate your otp setp 1 details');
                    });
                    it('Should set the page properties when activating your OTP step 1 details', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/activate/:profileId', '');

                        expect(dataLayer.pageName).toEqual('profile:activate your otp setp 1 details');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:activate your otp setp 1 details');
                    });

                    it('Should set the page properties when activating your OTP step 2 confirmation', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/activate/confirm/123456', 'http://localhost:8080/#/otp/activate/123456');

                        expect(dataLayer.pageName).toEqual('profile:activate your otp setp 2 confirmation');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:activate your otp setp 2 confirmation');
                    });
                    it('Should set the page properties when activating your OTP step 2 confirmation', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/activate/confirm/:profileId', 'http://localhost:8080/#/otp/activate/123456');

                        expect(dataLayer.pageName).toEqual('profile:activate your otp setp 2 confirmation');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:activate your otp setp 2 confirmation');
                    });

                    it('Should set the page properties when activating your OTP step 3 confirmation', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/#/otp/activate/confirm/123456');

                        expect(dataLayer.pageName).toEqual('profile:activate your otp setp 3 otp');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:activate your otp setp 3 otp');
                    });
                    it('Should set the page properties when activating your OTP step 3 confirmation', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/#/otp/activate/confirm/:profileId');

                        expect(dataLayer.pageName).toEqual('profile:activate your otp setp 3 otp');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:activate your otp setp 3 otp');
                    });

                    it('Should set the page properties when activating your OTP step 4 success', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/activate/success/123456', 'http://localhost:8080/index.html#/otp/verify');

                        expect(dataLayer.pageName).toEqual('profile:activate your otp setp 4 results');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:activate your otp setp 4 results');
                    });
                    it('Should set the page properties when activating your OTP step 4 success', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/activate/success/:profileId', 'http://localhost:8080/index.html#/otp/verify');

                        expect(dataLayer.pageName).toEqual('profile:activate your otp setp 4 results');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:activate your otp setp 4 results');
                    });

                    it('should set the page properties for change password', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/change-password', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('profile:change password');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:change password');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the page properties for resetting password', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/reset-password', '');

                        expect(dataLayer.pageName).toEqual('profile:reset password step 1');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:reset password step 1');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the page properties for resetting password', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/reset-password/details', '');

                        expect(dataLayer.pageName).toEqual('profile:reset password step 2 details');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:reset password step 2 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the page properties for resetting password', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/reset-password');

                        expect(dataLayer.pageName).toEqual('profile:reset password step 3 otp');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:reset password step 3 otp');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('Should set the page properties for choose dashboard', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/choose-dashboard', '');

                        expect(dataLayer.pageName).toEqual('dashboard:choose dashboard');
                        expect(dataLayer.pageCategory).toEqual('dashboard');
                        expect(dataLayer.pageSubSection1).toEqual('dashboard:choose dashboard');
                    });

                    it('Should set the page properties when switchdashboard dashboard', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/switchdashboard', '');

                        expect(dataLayer.pageName).toEqual('dashboard:switch dashboard');
                        expect(dataLayer.pageCategory).toEqual('dashboard');
                        expect(dataLayer.pageSubSection1).toEqual('dashboard:switch dashboard');
                    });

                    it('Should set the page properties adding a dashboard step 1', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/adddashboard', '');

                        expect(dataLayer.pageName).toEqual('dashboard:add dashboard step 1 details');
                        expect(dataLayer.pageCategory).toEqual('dashboard');
                        expect(dataLayer.pageSubSection1).toEqual('dashboard:add dashboard step 1 details');
                    });

                    it('Should set the page properties adding a dashboard step 2 otp', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/otp/verify', 'http://localhost:8080/#/adddashboard');

                        expect(dataLayer.pageName).toEqual('dashboard:add dashboard step 2 otp');
                        expect(dataLayer.pageCategory).toEqual('dashboard');
                        expect(dataLayer.pageSubSection1).toEqual('dashboard:add dashboard step 2 otp');
                    });

                    it('Should set the page properties adding a dashboard step 3 save name', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/#/adddashboard/saveName', '');

                        expect(dataLayer.pageName).toEqual('dashboard:add dashboard step 3 save name');
                        expect(dataLayer.pageCategory).toEqual('dashboard');
                        expect(dataLayer.pageSubSection1).toEqual('dashboard:add dashboard step 3 save name');
                    });


                });

                describe('registration', function () {
                    it('should set the registration category and registration first step page', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/register', 'http://localhost:8080/index.html#/login');

                        expect(dataLayer.pageName).toEqual('registration:step 1 create digital id');
                        expect(dataLayer.pageCategory).toEqual('registration');
                        expect(dataLayer.pageSubSection1).toEqual('registration:step 1 create digital id');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the registration step 2 on otp after registration info and registration category', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/register');

                        expect(dataLayer.pageName).toEqual('registration:step 2 verification code');
                        expect(dataLayer.pageCategory).toEqual('registration');
                        expect(dataLayer.pageSubSection1).toEqual('registration:step 2 verification code');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                it('should set the page properties for new registered from the otp page', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/new-registered', 'http://localhost:8080/index.html#/otp/verify');

                    expect(dataLayer.pageName).toEqual('registration:new user registration options');
                    expect(dataLayer.pageCategory).toEqual('registration');
                    expect(dataLayer.pageSubSection1).toEqual('registration:new user registration options');
                    expect(dataLayer.pageSubSection2).toEqual('');
                    expect(dataLayer.pageSubSection3).toEqual('');
                    expect(dataLayer.pageSubSection4).toEqual('');
                    expect(dataLayer.userRegistrationSuccess).toEqual(true);
                    expect(dataLayer.userLoginSuccess).toEqual(true);
                });

                it('should set the page properties for new registered from the switch dashboard page', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/new-registered', 'http://localhost:8080/index.html#/switchdashboard');

                    expect(dataLayer.pageName).toEqual('registration:new user registration options');
                    expect(dataLayer.pageCategory).toEqual('registration');
                    expect(dataLayer.pageSubSection1).toEqual('registration:new user registration options');
                    expect(dataLayer.pageSubSection2).toEqual('');
                    expect(dataLayer.pageSubSection3).toEqual('');
                    expect(dataLayer.pageSubSection4).toEqual('');
                    expect(dataLayer.userRegistrationSuccess).toEqual('');
                });

                describe('profile setup post registration', function () {
                    it('should set the profile setup step 1 on link card page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/linkcard', 'http://localhost:8080/index.html#/otp/verify');

                        expect(dataLayer.pageName).toEqual('profile:link card step 1 details');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:link card step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the profile setup step 2 otp on link card page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/linkcard');

                        expect(dataLayer.pageName).toEqual('profile:link card step 2 otp');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:link card step 2 otp');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the profile setup step 1 on migrate page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/migrate', 'http://localhost:8080/index.html#/otp/verify');

                        expect(dataLayer.pageName).toEqual('profile:migration step 1 details');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:migration step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the profile setup step 2 otp on migrate page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/migrate');

                        expect(dataLayer.pageName).toEqual('profile:migration step 2 otp');
                        expect(dataLayer.pageCategory).toEqual('profile');
                        expect(dataLayer.pageSubSection1).toEqual('profile:migration step 2 otp');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('send secure message', function () {
                    it('should set the send secure message step 1 page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/secure-message', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('secure message:send step 1 message');
                        expect(dataLayer.pageCategory).toEqual('secure message');
                        expect(dataLayer.pageSubSection1).toEqual('secure message:send step 1 message');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the send secure message step 2 page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/secure-message/confirm', 'http://localhost:8080/index.html#/secure-message');

                        expect(dataLayer.pageName).toEqual('secure message:send step 2 confirmation');
                        expect(dataLayer.pageCategory).toEqual('secure message');
                        expect(dataLayer.pageSubSection1).toEqual('secure message:send step 2 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the send secure message step 3 page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/secure-message/confirm');

                        expect(dataLayer.pageName).toEqual('secure message:send step 3 otp');
                        expect(dataLayer.pageCategory).toEqual('secure message');
                        expect(dataLayer.pageSubSection1).toEqual('secure message:send step 3 otp');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the send secure message step 4 page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/secure-message/results', 'http://localhost:8080/index.html#/otp/verify');

                        expect(dataLayer.pageName).toEqual('secure message:send step 4 results');
                        expect(dataLayer.pageCategory).toEqual('secure message');
                        expect(dataLayer.pageSubSection1).toEqual('secure message:send step 4 results');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('add beneficiary', function () {
                    it('should set the add beneficiary page and beneficiaries category when coming from beneficiary list', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/add', 'http://localhost:8080/index.html#/beneficiaries/list');

                        expect(dataLayer.pageName).toEqual('beneficiaries:add new step 1 details');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:add new step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the add beneficiary page and beneficiaries category when coming from transaction dashboard', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/add', 'http://localhost:8080/index.html#/transaction/dashboard');

                        expect(dataLayer.pageName).toEqual('beneficiaries:add new step 1 details');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:add new step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the add beneficiary confirmation page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/add', 'http://localhost:8080/index.html#/beneficiaries/add');

                        expect(dataLayer.pageName).toEqual('beneficiaries:add new step 2 confirmation');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:add new step 2 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the add beneficiary otp page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/beneficiaries/add');

                        expect(dataLayer.pageName).toEqual('beneficiaries:add new step 3 otp');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:add new step 3 otp');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('edit beneficiary', function () {
                    it('should set the edit beneficiary page edit beneficiaries category when coming from beneficiary list', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/edit', 'http://localhost:8080/index.html#/beneficiaries/list');

                        expect(dataLayer.pageName).toEqual('beneficiaries:edit step 1 details');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:edit step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the edit beneficiary confirmation page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/edit', 'http://localhost:8080/index.html#/beneficiaries/edit');

                        expect(dataLayer.pageName).toEqual('beneficiaries:edit step 2 confirmation');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:edit step 2 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the edit beneficiary otp page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/beneficiaries/edit');

                        expect(dataLayer.pageName).toEqual('beneficiaries:edit otp');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:edit otp');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('transfer between accounts', function () {
                    it('should set the page properties for the transfer details page', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/transfers', 'http://localhost:8080/index.html#/transaction/dashboard');

                        expect(dataLayer.pageName).toEqual('transfers:transfer between accounts step 1 details');
                        expect(dataLayer.pageCategory).toEqual('transfers');
                        expect(dataLayer.pageSubSection1).toEqual('transfers:transfer between accounts step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('pay beneficiary', function () {
                    it('should set the page properties for the pay beneficiary page step 1', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/payment/beneficiary', 'http://localhost:8080/index.html#/beneficiaries/list');

                        expect(dataLayer.pageName).toEqual('payment:pay single beneficiary step 1 details');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:pay single beneficiary step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('beneficiary groups', function () {
                    it('should set the add beneficiary to group page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/groups/add', 'http://localhost:8080/index.html#/transaction/dashboard');

                        expect(dataLayer.pageName).toEqual('beneficiaries:add beneficiary to group');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:add beneficiary to group');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the add beneficiary to group otp page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/beneficiaries/groups/add');

                        expect(dataLayer.pageName).toEqual('beneficiaries:add beneficiary to group otp');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:add beneficiary to group otp');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                it('should set beneficiaries list page and beneficiaries category', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/list', 'http://localhost:8080/index.html#/transaction/dashboard');

                    expect(dataLayer.pageName).toEqual('beneficiaries:list');
                    expect(dataLayer.pageCategory).toEqual('beneficiaries');
                });

                it('should set beneficiary view page and beneficiaries category', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/view/14', 'http://localhost:8080/index.html#/beneficiaries/list');

                    expect(dataLayer.pageName).toEqual('beneficiaries:view');
                    expect(dataLayer.pageCategory).toEqual('beneficiaries');
                });

                it('should remove trailing colon when setting page name', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/list/', 'http://localhost:8080/index.html#/transaction/dashboard');

                    expect(dataLayer.pageName).toEqual('beneficiaries:list');
                    expect(dataLayer.pageCategory).toEqual('beneficiaries');
                });

                describe('beneficiary groups', function () {
                    it('should set page properties for beneficiary group list ', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/groups/list', 'http://localhost:8080/index.html#/transaction/dashboard');

                        expect(dataLayer.pageName).toEqual('beneficiaries:list groups');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:list groups');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set beneficiary group view page and beneficiaries category', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/groups/view/Alegtest', 'http://localhost:8080/index.html#/beneficiaries/groups/list');

                        expect(dataLayer.pageName).toEqual('beneficiaries:view group');
                        expect(dataLayer.pageCategory).toEqual('beneficiaries');
                        expect(dataLayer.pageSubSection1).toEqual('beneficiaries:view group');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set beneficiary group payment page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/pay-group/Alegtest', 'http://localhost:8080/index.html#/beneficiaries/groups/list');

                        expect(dataLayer.pageName).toEqual('payment:pay beneficiary group step 1 setup');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:pay beneficiary group step 1 setup');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set beneficiary group payment page 2 confirmation page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/pay-group/confirm/Alegtest', 'http://localhost:8080/index.html#/beneficiaries/pay-group/Alegtest');

                        expect(dataLayer.pageName).toEqual('payment:pay beneficiary group step 2 confirmation');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:pay beneficiary group step 2 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set beneficiary group payment page 3 results page properties', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/pay-group/results/Alegtest', 'http://localhost:8080/index.html#/beneficiaries/pay-group/confirm/Alegtest');

                        expect(dataLayer.pageName).toEqual('payment:pay beneficiary group step 3 results');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:pay beneficiary group step 3 results');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('statements', function () {
                    it('should set statement page name and the statement page category for statement without account number', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view provisional statement');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view provisional statement');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for statement with account number', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/10-4-33-2', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view provisional statement');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view provisional statement');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for provisional statements', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/10-4-33-2?statementType=Provisional', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view provisional statement');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view provisional statement');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for 30 day statements', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/10-4-33-2?statementType=Thirty', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view history statement 30');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view history statement 30');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for 30 day statements without account number', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/?statementType=Thirty', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view history statement 30');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view history statement 30');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for 60 day statements', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/10-4-33-2?statementType=Sixty', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view history statement 60');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view history statement 60');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for 60 day statements without an account number', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/?statementType=Sixty', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view history statement 60');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view history statement 60');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for 90 day statements', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/10-4-33-2?statementType=Ninety', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view history statement 90');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view history statement 90');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for 90 day statements without an account number', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/?statementType=Ninety', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view history statement 90');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view history statement 90');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for 180 day statements', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/10-4-33-2?statementType=OneHundredEighty', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view history statement 180');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view history statement 180');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category for 180 day statements without an account number', function () {
                        this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/?statementType=OneHundredEighty', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view history statement 180');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view history statement 180');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set statement page name and the statement page category formal statement', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/formal-statements', 'http://localhost:8080/index.html#/account-summary');

                        expect(dataLayer.pageName).toEqual('statements:view formal statement');
                        expect(dataLayer.pageCategory).toEqual('statements');
                        expect(dataLayer.pageSubSection1).toEqual('statements:view formal statement');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('pay multiple beneficiaries', function () {
                    it('should set the page properties for pay multiple beneficiaries', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/beneficiaries/pay-multiple', 'https://localhost:8080/index.html#/transaction/dashboard');

                        expect(dataLayer.pageName).toEqual('payment:pay multiple beneficiaries step 1 select beneficiary');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:pay multiple beneficiaries step 1 select beneficiary');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the page properties for the confirm step of pay multiple beneficiaries', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/beneficiaries/pay-multiple/confirm', 'https://localhost:8080/index.html#/beneficiaries/pay-multiple');

                        expect(dataLayer.pageName).toEqual('payment:pay multiple beneficiaries step 2 confirmation');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:pay multiple beneficiaries step 2 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the page properties for the payment results step of pay multiple beneficiaries', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/beneficiaries/pay-multiple/results', 'https://localhost:8080/index.html#/beneficiaries/pay-multiple/confirm');

                        expect(dataLayer.pageName).toEqual('payment:pay multiple beneficiaries step 3 results');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:pay multiple beneficiaries step 3 results');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                });

                it('should set the correct page properties for payment notification history', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/payment-notification/history/10-00-035-814-0', 'http://localhost:8080/index.html#/transaction/dashboard');

                    expect(dataLayer.pageName).toEqual('payment:notifications history');
                    expect(dataLayer.pageCategory).toEqual('payment');
                    expect(dataLayer.pageSubSection1).toEqual('payment:notifications history');
                    expect(dataLayer.pageSubSection2).toEqual('');
                    expect(dataLayer.pageSubSection3).toEqual('');
                    expect(dataLayer.pageSubSection4).toEqual('');
                });

                it('should set the correct page properties for viewing scheduled payments', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/payment/scheduled/manage', 'http://localhost:8080/index.html#/transaction/dashboard');

                    expect(dataLayer.pageName).toEqual('payment:view scheduled payments');
                    expect(dataLayer.pageCategory).toEqual('payment');
                    expect(dataLayer.pageSubSection1).toEqual('payment:view scheduled payments');
                    expect(dataLayer.pageSubSection2).toEqual('');
                    expect(dataLayer.pageSubSection3).toEqual('');
                    expect(dataLayer.pageSubSection4).toEqual('');
                });

                it('should set the correct page properties for viewing scheduled payments', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/payment/scheduled/modify', 'http://localhost:8080/index.html#/payment/scheduled/manage');

                    expect(dataLayer.pageName).toEqual('payment:modify scheduled payment step 1 details');
                    expect(dataLayer.pageCategory).toEqual('payment');
                    expect(dataLayer.pageSubSection1).toEqual('payment:modify scheduled payment step 1 details');
                    expect(dataLayer.pageSubSection2).toEqual('');
                    expect(dataLayer.pageSubSection3).toEqual('');
                    expect(dataLayer.pageSubSection4).toEqual('');
                });

                it('should set the correct page properties for viewing scheduled payments', function () {
                    this.DtmAnalyticsService.sendPageView('http://localhost:8080/index.html#/payment/scheduled/modify/confirm', 'http://localhost:8080/index.html#/payment/scheduled/modify');

                    expect(dataLayer.pageName).toEqual('payment:modify scheduled payment step 2 confirmation');
                    expect(dataLayer.pageCategory).toEqual('payment');
                    expect(dataLayer.pageSubSection1).toEqual('payment:modify scheduled payment step 2 confirmation');
                    expect(dataLayer.pageSubSection2).toEqual('');
                    expect(dataLayer.pageSubSection3).toEqual('');
                    expect(dataLayer.pageSubSection4).toEqual('');
                });


                describe('prepaid', function () {
                    it('should set the correct page properties for prepaid history', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/prepaid/history', 'https://localhost:8080/index.html#/transaction/dashboard');

                        expect(dataLayer.pageName).toEqual('prepaid:view history');
                        expect(dataLayer.pageCategory).toEqual('prepaid');
                        expect(dataLayer.pageSubSection1).toEqual('prepaid:view history');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the correct page properties for prepaid selection', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/prepaid', 'https://localhost:8080/index.html#/transaction/dashboard');

                        expect(dataLayer.pageName).toEqual('prepaid:selection');
                        expect(dataLayer.pageCategory).toEqual('prepaid');
                        expect(dataLayer.pageSubSection1).toEqual('prepaid:selection');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the correct page properties for prepaid recharge step 1', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/prepaid/recharge/mtn', 'https://localhost:8080/index.html#/prepaid');

                        expect(dataLayer.pageName).toEqual('prepaid:recharge mtn step 1 details');
                        expect(dataLayer.pageCategory).toEqual('prepaid');
                        expect(dataLayer.pageSubSection1).toEqual('prepaid:recharge mtn step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the correct page properties for prepaid recharge step 2', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/prepaid/recharge/mtn/confirm', 'https://localhost:8080/index.html#/prepaid/recharge/mtn');

                        expect(dataLayer.pageName).toEqual('prepaid:recharge mtn step 2 confirmation');
                        expect(dataLayer.pageCategory).toEqual('prepaid');
                        expect(dataLayer.pageSubSection1).toEqual('prepaid:recharge mtn step 2 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the correct page properties for prepaid recharge otp', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/otp/verify', 'https://localhost:8080/index.html#/prepaid/recharge/mtn/confirm');

                        expect(dataLayer.pageName).toEqual('prepaid:recharge mtn step 3 otp');
                        expect(dataLayer.pageCategory).toEqual('prepaid');
                        expect(dataLayer.pageSubSection1).toEqual('prepaid:recharge mtn step 3 otp');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the correct page properties for prepaid recharge step 4', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/prepaid/recharge/mtn/results', 'https://localhost:8080/index.html#/otp/verify');

                        expect(dataLayer.pageName).toEqual('prepaid:recharge mtn step 4 results');
                        expect(dataLayer.pageCategory).toEqual('prepaid');
                        expect(dataLayer.pageSubSection1).toEqual('prepaid:recharge mtn step 4 results');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });

                describe('once off payments', function () {
                    it('should set the correct page properties for once off payment details', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/payment/onceoff', 'https://localhost:8080/index.html#/transaction/dashboard');

                        expect(dataLayer.pageName).toEqual('payment:onceoff payment step 1 details');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:onceoff payment step 1 details');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the correct page properties for once off payment confirmation', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/payment/onceoff/confirm', 'https://localhost:8080/index.html#/payment/onceoff');

                        expect(dataLayer.pageName).toEqual('payment:onceoff payment step 2 confirmation');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:onceoff payment step 2 confirmation');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the correct page properties for once off payment otp', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/otp/verify', 'https://localhost:8080/index.html#/payment/onceoff/confirm');

                        expect(dataLayer.pageName).toEqual('payment:onceoff payment step 3 otp');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:onceoff payment step 3 otp');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });

                    it('should set the correct page properties for once off payment results', function () {
                        this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/payment/onceoff/success', 'https://localhost:8080/index.html#/otp/verify');

                        expect(dataLayer.pageName).toEqual('payment:onceoff payment step 4 results');
                        expect(dataLayer.pageCategory).toEqual('payment');
                        expect(dataLayer.pageSubSection1).toEqual('payment:onceoff payment step 4 results');
                        expect(dataLayer.pageSubSection2).toEqual('');
                        expect(dataLayer.pageSubSection3).toEqual('');
                        expect(dataLayer.pageSubSection4).toEqual('');
                    });
                });
            });
        });

        describe('Targeted offers', function () {
            it('should set the expected dataLayer items for the Targeted offer call me back', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/targetedoffers/callmeback', '');

                expect(dataLayer.pageName).toEqual('targeted offers:callmeback');
                expect(dataLayer.pageCategory).toEqual('targeted offers');
                expect(dataLayer.pageSubSection1).toEqual('targeted offers:callmeback');
                expect(dataLayer.pageSubSection2).toEqual('');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the expected dataLayer items for the Targeted offer call me back when product has been included in the hash', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/targetedoffers/market-link-callmeback', '');

                expect(dataLayer.pageName).toEqual('targeted offers:market link callmeback');
                expect(dataLayer.pageCategory).toEqual('targeted offers');
                expect(dataLayer.pageSubSection1).toEqual('targeted offers:market link callmeback');
                expect(dataLayer.pageSubSection2).toEqual('');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the expected dataLayer items for the Targeted offer call me back when product has been included in the hash and also contain callmeback', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/targetedoffers/market-link/callmeback', '');

                expect(dataLayer.pageName).toEqual('targeted offers:market link:callmeback');
                expect(dataLayer.pageCategory).toEqual('targeted offers');
                expect(dataLayer.pageSubSection1).toEqual('targeted offers:market link');
                expect(dataLayer.pageSubSection2).toEqual('targeted offers:market link:callmeback');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
        });

        describe('International payemnts', function () {
            it('should set the correct page properties for international payments', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/international-payment', '');

                expect(dataLayer.pageName).toEqual('payment:international payment overview');
                expect(dataLayer.pageCategory).toEqual('payment');
                expect(dataLayer.pageSubSection1).toEqual('payment:international payment overview');
                expect(dataLayer.pageSubSection2).toEqual('');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the correct page properties for international payments step 1 details', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/international-payment/personal-details', 'https://localhost:8080/index.html#/international-payment');

                expect(dataLayer.pageName).toEqual('payment:international payment step 1 details');
                expect(dataLayer.pageCategory).toEqual('payment');
                expect(dataLayer.pageSubSection1).toEqual('payment:international payment step 1 details');
                expect(dataLayer.pageSubSection2).toEqual('');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the correct page properties for international payments step 2 beneficiary details', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/international-payment/beneficiary/details', 'https://localhost:8080/index.html#/international-payment/personal-details');

                expect(dataLayer.pageName).toEqual('payment:international payment step 2 beneficiary:details');
                expect(dataLayer.pageCategory).toEqual('payment');
                expect(dataLayer.pageSubSection1).toEqual('payment:international payment step 2 beneficiary');
                expect(dataLayer.pageSubSection2).toEqual('payment:international payment step 2 beneficiary:details');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the correct page properties for international payments step 2 beneficiary banking details', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/international-payment/beneficiary/bank-details', 'https://localhost:8080/index.html#/international-payment/beneficiary/details');

                expect(dataLayer.pageName).toEqual('payment:international payment step 2 beneficiary:banking details');
                expect(dataLayer.pageCategory).toEqual('payment');
                expect(dataLayer.pageSubSection1).toEqual('payment:international payment step 2 beneficiary');
                expect(dataLayer.pageSubSection2).toEqual('payment:international payment step 2 beneficiary:banking details');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the correct page properties for international payments step 2 beneficiary banking details', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/international-payment/beneficiary/preferences', 'https://localhost:8080/index.html#/international-payment/beneficiary/bank-details');

                expect(dataLayer.pageName).toEqual('payment:international payment step 2 beneficiary:preferences');
                expect(dataLayer.pageCategory).toEqual('payment');
                expect(dataLayer.pageSubSection1).toEqual('payment:international payment step 2 beneficiary');
                expect(dataLayer.pageSubSection2).toEqual('payment:international payment step 2 beneficiary:preferences');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the correct page properties for international payments step 3 - give reason for payment', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/international-payment/reason', 'https://localhost:8080/index.html#/international-payment/beneficiary/preferences');

                expect(dataLayer.pageName).toEqual('payment:international payment step 3 reason for payment');
                expect(dataLayer.pageCategory).toEqual('payment');
                expect(dataLayer.pageSubSection1).toEqual('payment:international payment step 3 reason for payment');
                expect(dataLayer.pageSubSection2).toEqual('');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the correct page properties for international payments step 4 - payment', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/international-payment/pay', 'https://localhost:8080/index.html#/international-payment/reason');

                expect(dataLayer.pageName).toEqual('payment:international payment step 4 payment');
                expect(dataLayer.pageCategory).toEqual('payment');
                expect(dataLayer.pageSubSection1).toEqual('payment:international payment step 4 payment');
                expect(dataLayer.pageSubSection2).toEqual('');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the correct page properties for international payments step 5 OTP', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/otp/verify', 'https://localhost:8080/index.html#/international-payment/pay');

                expect(dataLayer.pageName).toEqual('payment:international payment step 5 otp');
                expect(dataLayer.pageCategory).toEqual('payment');
                expect(dataLayer.pageSubSection1).toEqual('payment:international payment step 5 otp');
                expect(dataLayer.pageSubSection2).toEqual('');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });
            it('should set the correct page properties for international payments step 6 confirmation', function () {
                this.DtmAnalyticsService.sendPageView('https://localhost:8080/index.html#/international-payment/confirm', 'https://localhost:8080/index.html#/otp/verify');

                expect(dataLayer.pageName).toEqual('payment:international payment step 6 confirmation');
                expect(dataLayer.pageCategory).toEqual('payment');
                expect(dataLayer.pageSubSection1).toEqual('payment:international payment step 6 confirmation');
                expect(dataLayer.pageSubSection2).toEqual('');
                expect(dataLayer.pageSubSection3).toEqual('');
                expect(dataLayer.pageSubSection4).toEqual('');
            });


        });

        describe('form methods', function () {
            it('should set the login properties on the data layer when a login is recorded', function () {
                dtmAnalyticsFeature = true;

                this.DtmAnalyticsService.recordLogin();

                expect(dataLayer.userLoginSuccess).toEqual(true);
                expect(dataLayer.loginStatus).toEqual('logged in');
            });

            it('should not set the login properties on form submission if the dtm feature is disabled', function () {
                dataLayer.loginStatus = '';
                dtmAnalyticsFeature = false;

                this.DtmAnalyticsService.recordLogin();

                expect(dataLayer.loginStatus).toEqual('');
            });

            it('should set the formIsSubmitted property to true when a form submission is recorded', function () {
                dtmAnalyticsFeature = true;

                this.DtmAnalyticsService.recordFormSubmission();

                expect(dataLayer.formisSubmitted).toEqual(true);
            });

            it('should not set the formIsSubmitted property to true when a form submission is recorded and dtm analytics feature is disabled', function () {
                dtmAnalyticsFeature = false;
                dataLayer.formisSubmitted = '';

                this.DtmAnalyticsService.recordFormSubmission();

                expect(dataLayer.formisSubmitted).toEqual('');
            });

            it('should record form completion and clear submission when a form completion is recorded', function () {
                dtmAnalyticsFeature = true;
                dataLayer.formisSubmitted = true;

                this.DtmAnalyticsService.recordFormSubmissionCompletion();

                expect(dataLayer.formisSubmitted).toEqual(false);
                expect(dataLayer.formStatus).toEqual('complete');
            });

            it('should set customerSAPBPID when switching a dashboard mofo', function () {

                dtmAnalyticsFeature = true;

                this.DtmAnalyticsService.setCustomerSAPBPID('mofo');
                expect(dataLayer.customerSAPBPID).toEqual('mofo');
            });

            it('should not record form completion and clear submission when a form completion is recorded and dtm analytics is disabled', function () {
                dtmAnalyticsFeature = false;

                dataLayer.formisSubmitted = '';
                dataLayer.formStatus = '';

                this.DtmAnalyticsService.recordFormSubmissionCompletion();

                expect(dataLayer.formisSubmitted).toEqual('');
                expect(dataLayer.formStatus).toEqual('');
            });

            it('should clear the form submission properties when a form submission is cancelled', function () {
                dtmAnalyticsFeature = true;
                dataLayer.formStatus = 'status';
                dataLayer.formisSubmitted = true;

                this.DtmAnalyticsService.cancelFormSubmissionRecord();

                expect(dataLayer.formStatus).toEqual('');
                expect(dataLayer.formisSubmitted).toEqual(false);
            });

            it('should not clear the form submission properties when a form submission is cancelled and dtm is disabled', function () {
                dtmAnalyticsFeature = false;
                dataLayer.formStatus = 'status';
                dataLayer.formisSubmitted = true;

                this.DtmAnalyticsService.cancelFormSubmissionRecord();

                expect(dataLayer.formStatus).toEqual('status');
                expect(dataLayer.formisSubmitted).toEqual(true);
            });
        });
    });

    describe('analytics directive', function () {
        beforeEach(inject(function (TemplateTest, $location, AnalyticsContainer, mock) {
            this.scope = TemplateTest.scope;
            this.TemplateTest = TemplateTest;
            this.mock = mock;

            this.hostnameSpy = spyOn($location, 'host');
            this.urlSpy = spyOn($location, 'absUrl');
            this.ajaxSpy = spyOn($, 'ajax');
            this.analyticsContainer = AnalyticsContainer;
            spyOn(this.analyticsContainer, 'containerUrlForHost');

            TemplateTest.allowTemplate('features/analytics/partials/analytics.html');
        }));

        describe('on mapped hostname when dtm analytics is not enabled', function () {
            beforeEach(function () {
                this.urlSpy.and.returnValue('http://experience.standardbank.co.za#/login');
                this.ajaxSpy.and.callFake(function () {
                    return {
                        done: function (callback) {
                            return callback();
                        }
                    };
                });
                dtmAnalyticsFeature = false;

                this.analyticsContainer.containerUrlForHost.and.returnValue(this.mock.resolve('url'));
                this.TemplateTest.compileTemplate('<dtm-analytics></dtm-analytics>');
            });

            it('should make an ajax call for the script returned by the analytics container', function () {
                expect(this.ajaxSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                    url: 'url'
                }));
            });

            it('should not listen on location change and send the page view event if dtm analytics feature is enabled', function () {
                dtmAnalyticsFeature = false;

                this.scope.$broadcast('$locationChangeSuccess', 'http://localhost:8080/index.html#/beneficiaries/list', 'http://localhost:8080/index.html#/transaction/dashboard');
                this.scope.$digest();

                expect(_satellite.track).not.toHaveBeenCalled();
            });

            it('should not send the error if dtm analytics is not toggled on', function () {
                dtmAnalyticsFeature = false;

                this.scope.$broadcast('unsuccessfulMcaResponse', 'This is the error message', '4321');
                this.scope.$digest();

                expect(_satellite.track).not.toHaveBeenCalled();
            });

            it('should not send the error if there is no error code and message', function () {
                dtmAnalyticsFeature = true;

                this.scope.$broadcast('unsuccessfulMcaResponse', null, null);
                this.scope.$digest();

                expect(_satellite.track).not.toHaveBeenCalled();
            });

            it('should not send anything if no message is sent', function () {
                dtmAnalyticsFeature = true;

                this.scope.$broadcast('unsuccessfulMcaResponse', null, '1234', '/test');
                this.scope.$digest();

                expect(dataLayer.siteErrorCode).toEqual('1234|');
                expect(_satellite.track).not.toHaveBeenCalled();
            });

            it('should send the error code as noerrorcode if not set to null string', function () {
                dtmAnalyticsFeature = true;

                this.scope.$broadcast('unsuccessfulMcaResponse', 'credentials', "null", '/test');
                this.scope.$digest();

                expect(dataLayer.siteErrorCode).toEqual('noerrorcode|credentials|/test');
            });

            it('should send the error code as noerrorcode if not present', function () {
                dtmAnalyticsFeature = true;

                this.scope.$broadcast('unsuccessfulMcaResponse', 'credentials', null, '/test');
                this.scope.$digest();

                expect(dataLayer.siteErrorCode).toEqual('noerrorcode|credentials|/test');
            });

            it('should send the error code with message if message is sent', function () {
                dtmAnalyticsFeature = true;

                this.scope.$broadcast('unsuccessfulMcaResponse', 'credentials', "1234", '/test');
                this.scope.$digest();

                expect(dataLayer.siteErrorCode).toEqual('1234|credentials|/test');
            });

            it('should send not send the error code with url if not included', function () {
                dtmAnalyticsFeature = true;

                this.scope.$broadcast('unsuccessfulMcaResponse', 'credentials', "1234");
                this.scope.$digest();

                expect(dataLayer.siteErrorCode).toEqual('1234|credentials');
            });
        });

        describe('on mapped hostname', function () {
            beforeEach(function () {
                this.urlSpy.and.returnValue('http://experience.standardbank.co.za#/login');
                this.ajaxSpy.and.callFake(function () {
                    return {
                        done: function (callback) {
                            return callback();
                        }
                    };
                });
                this.analyticsContainer.containerUrlForHost.and.returnValue(this.mock.resolve('url'));
                this.TemplateTest.compileTemplate('<dtm-analytics></dtm-analytics>');
                dtmAnalyticsFeature = true;
            });

            it('should make an ajax call for the script returned by the analytics container', function () {
                expect(this.ajaxSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                    url: 'url'
                }));
            });

            it('should send the page view event on loading the first page', function () {
                expect(dataLayer.pageName).toEqual('login');
                expect(dataLayer.pageCategory).toEqual('login');
                expect(_satellite.track).toHaveBeenCalled();
            });

            it('should listen on location change and send the page view event if dtm analytics feature is enabled', function () {

                this.scope.$broadcast('$locationChangeSuccess', 'http://localhost:8080/index.html#/beneficiaries/list', 'http://localhost:8080/index.html#/transaction/dashboard');
                this.scope.$digest();

                expect(dataLayer.pageName).toEqual('beneficiaries:list');
                expect(dataLayer.pageCategory).toEqual('beneficiaries');
                expect(_satellite.track).toHaveBeenCalled();
            });

            it('should listen for an error and send the error', function () {
                this.scope.$broadcast('unsuccessfulMcaResponse', 'This is the error message', '4321');
                this.scope.$digest();

                expect(_satellite.track).toHaveBeenCalled();
            });
        });

        describe('on non-mapped hostname', function () {
            beforeEach(function () {
                this.analyticsContainer.containerUrlForHost.and.returnValue(this.mock.reject('nope'));
                this.TemplateTest.compileTemplate('<analytics></analytics>');
            });

            it('should not send page views if script did not load', function () {
                this.scope.$broadcast('$locationChangeSuccess', 'http://localhost:8080/index.html#/beneficiaries/list', 'http://localhost:8080/index.html#/transaction/dashboard');
                this.scope.$digest();

                expect(_satellite.track).not.toHaveBeenCalled();
            });
        });
    });
});
