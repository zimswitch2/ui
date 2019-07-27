describe('Unit Test - LithiumAuthenticationFlow', function () {
    beforeEach(module('lithium.lithiumAuthenticationFlow', 'test.mockFunctionObjConstructor'));

    describe('Given it has been instantiated', function () {
        var LithiumAuthenticationFlow,
            $q,
            $rootScope,
            username = 'Jack',
            password = 'TheGiantSlayer',
            redirectUrl = 'http://community.stage.standardbank.co.za/kfxpy69559/sso?sso_value=~2oglfpX5vDqwQvUya~pro_usNSTZ4pVZ0kyy43Gyc0lSp5OKTzYKhEx8WBFGLr1vYWB0_355ZeSiE_LqFEghtzuNi1TkLH3G19qiPII9MQjTNmIuCmJ-L5Vo21A1RocVhWStV4aed1uj_73rDuvJGzVYaFZ39ufkOiTSRTOyMS65zJHAcZtGNJhVMep12TUXoHMX28qYhYw5akre44dwl29Lm5iM3F11_G22Kp4nWtTfRZBXW6m35jRrocGKgiJocEdntpkSU5FiIYn2W9Yn0evCSDFCS0inckIuN-al_lKFypNH2-BZRoumQh7moZ-kUnWlHynFyP5kWwgAPJanBlAjl3RLJMl3USzJTQZFxDJY_5ocBqCZ1RusK2gfRbZYOBk3JHCw2HTaSv3cqZfYx0FPpED0jPt9SEIR2wjw..';

        beforeEach(function () {
            var authenticationService = jasmine.createSpyObj('AuthenticationService', ['login']),
                lithiumService = jasmine.createSpyObj('LithiumService', ['authenticate']),
                lithiumHelper = jasmine.createSpyObj('LithiumHelper', ['redirectToLithium']);

            module(function ($provide) {
                $provide.value('AuthenticationService', authenticationService);
                $provide.value('LithiumService', lithiumService);
                $provide.value('LithiumHelper', lithiumHelper);
            });
        });

        beforeEach(inject(function (_LithiumAuthenticationFlow_, _$q_, LithiumService, _$rootScope_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            LithiumAuthenticationFlow = _LithiumAuthenticationFlow_;
        }));

        it(', it should be named \'LithiumAuthenticationFlow\'', function () {
            expect(LithiumAuthenticationFlow.getName()).toBe('LithiumAuthenticationFlow');
        });


        describe('Given Standard bank authentication is successful', function () {
            var LithiumHelper;

            describe(' and the redirect url has been set', function () {
                beforeEach(inject(function (AuthenticationService, _LithiumHelper_) {
                    AuthenticationService.login.and.returnValue($q.when());
                    LithiumAuthenticationFlow.start(username, password);
                    LithiumHelper = _LithiumHelper_;
                }));

                describe(', when lithium authentication is successful', function () {
                    beforeEach(inject(function (LithiumService) {
                        LithiumService.authenticate.and.returnValue($q.when(redirectUrl));
                    }));

                    it(', it should call LithiumHelper.redirectToLithium() with the redirect url' , function () {
                        $rootScope.$digest();
                        expect(LithiumHelper.redirectToLithium).toHaveBeenCalledWith(redirectUrl);
                    });

                });
            });
        });


        describe('Given a failure function is defined', function () {
            var mockFailureFuncObj;
            beforeEach(inject(function (MockFunctionObjConstructor) {
                mockFailureFuncObj = MockFunctionObjConstructor();
                LithiumAuthenticationFlow.failure(mockFailureFuncObj.getMockedFunc());
            }));

            describe('Given Standard Bank authentication is unsuccessful', function () {
                beforeEach(inject(function (AuthenticationService) {
                    AuthenticationService.login.and.returnValue($q.reject());
                    LithiumAuthenticationFlow.start(username, password);
                }));

                it(', it should execute the failure function once', function () {
                    $rootScope.$digest();
                    expect(mockFailureFuncObj.getCallCount()).toBe(1);
                });
            });
        });


        describe('When LithiumAuthenticationFlow.start(' + username + ', ' + password + ')', function () {
            var AuthenticationService;
            beforeEach(inject(function (_AuthenticationService_) {
                AuthenticationService = _AuthenticationService_;
                AuthenticationService.login.and.returnValue($q.when());
                LithiumAuthenticationFlow.start(username, password);
            }));

            it(', it should call the AuthenticationService.login(' + username + ', ' + password + ') ', function () {
                expect(AuthenticationService.login).toHaveBeenCalledWith(username, password);
            });
        });

    });
});
