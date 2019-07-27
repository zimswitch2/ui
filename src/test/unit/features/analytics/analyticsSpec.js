var s = { t: function () {}, tl: function () {} }, s_gi, s_account; //the global analytics objects

(function () {
    describe('analytics', function () {
        var calledSt, calledStl;
        beforeEach(module('refresh.analytics', 'refresh.baseUrlHelper', 'refresh.test'));

        beforeEach(function () {
            spyOn(s, 't');
            s.t.and.callFake(function () {
                calledSt = angular.copy(s);
            });
            spyOn(s, 'tl');
            s.tl.and.callFake(function () {
                calledStl = angular.copy(s);
            });

            s_gi = function () {
                return s;
            };
        });

        describe('AnalyticsService', function () {
            beforeEach(inject(function (AnalyticsService) {
                this.AnalyticsService = AnalyticsService;
            }));

            describe('sendPageView', function () {
                it('should send the page view', function () {
                    this.AnalyticsService.sendPageView('', '');

                    expect(s.t).toHaveBeenCalled();
                });

                it('should set the server name', function () {
                    this.AnalyticsService.sendPageView('', '');

                    expect(s.server).toEqual('IB Refresh');
                });

                describe('on page name and category mapping', function () {
                    it('should set the registration category and registration first step page', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/register', 'http://localhost:8080/index.html#/login');

                        expect(s.pageName).toEqual('registration:step1');
                        expect(s.channel).toEqual('registration');
                    });

                    it('should set the registration step 2 on otp after registration info and registration category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/register');

                        expect(s.pageName).toEqual('registration:step2 verify');
                        expect(s.channel).toEqual('registration');
                    });

                    it('should set the registration step 3 on link card page and registration category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/linkcard', 'http://localhost:8080/index.html#/otp/verify');

                        expect(s.pageName).toEqual('registration:step3 linkcard');
                        expect(s.channel).toEqual('registration');
                    });

                    it('should set the registration step 4 on otp after link card page and registration category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/linkcard');

                        expect(s.pageName).toEqual('registration:step4 otp');
                        expect(s.channel).toEqual('registration');
                    });

                    it('should set the reset password step 1 and reset password category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/reset-password', 'http://localhost:8080/index.html#/login');

                        expect(s.pageName).toEqual('reset password:step1');
                        expect(s.channel).toEqual('reset password');
                    });

                    it('should set the reset password step 2 on otp page and reset password category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/reset-password');

                        expect(s.pageName).toEqual('reset password:step2 otp');
                        expect(s.channel).toEqual('reset password');
                    });

                    it('should set the add beneficiary page and beneficiaries category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/add', 'http://localhost:8080/index.html#/beneficiaries/list');

                        expect(s.pageName).toEqual('beneficiaries:add step1');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set the add beneficiary step 2 page on otp and beneficiaries category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/beneficiaries/add');

                        expect(s.pageName).toEqual('beneficiaries:add step2 otp');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set the edit beneficiary step 1 page name and beneficiaries category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/edit', 'http://localhost:8080/index.html#/beneficiaries/list');

                        expect(s.pageName).toEqual('beneficiaries:edit step1');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set the edit beneficiary step 2 page on otp and beneficiaries category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/beneficiaries/edit');

                        expect(s.pageName).toEqual('beneficiaries:edit step2 otp');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set the once off payment step 1 page and payment category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/payment/onceoff', 'http://localhost:8080/index.html#/transaction/dashboard');

                        expect(s.pageName).toEqual('payment:onceoff step1');
                        expect(s.channel).toEqual('payment');
                    });

                    it('should set the once off payment step 2 page on confirm and payment category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/payment/onceoff/confirm', 'http://localhost:8080/index.html#/payment/onceoff');

                        expect(s.pageName).toEqual('payment:onceoff step2 confirm');
                        expect(s.channel).toEqual('payment');
                    });

                    it('should set the once off payment step 4 page on success and payment category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/payment/onceoff/success', 'http://localhost:8080/index.html#/otp/verify');

                        expect(s.pageName).toEqual('payment:onceoff step4 success');
                        expect(s.channel).toEqual('payment');
                    });


                    it('should set the once off payment step 3 page on otp and payment category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/payment/onceoff');

                        expect(s.pageName).toEqual('payment:onceoff step3 otp');
                        expect(s.channel).toEqual('payment');
                    });

                    it('should set beneficiaries list page and beneficiaries category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/list', 'http://localhost:8080/index.html#/transaction/dashboard');

                        expect(s.pageName).toEqual('beneficiaries:list');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set pay multiple page and beneficiaries category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/pay-multiple', 'http://localhost:8080/index.html#/transaction/dashboard');

                        expect(s.pageName).toEqual('beneficiaries:pay multiple');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set pay multiple confirm page and beneficiaries category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/pay-multiple/results', 'http://localhost:8080/index.html#/beneficiaries/pay-multiple/confirm');

                        expect(s.pageName).toEqual('beneficiaries:pay multiple:results');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set account summary page and category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/transaction/dashboard');

                        expect(s.pageName).toEqual('account summary');
                        expect(s.channel).toEqual('account summary');
                    });

                    it('should set provisional statements page and statements category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/statements/provisional/10000358140', 'http://localhost:8080/index.html#/account-summary');

                        expect(s.pageName).toEqual('statements:provisional');
                        expect(s.channel).toEqual('statements');
                    });

                    it('should set payment confirmation history page and payment confirmation category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/payment-notification/history/10000358140', 'http://localhost:8080/index.html#/statements/provisional/10000358140');

                        expect(s.pageName).toEqual('payment notification:history');
                        expect(s.channel).toEqual('payment notification');
                    });

                    it('should set pay multiple page and beneficiaries category on pay beneficiaries group', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/pay-multiple/Groups%20Test', 'http://localhost:8080/index.html#/beneficiaries/groups/list');

                        expect(s.pageName).toEqual('beneficiaries:pay multiple');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set pay multiple confirm page and beneficiaries category on confirm pay beneficiary group', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/pay-multiple/confirm/Groups%20Test', 'http://localhost:8080/index.html#/beneficiaries/pay-multiple/Groups%20Test');

                        expect(s.pageName).toEqual('beneficiaries:pay multiple:confirm');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set beneficiary group view page and beneficiaries category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/groups/view/Alegtest', 'http://localhost:8080/index.html#/beneficiaries/groups/list');

                        expect(s.pageName).toEqual('beneficiaries:groups:view');
                        expect(s.channel).toEqual('beneficiaries');
                    });

                    it('should set beneficiary view page and beneficiaries category', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/view/14', 'http://localhost:8080/index.html#/beneficiaries/list');

                        expect(s.pageName).toEqual('beneficiaries:view');
                        expect(s.channel).toEqual('beneficiaries');
                    });
                    //Account Sharing/OBB
                    //Edit User Details
                    it('should set obb view page and obb category for edit user step', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-sharing/users/2/details', 'https://localhost:8080/index.html#/account-sharing/users/2');

                        expect(s.pageName).toEqual('obb:edit user step1');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for edit user step2 confirm', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-sharing/users/2/details/confirm' ,'http://localhost:8080/index.html#/account-sharing/users/2/details');

                        expect(s.pageName).toEqual('obb:edit user step2 confirm');
                        expect(s.channel).toEqual('obb');
                    });
                    //Edit User Permissions
                    it('should set obb view page and obb category for edit permissions step1', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-sharing/users/2/permissions', 'https://localhost:8080/index.html#/account-sharing/users/2');
                        console.log('step1:: ' + s.pageName);
                        expect(s.pageName).toEqual('obb:edit permissions step1');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for edit permissions step2 confirm', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-sharing/users/2/permissions/confirm' ,'http://localhost:8080/index.html#/account-sharing/users/2/permissions');
                        console.log('step2:: ' + s.pageName);
                        expect(s.pageName).toEqual('obb:edit permissions step2 confirm');
                        expect(s.channel).toEqual('obb');
                    });
                    //Add/Invite new user or edit invitation
                    it('should set obb view page and obb category for add user (edit invitation) step1', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-sharing/user/details' ,'https://localhost:8080/index.html#/account-sharing/operators');

                        expect(s.pageName).toEqual('obb:add user (edit invitation) step1');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for add user (edit invitation) step2 permissions', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account sharing/user/permissions' ,'http://localhost:8080/index.html#/account-sharing/user/details');

                        expect(s.pageName).toEqual('obb:add user (edit invitation) step2 permissions');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for add user (edit invitation) step3 confirm', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account sharing/user/confirm' ,'http://localhost:8080/index.html#/account sharing/user/permissions');

                        expect(s.pageName).toEqual('obb:add user (edit invitation) step3 confirm');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for add user (edit invitation) step4 otp', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify' ,'http://localhost:8080/index.html#/account sharing/user/confirm');

                        expect(s.pageName).toEqual('obb:add user (edit invitation) step4 otp');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for add user (edit invitation) step5 finish', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account sharing/user/finish' ,'http://localhost:8080/index.html#/otp/verify');

                        expect(s.pageName).toEqual('obb:add user (edit invitation) step5 finish');
                        expect(s.channel).toEqual('obb');
                    });
                    //Accept Invitation
                    it('should set obb view page and obb category for accept invite step1', function () {
                        this.AnalyticsService.sendPageView('https://localhost:8080/index.html#/account sharing/invitation details' ,'https://localhost:8080/index.html#/login');

                        expect(s.pageName).toEqual('obb:accept invite step1');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for accept invite step2 register new user', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/register' ,'https://localhost:8080/index.html#/account sharing/invitation details');

                        expect(s.pageName).toEqual('obb:accept invite step2 register new user');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for accept invite step2 login existing user', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/login' ,'https://localhost:8080/index.html#/account sharing/invitation details');

                        expect(s.pageName).toEqual('obb:accept invite step2 login existing user');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for accept invite step3 invite summary & accept terms', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account sharing/accept-decline invitation' ,'http://localhost:8080/index.html#/login');

                        expect(s.pageName).toEqual('obb:accept invite step3 invite summary & accept terms');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for accept invite step4 otp', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify' ,'http://localhost:8080/index.html#/account sharing/accept-decline invitation');

                        expect(s.pageName).toEqual('obb:accept invite step4 otp');
                        expect(s.channel).toEqual('obb');
                    });
                    //Pending user invitations
                    it('should set obb view page and obb category for pending invite details', function () {
                        this.AnalyticsService.sendPageView('https://localhost:8080/index.html#/account sharing/invitation/*' ,'https://localhost:8080/index.html#/account sharing/operators');

                        expect(s.pageName).toEqual('obb:pending invite details');
                        expect(s.channel).toEqual('obb');
                    });

                    it('should set obb view page and obb category for edit invite step1 user details', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account sharing/user/details' ,'https://localhost:8080/index.html#/account sharing/invitation/7501058681081');

                        expect(s.pageName).toEqual('obb:edit invite step1 user details');
                        expect(s.channel).toEqual('obb');
                    });
                });

                describe('on logged in status ', function () {
                    it('should set the user as guest if not logged in', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/login', 'http://localhost:8080/index.html#/login');

                        expect(s.eVar15).toEqual('guest');
                    });

                    it('should set the user as loggedin if user just registered', inject(function (Card) {
                        Card.setCurrent('123456', 9);
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/otp/verify');

                        expect(calledSt.eVar15).toEqual('loggedin');
                    }));

                    it('should set the user as loggedin if user logs in', inject(function (Card) {
                        Card.setCurrent('123456', 9);
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/login');

                        expect(s.eVar15).toEqual('loggedin');
                    }));

                    it('should set the login and registration events if user just registered', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/otp/verify');

                        expect(calledSt.events).toEqual('event2,event5');
                    });

                    it('should set the login event if user logs in', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/login');

                        expect(s.events).toEqual('event2');
                    });

                    it('not send a logged in event on normal navigation after log in', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/login');
                        expect(s.events).toEqual('event2');

                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/transaction/dashboard', 'http://localhost:8080/index.html#/account-summary');

                        expect(s.events).toEqual('');
                    });

                    it('should keep loggedin status on logged in pages', inject(function (Card) {
                        Card.setCurrent('123456', 9);
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/transaction/dashboard', 'http://localhost:8080/index.html#/account-summary');

                        expect(s.eVar15).toEqual('loggedin');
                    }));
                });

                describe('on section mapping', function () {
                    it('should set the props for subsections', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/groups/view/Alegtest', 'http://localhost:8080/index.html#/beneficiaries/groups/list');

                        expect(s.prop1).toEqual('beneficiaries');
                        expect(s.prop2).toEqual('beneficiaries:groups');
                        expect(s.prop3).toEqual('beneficiaries:groups:view');
                    });

                    it('should clean last props', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/groups/view/Alegtest', 'http://localhost:8080/index.html#/beneficiaries/groups/list');
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/transaction/dashboard', 'http://localhost:8080/index.html#/beneficiaries/groups/view/Alegtest');

                        expect(s.prop1).toEqual('transaction');
                        expect(s.prop2).toEqual('transaction:dashboard');
                        expect(s.prop3).toBeUndefined();
                    });

                    it('should clean last props from account preferences', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-preferences/alsgasdf' , 'http://localhost:8080/index.html#/dashboards');

                        expect(s.prop1).toEqual('account preferences');
                        expect(s.prop2).toBeUndefined();
                    });
                });

                describe('on registration flow', function () {
                    it('should set registration event and props on registration step 1', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/register', 'http://localhost:8080/index.html#/login');

                        expect(s.prop38).toEqual('registration step1');
                        expect(s.eVar49).toEqual('registration step1');
                        expect(s.events).toEqual('event6');
                    });

                    it('should set registration event and props on registration step 2', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/register');

                        expect(calledSt.prop38).toEqual('registration step2 verify');
                        expect(calledSt.eVar49).toEqual('registration step2 verify');
                        expect(calledSt.events).toEqual('event6');
                    });

                    it('should set registration event and props on registration step 3', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/linkcard', 'http://localhost:8080/index.html#/otp/verify');

                        expect(calledSt.prop38).toEqual('registration step3 linkcard');
                        expect(calledSt.eVar49).toEqual('registration step3 linkcard');
                        expect(calledSt.events).toEqual('event6');
                    });

                    it('should set registration event and props on registration step 4', function () {
                        this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/linkcard');

                        expect(calledSt.prop38).toEqual('registration step4 otp');
                        expect(calledSt.eVar49).toEqual('registration step4 otp');
                        expect(calledSt.events).toEqual('event6');
                    });

                    describe('sending the completed registration steps to link tracking function', function () {
                        it('should set tracking vars and events on s clone', function () {
                            this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/register');

                            expect(s.linkTrackVars).toEqual('eVar49,prop38,events,channel,server');
                            expect(s.linkTrackEvents).toEqual('event7');
                            expect(s.events).toEqual('event7');
                        });

                        it('should set the props and call link tracking function with completed step 1', function () {
                            this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/register');

                            expect(s.prop38).toEqual('registration step1');
                            expect(s.eVar49).toEqual('registration step1');
                            expect(s.tl).toHaveBeenCalledWith(true, 'o', 'registration step1');
                        });

                        it('should set the props and call link tracking function with completed step 2', function () {
                            this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/linkcard', 'http://localhost:8080/index.html#/otp/verify');

                            expect(s.prop38).toEqual('registration step2 otp');
                            expect(s.eVar49).toEqual('registration step2 otp');
                            expect(s.tl).toHaveBeenCalledWith(true, 'o', 'registration step2 otp');
                        });

                        it('should set the props and call link tracking function with completed step 3', function () {
                            this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/otp/verify', 'http://localhost:8080/index.html#/linkcard');

                            expect(s.prop38).toEqual('registration step3 linkcard');
                            expect(s.eVar49).toEqual('registration step3 linkcard');
                            expect(s.tl).toHaveBeenCalledWith(true, 'o', 'registration step3 linkcard');
                        });

                        it('should set the props and call link tracking function with completed step 4', function () {
                            this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/otp/verify');

                            expect(s.prop38).toEqual('registration step4 otp');
                            expect(s.eVar49).toEqual('registration step4 otp');
                            expect(s.tl).toHaveBeenCalledWith(true, 'o', 'registration step4 otp');
                        });

                        it('should set the event when registration is finished', function () {
                            this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/otp/verify');

                            expect(calledSt.events).toEqual('event2,event5');
                            expect(s.t).toHaveBeenCalled();
                        });

                        it('should clean the step properties after navigation', function () {
                            this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/otp/verify');
                            this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/transaction/dashboard', 'http://localhost:8080/index.html#/account-summary');

                            expect(s.prop38).toBeUndefined();
                            expect(s.eVar49).toBeUndefined();
                        });

                    });
                });
            });

            describe('sendError', function () {
                it('should set link track vars', function () {
                    this.AnalyticsService.sendError();

                    expect(s.linkTrackVars).toEqual('prop39,eVar3,events,channel,server');
                });

                it('should set event vars', function () {
                    this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/list', 'http://localhost:8080/index.html#/transaction/dashboard');
                    this.AnalyticsService.sendError();

                    expect(s.linkTrackEvents).toEqual('event29');
                    expect(s.events).toEqual('event29');
                    expect(s.tl).toHaveBeenCalledWith(true, 'o', 'beneficiaries:list - Error');
                });

                it('should set the error properties', function () {
                    this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/list', 'http://localhost:8080/index.html#/transaction/dashboard');
                    this.AnalyticsService.sendError('an error has occurred');

                    expect(s.prop39).toEqual('beneficiaries:list - an error has occurred');
                    expect(s.eVar3).toEqual('beneficiaries:list - an error has occurred');
                    expect(s.tl).toHaveBeenCalledWith(true, 'o', 'beneficiaries:list - Error');
                });

                it('should set the error properties with empty error message', function () {
                    this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/beneficiaries/list', 'http://localhost:8080/index.html#/transaction/dashboard');
                    this.AnalyticsService.sendError();

                    expect(s.prop39).toEqual('beneficiaries:list');
                    expect(s.eVar3).toEqual('beneficiaries:list');
                    expect(s.tl).toHaveBeenCalledWith(true, 'o', 'beneficiaries:list - Error');
                });

                it('should clean the step properties when sending an error', function () {
                    this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/otp/verify');
                    this.AnalyticsService.sendError();

                    expect(s.eVar15).toBeUndefined();
                });

                it('should clean the error properties when sending a page view', function () {
                    this.AnalyticsService.sendError();
                    this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/account-summary', 'http://localhost:8080/index.html#/otp/verify');

                    expect(s.prop39).toBeUndefined();
                    expect(s.eVar3).toBeUndefined();
                });
            });

            describe('send button click', function () {
                it('should set link track vars', function () {
                    this.AnalyticsService.sendButtonClick();

                    expect(s.linkTrackVars).toEqual('eVar35,events,channel,server');
                });

                it('should set event vars', function () {
                    this.AnalyticsService.sendPageView('http://localhost:8080/#/apply/current-account/offer', 'http://localhost:8080/#/apply/current-account/profile');
                    this.AnalyticsService.sendButtonClick();

                    expect(s.linkTrackEvents).toEqual('event27');
                    expect(s.events).toEqual('event27');
                });

                it('should send the event to site catalyst', function () {
                    this.AnalyticsService.sendPageView('http://localhost:8080/#/apply/current-account/offer', 'http://localhost:8080/#/apply/current-account/profile');
                    this.AnalyticsService.sendButtonClick();

                    expect(s.tl).toHaveBeenCalledWith(true, 'o', 'apply:current account:offer - Button clicked');
                });

                it('should set the button properties', function () {
                    this.AnalyticsService.sendPageView('http://localhost:8080/#/apply/current-account/offer', 'http://localhost:8080/#/apply/current-account/profile');
                    this.AnalyticsService.sendButtonClick('Elite account');

                    expect(s.eVar35).toEqual('Elite account');
                });

                it('should clean the button properties when sending a page view', function () {
                    this.AnalyticsService.sendButtonClick('Elite account');
                    this.AnalyticsService.sendPageView('http://localhost:8080/index.html#/apply', 'http://localhost:8080/index.html#/otp/verify');

                    expect(s.eVar35).toBeUndefined();
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
                    this.TemplateTest.compileTemplate('<analytics></analytics>');
                });

                it('should make an ajax call for the script returned by the analytics container', function () {
                    expect(this.ajaxSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                        url: 'url'
                    }));
                });

                it('should send the page view event on loading the first page', function () {
                    expect(s.pageName).toEqual('login');
                    expect(s.channel).toEqual('login');
                    expect(s.t).toHaveBeenCalled();
                });

                it('should listen on location change and send the page view event', function () {
                    this.scope.$broadcast('$locationChangeSuccess', 'http://localhost:8080/index.html#/beneficiaries/list', 'http://localhost:8080/index.html#/transaction/dashboard');
                    this.scope.$digest();

                    expect(s.pageName).toEqual('beneficiaries:list');
                    expect(s.channel).toEqual('beneficiaries');
                    expect(s.t).toHaveBeenCalled();
                });

                it('should listen on "unsuccessfulMcaResponse" event and send the error tracking', function () {
                    this.scope.$broadcast('unsuccessfulMcaResponse', 'an error has occurred');
                    this.scope.$digest();

                    expect(s.prop39).toEqual('login - an error has occurred');
                    expect(s.eVar3).toEqual('login - an error has occurred');
                    expect(s.tl).toHaveBeenCalledWith(true, 'o', 'login - Error');
                });

                it('should listen on "trackButtonClick" event and send the error tracking', function () {
                    this.scope.$broadcast('trackButtonClick', 'my button');
                    this.scope.$digest();

                    expect(s.eVar35).toEqual('my button');
                    expect(s.tl).toHaveBeenCalledWith(true, 'o', 'login - Button clicked');
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

                    expect(s.t).not.toHaveBeenCalled();
                });

                it('should not send error tracking if script did not load', function () {
                    this.scope.$broadcast('unsuccessfulMcaResponse', 'an error has occurred');
                    this.scope.$digest();

                    expect(s.tl).not.toHaveBeenCalled();
                });
            });
        });
    });
})();
