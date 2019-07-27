describe('OTP', function () {
    'use strict';

    beforeEach(module('refresh.otp', 'refresh.test', 'refresh.configuration', 'refresh.mcaHttp',
        'refresh.dtmanalytics'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when otp is to be entered', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/otp/verify'].controller).toEqual('OtpController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/otp/verify'].templateUrl).toEqual('features/otp/partials/verify.html');
            });
        });
    });

    describe('controller', function () {
        var scope,
            http,
            httpBackend,
            filter,
            applicationParameterService,
            flow,
            location,
            dateFormatSpy,
            authenticationService,
            DtmAnalyticsService;

        beforeEach(inject(function ($rootScope, $controller, $http, $httpBackend, ApplicationParameters, _DtmAnalyticsService_) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            http = $http;
            applicationParameterService = ApplicationParameters;
            flow = jasmine.createSpyObj('Flow', ['preventNavigation', 'next', 'getHeaderName', 'cancel', 'cancelable']);
            location = jasmine.createSpyObj('$location', ['path']);
            location.path.and.returnValue(jasmine.createSpyObj('path', ['replace']));
            dateFormatSpy = jasmine.createSpy();
            authenticationService = jasmine.createSpyObj('AuthenticationService', ['logout']);

            applicationParameterService.pushVariable('originalResponse', {
                data: {stepUp: {code: null}, keyValueMetadata: [{key: 'responseKey', value: 'responseValue'}]},
                config: {url: '/someOtpUrl', method: 'POST', data: {myData: 'something'}, headers: {}}
            });
            applicationParameterService.pushVariable('profile', {cardNumber: '12345'});

            $controller('OtpController', {
                $scope: scope,
                $http: http,
                Flow: flow,
                AuthenticationService: authenticationService,
                $location: location,
                dateTimeFormatFilter: dateFormatSpy
            });

            DtmAnalyticsService = _DtmAnalyticsService_;
            spyOn(DtmAnalyticsService, 'recordFormSubmissionCompletion').and.returnValue(function() {});
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        describe('initialisation', function () {
            it('should call $location.path when originalResponse is undefined on listening to $locationChangeStart',
                function () {
                    applicationParameterService.pushVariable('originalResponse', undefined);

                    scope.initialize();
                    scope.$broadcast('$routeChangeSuccess', {}, {originalPath: 'some old url'});

                    expect(location.path).toHaveBeenCalledWith('some old url');
                });

            it('should not call $location.path when originalResponse is defined on listening to $locationChangeStart',
                function () {
                    applicationParameterService.pushVariable('originalResponse',
                        {data: {stepUp: {contactMethod: "SMS", maskedAddress: '******0522'}}});
                    scope.initialize();
                    scope.$broadcast('$routeChangeSuccess');

                    expect(location.path).not.toHaveBeenCalled();
                });

            it('should display masked address to which the OTP was sent to when contact method is SMS', function () {
                applicationParameterService.pushVariable('originalResponse',
                    {data: {stepUp: {stepUpType: 'OTP',contactMethod: "SMS", maskedAddress: '******0522'}}});
                scope.initialize();
                expect(scope.entryMessage).toEqual("Enter the one-time password (OTP) that has been sent to your cell ******0522");
            });

            it('should display masked address to which the OTP was sent to when contact method is Email', function () {
                applicationParameterService.pushVariable('originalResponse',
                    {data: {stepUp: {stepUpType: 'OTP',contactMethod: "Email", maskedAddress: 'r***@s***.c***'}}});
                scope.initialize();
                expect(scope.entryMessage).toEqual("Enter the one-time password (OTP) that has been sent to your email address r***@s***.c***");
            });

            it('should set the masked address to email if the contact method is Email', function () {
                var originalResponse = {
                    data: {
                        stepUp: {
                            contactMethod: "Email",
                            maskedAddress: 'r***@s***.c***'
                        }
                    }
                };
                applicationParameterService.pushVariable('originalResponse', originalResponse);
                scope.initialize();
                expect(scope.entryMessage).toEqual('A verification code has been sent to email address r***@s***.c***');
            });

            it('should display (A verification code has been sent to ***********@address. Check your email inbox and enter the code below.) message when doing email verification',
                function () {
                    applicationParameterService.pushVariable('originalResponse', {
                        data: {
                            stepUp: {
                                contactMethod: "SMS",
                                maskedAddress: 'r***@s***.c***',
                                stepUpType: "VerificationCode"
                            }
                        }
                    });
                    scope.initialize();
                    expect(scope.entryMessage).toEqual("A verification code has been sent to email address r***@s***.c***");
                });

            it('should display OTP has been sent to if the response is not defined', function () {
                applicationParameterService.pushVariable('originalResponse', null);
                scope.initialize();
                expect(scope.entryMessage).toEqual("Enter the one-time password (OTP) that has been sent to your ");
            });
        });

        describe('send method', function () {
            it('should resolve the promise when a normal response is received', function () {
                var deferred = jasmine.createSpyObj('deferred', ['resolve']);
                applicationParameterService.pushVariable('deferred', deferred);
                scope.send('12345');
                httpBackend.expectPOST('/someOtpUrl', {
                    myData: 'something',
                    stepUp: {code: '12345'},
                    keyValueMetadata: [{key: 'responseKey', value: 'responseValue'}]
                })
                    .respond(200, {}, {});
                httpBackend.flush();
                expect(scope.deferred.resolve).toHaveBeenCalled();
            });

            it('should set originalResponse and applicationParameterService to undefined when resolve the promise',
                function () {
                    var deferred = jasmine.createSpyObj('deferred', ['resolve']);
                    applicationParameterService.pushVariable('deferred', deferred);
                    scope.send('12345');
                    httpBackend.expectPOST('/someOtpUrl', {
                        myData: 'something',
                        stepUp: {code: '12345'},
                        keyValueMetadata: [{key: 'responseKey', value: 'responseValue'}]
                    })
                        .respond(200, {}, {});
                    httpBackend.flush();
                    expect(scope.originalResponse).toEqual(undefined);
                    expect(applicationParameterService.getVariable('originalResponse')).toEqual(undefined);
                });

            it('should resolve the promise when a normal response is received and should go to the next flow when accepting an invitation', function () {
                var deferred = jasmine.createSpyObj('deferred', ['resolve']);
                applicationParameterService.pushVariable('deferred', deferred);
                applicationParameterService.pushVariable('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');
                applicationParameterService.getVariable('acceptInvitationRedirect');
                scope.send('12345');
                httpBackend.expectPOST('/someOtpUrl', {
                    myData: 'something',
                    stepUp: {code: '12345'},
                    keyValueMetadata: [{key: 'responseKey', value: 'responseValue'}]
                })
                    .respond(200, {}, {});
                httpBackend.flush();
                expect(scope.deferred.resolve).toHaveBeenCalled();
                expect(flow.next).toHaveBeenCalled();
            });

            it('should display the invalid OTP message when an incorrect OTP is entered', function () {
                scope.send('1234');
                httpBackend.expectPOST('/someOtpUrl')
                    .respond(204, {}, {
                        'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': 'STEPUP',
                        'x-sbg-response-message': 'Invalid one-time password. Please re-enter your one-time password.'
                    });
                httpBackend.flush();
                expect(scope.notificationType).toEqual('error');
                expect(scope.otpMessage).toEqual('Invalid one-time password. Please re-enter your one-time password.');
            });

            it('should display the new OTP message when an the incorrect OTP is entered too many times', function () {
                var newKeyValueMetadata = [{"key": "CardNo", "value": "newCardNumber"}];
                var newStepUp = {correlationKey: 'newCorrelationKey'};

                scope.send('1234');

                httpBackend.expectPOST('/someOtpUrl')
                    .respond(204, {keyValueMetadata: newKeyValueMetadata, stepUp: newStepUp}, {
                        'x-sbg-response-type': 'STEPUP', 'x-sbg-response-code': 'STEPUP',
                        'x-sbg-response-message': 'You have exceeded the number of attempts you are allowed to enter your one-time password. We have sent you a new one-time password, which you will receive shortly.'
                    });
                httpBackend.flush();

                expect(scope.notificationType).toEqual('error');
                expect(scope.otpMessage).toEqual('You have exceeded the number of attempts you are allowed to enter your one-time password. We have sent you a new one-time password, which you will receive shortly.');
            });

            it('should display the correct error message when the otp has been locked', function () {
                var newKeyValueMetadata = [{"key": "CardNo", "value": "newCardNumber"}];
                var newStepUp = {correlationKey: 'newCorrelationKey'};

                scope.send('1234');

                httpBackend.expectPOST('/someOtpUrl')
                    .respond(204, {keyValueMetadata: newKeyValueMetadata, stepUp: newStepUp}, {
                        'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': 'STEPUP',
                        'x-sbg-response-message': 'You have Exceeded the number of attempted you can enter your OTP. Please contact your branch.'
                    });
                httpBackend.flush();

                expect(scope.notificationType).toEqual('error');
                expect(scope.otpMessage).toEqual('Your OTP service has been locked. Please call Customer Care on 0860 123 000');
            });

            it('should update the step up details and metadata once a new OTP is sent after three wrong attempts',
                function () {
                    var newKeyValueMetadata = [{"key": "CardNo", "value": "newCardNumber"}];
                    var newStepUp = {correlationKey: 'newCorrelationKey'};

                    scope.send('1234');

                    httpBackend.expectPOST('/someOtpUrl')
                        .respond(204, {keyValueMetadata: newKeyValueMetadata, stepUp: newStepUp}, {
                            'x-sbg-response-type': 'STEPUP', 'x-sbg-response-code': 'STEPUP',
                            'x-sbg-response-message': 'You have exceeded the number of attempts you are allowed to enter your one-time password. We have sent you a new one-time password, which you will receive shortly.'
                        });
                    httpBackend.flush();

                    var changedResponse = applicationParameterService.getVariable('originalResponse');
                    expect(changedResponse.data.keyValueMetadata).toEqual([{
                        "key": "CardNo",
                        "value": "newCardNumber"
                    }]);
                    expect(changedResponse.data.stepUp).toEqual({correlationKey: 'newCorrelationKey', code: '1234'});
                });

            it("should append to metadata", function () {
                var deferred = jasmine.createSpyObj('deferred', ['resolve']);
                applicationParameterService.pushVariable('deferred', deferred);
                applicationParameterService.pushVariable('originalResponse', {
                    data: {stepUp: {code: 12345}, keyValueMetadata: [{key: 'responseKey', value: 'responseValue'}]},
                    config: {
                        url: '/someOtpUrl',
                        method: 'POST',
                        data: {myData: 'something', keyValueMetadata: [{key: 'PreferredName', value: 'Jannie'}]},
                        headers: {}
                    }
                });

                var newKeyValueMetadata = [
                    {"key": "responseKey", "value": "responseValue"},
                    {key: 'PreferredName', value: 'Jannie'}
                ];

                scope.send('1234');

                httpBackend.expectPOST('/someOtpUrl', function (payloadText) {
                    var payload = JSON.parse(payloadText);
                    return _.isEqual(payload.keyValueMetadata, newKeyValueMetadata);
                }).respond({});
                httpBackend.flush();

                expect(applicationParameterService.getVariable('originalResponse')).toBeUndefined();
            });

            it('should reject the promise', function () {
                var deferred = jasmine.createSpyObj('deferred', ['reject']);
                applicationParameterService.pushVariable('deferred', deferred);
                scope.send('123');
                httpBackend.expectPOST('/someOtpUrl')
                    .respond(500, {}, {
                        'x-sbg-response-type': 'ERROR',
                        'x-sbg-response-code': '9999',
                        'x-sbg-response-message': 'Technical Exception'
                    });
                httpBackend.flush();
                expect(scope.deferred.reject).toHaveBeenCalled();
                expect(scope.otpMessage).toEqual('Technical Exception');
                expect(scope.notificationType).toEqual('error');
                expect(applicationParameterService.getVariable('errorMessage')).toEqual('Technical Exception');
            });
        });

        describe('resend method', function () {
            beforeEach(function () {
                httpBackend.expectPOST('/sbg-ib/someAction').
                    respond(200, {
                        stepUp: {correlationKey: 'abcde', stepUpType: 'OTP'},
                        keyValueMetadata: [
                            {key: 'CardNo', value: '12345'},
                            {key: 'DeliveryAddress', value: '11111111'}
                        ]
                    },
                    {
                        'x-sbg-response-type': "STEPUP", 'x-sbg-response-code': "0000",
                        'x-sbg-response-message': "Foo",
                        date: "Wed, 12 Mar 2014 07:38:31 GMT"
                    });
                httpBackend.expectGET("features/otp/partials/verify.html").respond(200);
                httpBackend.expectGET("features/security/partials/login.html").respond(200);
                http.post('/sbg-ib/someAction', {foo: 'bar'});
                httpBackend.flush();
            });

            it('should request that the OTP be resent', inject(function (URL) {
                applicationParameterService.pushVariable('originalResponse', {
                    data: {
                        stepUp: {correlationKey: 'abcde', stepUpType: 'OTP', contactMethod: 'SMS'},
                        keyValueMetadata: [
                            {key: 'CardNo', value: '12345'},
                            {key: 'DeliveryAddress', value: '11111111'}
                        ]
                    }
                });
                scope.otp = "11111";
                scope.resend();
                httpBackend.expectPOST(URL.resendStepUp, {
                    keyValueMetadata: [
                        {key: 'CardNo', value: '12345'}, {key: 'DeliveryAddress', value: '11111111'}
                    ], stepUp: {correlationKey: 'abcde', stepUpType: 'OTP', contactMethod: 'SMS'}
                }).
                    respond(200, {});
                expect(scope.initialStatement).toEqual('A new OTP has been sent at ');
                expect(scope.otp).toEqual("");
                httpBackend.flush();
            }));

            it('should request that the OTP be resent for verification code', inject(function (URL) {
                applicationParameterService.pushVariable('originalResponse', {
                    data: {
                        stepUp: {correlationKey: 'abcde', stepUpType: 'VerificationCode'},
                        keyValueMetadata: [
                            {key: 'VerificationId', value: '2009'}
                        ]
                    }
                });
                scope.resend();
                httpBackend.expectPOST(URL.resendStepUp, {
                    keyValueMetadata: [
                        {key: 'VerificationId', value: '2009'}
                    ],
                    stepUp: {correlationKey: 'abcde', stepUpType: 'VerificationCode'}
                }).
                    respond(200, {});
                expect(scope.initialStatement).toEqual('A new verification code has been sent at ');
                httpBackend.flush();
            }));

            it('should display that the OTP has been resent when successful', inject(function (URL) {
                var timeStamp = "Wed, 12 Mar 2014 07:38:31 GMT";
                dateFormatSpy.and.returnValue('date');

                scope.resend();
                httpBackend.expectPOST(URL.resendStepUp, {
                    keyValueMetadata: [
                        {key: 'CardNo', value: '12345'}, {key: 'DeliveryAddress', value: '11111111'}
                    ], stepUp: {correlationKey: 'abcde', stepUpType: 'OTP'}
                }).
                    respond(200, {stepUp: {correlationKey: 'efghi'}},
                    {
                        'x-sbg-response-type': "STEPUP", 'x-sbg-response-code': "0000",
                        'x-sbg-response-message': "One-time PIN successfully re-sent.",
                        date: timeStamp
                    });
                httpBackend.flush();
                expect(scope.notificationType).toEqual('info');
                expect(dateFormatSpy).toHaveBeenCalledWith(timeStamp);
                expect(scope.otpMessage).toEqual('A new OTP has been sent at date');
            }));

            it('should display that the verification code has been resent when successful', inject(function (URL) {
                var timeStamp = "Wed, 12 Mar 2014 07:38:31 GMT";
                dateFormatSpy.and.returnValue('date');
                applicationParameterService.pushVariable('originalResponse', {
                    data: {
                        stepUp: {correlationKey: 'abcde', stepUpType: 'VerificationCode'},
                        keyValueMetadata: [
                            {key: 'VerificationId', value: '2009'}
                        ]
                    }
                });
                scope.resend();
                httpBackend.expectPOST(URL.resendStepUp, {
                    keyValueMetadata: [
                        {key: 'VerificationId', value: '2009'}
                    ], stepUp: {correlationKey: 'abcde', stepUpType: 'VerificationCode'}
                }).
                    respond(200, {stepUp: {correlationKey: 'efghi'}},
                    {
                        'x-sbg-response-type': "STEPUP", 'x-sbg-response-code': "0000",
                        'x-sbg-response-message': "Verification code successfully resent.",
                        date: timeStamp
                    });
                httpBackend.flush();
                expect(scope.notificationType).toEqual('info');
                expect(dateFormatSpy).toHaveBeenCalledWith(timeStamp);
                expect(scope.otpMessage).toEqual('A new verification code has been sent at date');
            }));

            it('should know we have a new correlation key on the original request after a successful OTP resend',
                inject(function (URL) {
                    scope.resend();
                    httpBackend.expectPOST(URL.resendStepUp, {
                        keyValueMetadata: [
                            {key: 'CardNo', value: '12345'}, {key: 'DeliveryAddress', value: '11111111'}
                        ], stepUp: {correlationKey: 'abcde', stepUpType: 'OTP'}
                    }).
                        respond(200, {stepUp: {correlationKey: 'efghi'}},
                        {
                            'x-sbg-response-type': "STEPUP", 'x-sbg-response-code': "0000",
                            'x-sbg-response-message': "One-time PIN successfully re-sent.",
                            date: "Wed, 12 Mar 2014 07:38:31 GMT"
                        });
                    httpBackend.flush();
                    expect(scope.originalResponse.config.url).toEqual('/sbg-ib/someAction');
                    expect(scope.originalResponse.data.stepUp.correlationKey).toEqual('efghi');
                }));

            it('should display that the OTP has NOT been resent when unsuccessful due to a server error',
                inject(function (URL) {
                    applicationParameterService.pushVariable('originalResponse', {
                        data: {
                            stepUp: {correlationKey: 'abcde', stepUpType: 'OTP'},
                            keyValueMetadata: [
                                {key: 'CardNo', value: '12345'},
                                {key: 'DeliveryAddress', value: '11111111'}
                            ]
                        }
                    });
                    var deferred = {promise: {}};
                    applicationParameterService.pushVariable('deferred', deferred);
                    scope.resend();
                    httpBackend.expectPOST(URL.resendStepUp, {
                        keyValueMetadata: [
                            {key: 'CardNo', value: '12345'}, {key: 'DeliveryAddress', value: '11111111'}
                        ], stepUp: {correlationKey: 'abcde', stepUpType: 'OTP'}
                    }).
                        respond(500, {});
                    httpBackend.flush();
                    expect(scope.notificationType).toEqual('error');
                    expect(scope.otpMessage).toEqual('Failed to request a new OTP.');
                }));

            it('should display that the OTP has NOT been resent when unsuccessful due to an application error',
                inject(function (URL) {
                    applicationParameterService.pushVariable('originalResponse', {
                        data: {
                            stepUp: {correlationKey: 'abcde', stepUpType: 'OTP'},
                            keyValueMetadata: [
                                {key: 'CardNo', value: '12345'},
                                {key: 'DeliveryAddress', value: '11111111'}
                            ]
                        }
                    });
                    var deferred = {promise: {}};
                    applicationParameterService.pushVariable('deferred', deferred);
                    scope.resend();
                    httpBackend.expectPOST(URL.resendStepUp, {
                        keyValueMetadata: [
                            {key: 'CardNo', value: '12345'},
                            {key: 'DeliveryAddress', value: '11111111'}
                        ], stepUp: {correlationKey: 'abcde', stepUpType: 'OTP'}
                    }).
                        respond(200, {}, {'x-sbg-response-type': 'ERROR'});
                    httpBackend.flush();
                    expect(scope.notificationType).toEqual('error');
                    expect(scope.otpMessage).toEqual('Failed to request a new OTP.');
                }));

            it('should display customer care phone number when OTP service has been deactivated', inject(function (URL) {
                applicationParameterService.pushVariable('originalResponse', {
                    data: {
                        stepUp: {correlationKey: 'abcde', stepUpType: 'OTP'},
                        keyValueMetadata: [
                            {key: 'CardNo', value: '12345'},
                            {key: 'DeliveryAddress', value: '11111111'}
                        ]
                    }
                });
                var deferred = {promise: {}};
                applicationParameterService.pushVariable('deferred', deferred);
                scope.resend();
                httpBackend.expectPOST(URL.resendStepUp, {
                    keyValueMetadata: [
                        {key: 'CardNo', value: '12345'},
                        {key: 'DeliveryAddress', value: '11111111'}
                    ], stepUp: {correlationKey: 'abcde', stepUpType: 'OTP'}
                }).
                    respond(200, {}, {'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': '1020'});
                httpBackend.flush();
                expect(scope.notificationType).toEqual('error');
                expect(scope.otpMessage).toEqual('Your OTP service has been locked. Please call Customer Care on 0860 123 000');
            }));
        });

        describe('cancel method', function () {
            it('should cancel the flow', function () {
                scope.cancel();
                expect(flow.cancel).toHaveBeenCalled();
            });
            it('should cancel the form submit so abandonment can be recorded', function() {
               spyOn(DtmAnalyticsService, 'cancelFormSubmissionRecord').and.returnValue(function() {});
            });
        });

        describe('signout', function () {
            it('should sign out', function () {
                scope.signout();
                expect(authenticationService.logout).toHaveBeenCalled();
            });

            it('should show sign out button when currently flow is not cancelable', function () {
                flow.cancelable.and.returnValue(false);
                expect(scope.showSignOut()).toBeTruthy();
            });
        });
    });
});
