describe('Unit Test - Lithium Registration Flow Spec', function () {
    var $rootScope, LithiumRegistrationFlow, $q,
        redirectUrl = 'http://community.stage.standardbank.co.za/kfxpy69559/sso?sso_value=~2oglfpX5vDqwQvUya~pro_usNSTZ4pVZ0kyy43Gyc0lSp5OKTzYKhEx8WBFGLr1vYWB0_355ZeSiE_LqFEghtzuNi1TkLH3G19qiPII9MQjTNmIuCmJ-L5Vo21A1RocVhWStV4aed1uj_73rDuvJGzVYaFZ39ufkOiTSRTOyMS65zJHAcZtGNJhVMep12TUXoHMX28qYhYw5akre44dwl29Lm5iM3F11_G22Kp4nWtTfRZBXW6m35jRrocGKgiJocEdntpkSU5FiIYn2W9Yn0evCSDFCS0inckIuN-al_lKFypNH2-BZRoumQh7moZ-kUnWlHynFyP5kWwgAPJanBlAjl3RLJMl3USzJTQZFxDJY_5ocBqCZ1RusK2gfRbZYOBk3JHCw2HTaSv3cqZfYx0FPpED0jPt9SEIR2wjw..';

    var context = {
        username: 'Jack Black',
        password: 'R@CK_@N',
        preferredName: 'Magic Monk'
    };

    beforeEach(module('lithium.lithiumRegistrationFlow'));

    beforeEach(function () {
        var lithiumHelper = jasmine.createSpyObj('LithiumHelper', ['redirectToLithium']),
            lithiumService = jasmine.createSpyObj('LithiumService', ['authenticate']),
            registrationService = jasmine.createSpyObj('RegistrationService', ['createDigitalID']);

        module(function ($provide) {
            $provide.value('RegistrationService', registrationService);
            $provide.value('LithiumService', lithiumService);
            $provide.value('LithiumHelper', lithiumHelper);
        });
    });

    beforeEach(inject(function (_$rootScope_, _$location_, _LithiumRegistrationFlow_, _$q_) {
        $rootScope = _$rootScope_;
        LithiumRegistrationFlow = _LithiumRegistrationFlow_;
        $q = _$q_;
    }));

    describe('When LithiumRegistrationFlow.start() is called with a context', function () {
        var RegistrationService, LithiumService;

        beforeEach(inject(function (_RegistrationService_, _LithiumService_) {
            RegistrationService = _RegistrationService_;
            LithiumService = _LithiumService_;
            LithiumService.authenticate.and.returnValue($q.when());
            RegistrationService.createDigitalID.and.returnValue($q.when());
            LithiumRegistrationFlow.start(context.username, context.password, context.preferredName);
        }));

        it(', it should call the RegistrationService.createDigitalID() with a username, password and preferred name.', function () {
            expect(RegistrationService.createDigitalID).toHaveBeenCalledWith(context.username, context.password, context.preferredName);
        });

        describe(', the digital id registration is successful', function () {
            var LithiumHelper;

            it(', it should call LithiumService.authenticate' , function () {
                $rootScope.$digest();
                expect(LithiumService.authenticate).toHaveBeenCalled();
            });

            describe(', the redirect url has been set', function () {

                beforeEach(inject(function (RegistrationService, _LithiumHelper_) {
                    LithiumHelper = _LithiumHelper_;
                }));

                describe(' and lithium authentication is successful', function () {
                    beforeEach(function () {
                        LithiumService.authenticate.and.returnValue($q.when(redirectUrl));
                    });

                    it(', it should call LithiumHelper.redirectToLithium() with the redirect url' , function () {
                        $rootScope.$digest();
                        expect(LithiumHelper.redirectToLithium).toHaveBeenCalledWith(redirectUrl);
                    });
                });

                describe(' and lithium authentication is unsuccessful', function(){
                    it(' it should throw an E', function () {
                        
                    });
                });
            });

        });

        describe(', the digital id registration is unsuccessful', function () {
            beforeEach(function () {
                RegistrationService.createDigitalID.and.returnValue($q.reject());
                LithiumRegistrationFlow.start(context.username, context.password, context.preferredName);
            });

            it(', it should redirect to the first page in the wizard', inject(function ($location) {
                $rootScope.$digest();
                expect($location.path()).toEqual('/register');
            }));
        });
    });
});