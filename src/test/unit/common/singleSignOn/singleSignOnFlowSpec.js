describe('Unit Test - SingleSignOn', function () {
    var SingleSignOnFlow, LithiumAuthenticationFlow, InternetBankingAuthenticationFlow, LithiumRegistrationFlow, InternetBankingRegistrationFlow, LithiumHelper,
        $injectorGetSpy,
        context = {
            username: 'Jean-Luc Picard',
            password: 'USS Enterprise-E',
            preferredName: 'Sir Picard'
        };

    beforeEach(module('singleSignOn.singleSignOnFlow'));

    beforeEach(function () {
        var lithiumAuthenticationFlow = jasmine.createSpyObj('LithiumAuthenticationFlow', ['start']);
            LithiumHelper = jasmine.createSpyObj('LithiumHelper', ['isFromLithium']);

        module(function ($provide) {
            $provide.value('LithiumAuthenticationFlow', lithiumAuthenticationFlow);
            $provide.value('LithiumHelper', LithiumHelper);
        });
    });

    beforeEach(inject(function (_SingleSignOnFlow_, $injector) {
        SingleSignOnFlow = _SingleSignOnFlow_;

        $injectorGetSpy = spyOn($injector, 'get');
        $injectorGetSpy.and.callThrough();
    }));

    describe('Given that the user is coming from Lithium', function () {
        beforeEach(function () {
            LithiumHelper.isFromLithium.and.returnValue(true);
        });

        describe('When SingleSignOn.login() is called ', function () {
            it('. it should get the LithiumAuthenticationFlow', function () {
                SingleSignOnFlow.login(context.username, context.password);
                expect($injectorGetSpy).toHaveBeenCalledWith('LithiumAuthenticationFlow');
            });
        });

        describe('When SingleSignOn.register() is called', function () {
            it(', it should get the LithiumRegistrationFlow', function () {
                SingleSignOnFlow.createDigitalId(context.username, context.password, context.preferredName);
                expect($injectorGetSpy).toHaveBeenCalledWith('LithiumRegistrationFlow');
            });
        });
    });

    describe('Given the user isn\'t coming from Lithium', function () {
        beforeEach(function () {
            LithiumHelper.isFromLithium.and.returnValue(false);
        });

        describe('When SingleSignOn.login() is called', function () {
            it(', it should get the InternetBankingAuthenticationFlow', function () {
                SingleSignOnFlow.login(context.username, context.password);
                expect($injectorGetSpy).toHaveBeenCalledWith('InternetBankingAuthenticationFlow');
            });
        });

        describe('When SingleSignOn.register() is called', function () {
            it(', it should get the InternetBankingRegistrationFlow', function () {
                SingleSignOnFlow.createDigitalId(context.username, context.password, context.preferredName);
                expect($injectorGetSpy).toHaveBeenCalledWith('InternetBankingRegistrationFlow');
            });
        });
    });
});