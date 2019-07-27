describe('configuration', function () {
    'use strict';

    beforeEach(function () {
        module('refresh.configuration');
    });

    describe('when toggles are off', function () {
        beforeEach(function () {
            personalFinanceManagementFeature = false;
            migrateWithAtmPinFeature = false;
        });

        it('should configure cards URL to /sbg-ib/rest/SecurityService/CardsForSystemPrincipalId',
            inject(function (URL) {
                expect(URL.cards).toEqual('/sbg-ib/rest/SecurityService/CardsForSystemPrincipalId');
            }));

        it('should configure migrate profile URL to /sbg-ib/rest/SecurityService/MigrateExistingUser',
            inject(function (URL) {
                expect(URL.migrateExistingUser).toEqual('/sbg-ib/rest/SecurityService/MigrateExistingUser');
            }));
    });

    describe('when toggles are on', function () {
        beforeEach(function () {
            personalFinanceManagementFeature = true;
            migrateWithAtmPinFeature = true;
        });

        it('should configure cards URL to /sbg-ib/rest/SecurityService/CardsAndPersonIdForSystemPrincipalId',
            inject(function (URL) {
                expect(URL.cards).toEqual('/sbg-ib/rest/SecurityService/CardsAndPersonIdForSystemPrincipalId');
            }));

        it('should configure migrate profile URL to /sbg-ib/rest/SecurityService/CopyIBUserProfile',
            inject(function (URL) {
                expect(URL.migrateExistingUser).toEqual('/sbg-ib/rest/SecurityService/CopyIBUserProfile');
            }));
    });

    describe('ServiceEndpoint configuration', function () {
        var serviceEndpoint;
        beforeEach(inject(function (ServiceEndpoint) {
            serviceEndpoint = ServiceEndpoint;
        }));

        var ignoreErrorResponseCodeEndpoints = [
            'getUserCategories',
            'createCustomer',
            'createSavingsAccountApplication',
            'getEAPLimit',
            'addOrUpdateBeneficiary',
            'changeBeneficiaryGroupMembership',
            'deleteBeneficiary',
            'addBeneficiaryGroup',
            'renameBeneficiaryGroup',
            'getUncollectedInstantMoneyVouchers',
            'pay',
            'transferBetweenAccounts',
            'amendFutureTransactions',
            'deleteFutureTransactions',
            'paymentNotificationHistory',
            'paymentHistory',
            'getAccountsNetIncome',
            'prepaidHistory',
            'prepaidRecharge',
            'prepaidRechargePurchase',
            'prepaidProviderDetails',
            'maintainMonthlyPaymentLimit',
            'register',
            'changePassword',
            'resetPassword',
            'linkCard',
            'linkCardStatus',
            'migrateExistingUser',
            'getOTPPreference',
            'getTransactionsPage',
            'paginatedStatements',
            'formalStatementPreference',
            'editFormalStatementPreference',
            'targetedOffersGetOffer',
            'targetedOffersGetTemplate',
            'targetedOffersGetOfferWithTemplateData',
            'updateFraudConsentAndSourceOfFunds',
            'updateCustomerIncomeAndExpenses',
            'updateCustomerContactInfo',
            'updateCustomerEmployment',
            'updateCustomerConsent',
            'updateCustomerAddress',
            'updateCustomerBasicInfo',
            'createCustomer',
            'updateCustomerInformation',
            'cancelInstantMoneyVouchers',
            'searchOperatorInvite',
            'addUser',
            'resetPassword',
            'getTransactions'
        ];

        using(ignoreErrorResponseCodeEndpoints, function (endPoint) {
            it(endPoint + ' should ignore error response codes', function () {
                expect(serviceEndpoint[endPoint].ignoreErrorResponseCodes).toBeTruthy();
            });
        });


        it('Other endpoints should not ignore error response codes', function () {
            _.forEach(serviceEndpoint, function (endpoint, endpointName) {
                if (_.includes(ignoreErrorResponseCodeEndpoints, endpointName)) {
                    return;
                }

                endpoint.ignoreErrorResponseCodes = endpoint.ignoreErrorResponseCodes ? endpointName : false;

                expect(endpoint.ignoreErrorResponseCodes).toBeFalsy();
            });
        });
    });

    afterEach(function () {
        personalFinanceManagementFeature = true;
    });
});
