describe('Unit Test - InternetBankingRegistrationFlow', function () {
    var $rootScope, $location, InternetBankingRegistrationFlow, applicationParameters;

    var context = {
        username: 'Jack Black',
        password: 'R@CK_@N',
        preferredName: 'Magic Monk'
    };

    beforeEach(module('refresh.internetBankingRegistrationFlow'));

    beforeEach(module(function ($provide) {
        $provide.value('RegistrationService', jasmine.createSpyObj('RegistrationService', ['createDigitalID']));
    }));

    beforeEach(inject(function (_$rootScope_, _$location_, _InternetBankingRegistrationFlow_, ApplicationParameters) {
        $rootScope = _$rootScope_;
        $location = _$location_;
        InternetBankingRegistrationFlow = _InternetBankingRegistrationFlow_;
        applicationParameters = ApplicationParameters;
    }));

    describe('When registration is successful', function () {
        beforeEach(inject(function (RegistrationService, $q) {
            applicationParameters.pushVariable('isRegistering', true);
            RegistrationService.createDigitalID.and.returnValue($q.when());
            InternetBankingRegistrationFlow.start(context.username, context.password, context.preferredName);
        }));

        it('should set newRegistered to true in application parameters', function () {
            $rootScope.$digest();
            expect(applicationParameters.popVariable('newRegistered')).toBeTruthy();
        });

        it('should redirect to new registered customer page', function () {
            $rootScope.$digest();
            expect($location.path()).toEqual('/new-registered');
        });

        it('should indicate that registration is complete', function () {
            $rootScope.$digest();
            expect(applicationParameters.popVariable('isRegistering')).toBeUndefined();
        });
    });

    describe('When registration is successful and you came from invite customer', function () {
        beforeEach(inject(function (RegistrationService, $q) {
            applicationParameters.pushVariable('isRegistering', true);
            applicationParameters.pushVariable('acceptInvitationRedirect','/account-sharing/accept-decline-invitation');
            RegistrationService.createDigitalID.and.returnValue($q.when());
            InternetBankingRegistrationFlow.start(context.username, context.password, context.preferredName);
        }));

        it('newRegistered should be undefined in application parameters', function () {
            $rootScope.$digest();
            expect(applicationParameters.popVariable('newRegistered')).toBeUndefined();
        });

        it('should redirect to new registered customer page', function () {
            $rootScope.$digest();
            expect($location.path()).toEqual('/account-sharing/accept-decline-invitation');
        });

    });

    describe('When registration is unsuccessful', function () {
        beforeEach(inject(function (RegistrationService, $q) {
            applicationParameters.pushVariable('isRegistering', true);
            RegistrationService.createDigitalID.and.returnValue($q.reject());
            InternetBankingRegistrationFlow.start(context.username, context.password, context.preferredName);
        }));

        it('should leave newRegistered in application parameters as undefined', function () {
            $rootScope.$digest();
            expect(applicationParameters.popVariable('newRegistered')).toBeUndefined();
        });

        it('should leave isRegistering in application parameters as undefined', function () {
            $rootScope.$digest();
            expect(applicationParameters.popVariable('isRegistering')).toBeUndefined();
        });

        it('should redirect to the first page in the wizard', function () {
            $rootScope.$digest();
            expect($location.path()).toEqual('/register');
        });
    });
});
