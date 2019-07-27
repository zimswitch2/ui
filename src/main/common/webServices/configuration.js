var personalFinanceManagementFeature = false;
if (feature.personalFinanceManagement) {
    personalFinanceManagementFeature = true;
}

var migrateWithAtmPinFeature = false;
if (feature.migrateWithAtmPin) {
    migrateWithAtmPinFeature = true;
}

(function () {
    'use strict';

    var app = angular.module('refresh.configuration', ['refresh.webServices.endpointDefinition']);

    app.factory('URL', function () {
        return {
            authenticateLithium: '/sbg-ib/rest/LithiumService/AuthenticateLithium',
            authenticate: '/sbg-ib/rest/SecurityService/AuthenticateDI',
            changePassword: '/sbg-ib/rest/SecurityService/ChangePassword',
            resetPassword: '/sbg-ib/rest/SecurityService/PasswordReset',
            resendStepUp: '/sbg-ib/rest/SecurityService/ResendStepUp',
            cards: personalFinanceManagementFeature ? '/sbg-ib/rest/SecurityService/CardsAndPersonIdForSystemPrincipalId' :
                '/sbg-ib/rest/SecurityService/CardsForSystemPrincipalId',
            beneficiaries: '/sbg-ib/rest/RecipientService/Recipients',
            beneficiaryGroups: '/sbg-ib/rest/RecipientService/Groups',
            deleteBeneficiaryGroups: '/sbg-ib/rest/RecipientService/DeleteGroups',
            deleteBeneficiaries: '/sbg-ib/rest/RecipientService/DeleteRecipients',
            prepaidRecharge: '/sbg-ib/rest/TransactionService/Transactions',
            prepaidRechargePurchase: '/sbg-ib/rest/PrepaidService/PrepaidPurchase',
            prepaidProviderDetails: '/sbg-ib/rest/PrepaidService/ProviderDetails',
            prepaidHistory: '/sbg-ib/rest/PrepaidService/GetPrepaidHistory',
            register: '/sbg-ib/rest/SecurityService/CreateDigitalId',
            linkCard: '/sbg-ib/rest/SecurityService/AuthenticateSBSA',
            listAccounts: '/sbg-ib/rest/AccountService/Accounts',
            getEAPLimit: '/sbg-ib/rest/AccountService/ViewEAPLimit',
            transactions: '/sbg-ib/rest/TransactionService/Transactions',
            listBanks: '/sbg-ib/rest/BankingMetadataService/FetchBankList',
            searchBranch: '/sbg-ib/rest/BankingMetadataService/SearchBranch',
            paginatedStatements: '/sbg-ib/rest/AccountService/PaginatedStatement',
            listCDI: '/sbg-ib/rest/BankingMetadataService/FetchCDIList',
            findCompany: '/sbg-ib/rest//CompanyDepositIdentifierService/FindCompany',
            walkInBranches: '/sbg-ib/rest/BankingMetadataService/GetWalkInBranches',

            //Personal Financial Management Services
            getAccountsNetIncome: '/sbg-ib/rest/PersonalFinanceManagement/GetAccountsNetIncome',
            getAccountsCashflows: '/sbg-ib/rest/PersonalFinanceManagement/GetAccountsCashflows',
            getTransactionsPage: '/sbg-ib/rest/MenigaProxy/ForwardPost/Transactions.svc/GetTransactionsPage',
            getUserCategories: '/sbg-ib/rest/MenigaProxy/ForwardPost/User.svc/GetUserCategories',

            //Targeted Offers
            targetedOffersGetOffer: '/sbg-ib/rest/TargetedOffersService/GetOfferWithHighestLiftForCard',
            targetedOffersGetOfferWithTemplateData: '/sbg-ib/rest/TargetedOffersService/GetOfferWithTemplateData',
            targetedOffersGetTemplate: '/sbg-ib/rest/TargetedOffersService/GetTargetedOfferTemplate',
            targetedOffersActionOffer: '/sbg-ib/rest/TargetedOffersService/ActionOffer',
            targetedOffersSubmitDetailsToDCS: '/sbg-ib/rest/TargetedOffersService/DCSCallMeBackForOffer',

            // lookup tables
            getTitles: '/sbg-ib/rest/BankingMetadataService/GetTitles',
            getCountries: '/sbg-ib/rest/BankingMetadataService/GetCountries',
            getContactTypes: '/sbg-ib/rest/BankingMetadataService/GetCommunicationTypes',
            getIdTypes: '/sbg-ib/rest/BankingMetadataService/GetIdTypes',
            getAccommodationTypes: '/sbg-ib/rest/BankingMetadataService/GetAccommodationTypes',
            getMaritalStatuses: '/sbg-ib/rest/BankingMetadataService/GetMaritalStatus',
            getOccupationIndustries: '/sbg-ib/rest/BankingMetadataService/GetOccupIndustries',
            getOccupationLevels: '/sbg-ib/rest/BankingMetadataService/GetOccupLevels',
            getOccupationStatuses: '/sbg-ib/rest/BankingMetadataService/GetOccupStatus',
            getUnemploymentReasons: '/sbg-ib/rest/BankingMetadataService/GetOccupUnempReason',
            getEducationQualifications: '/sbg-ib/rest/BankingMetadataService/GetEducationQlfcn',
            getIncomeAndExpenseTypes: '/sbg-ib/rest/BankingMetadataService/GetInexTypes',
            getLanguages: '/sbg-ib/rest/BankingMetadataService/GetLanguages',
            // -

            futureTransactions: '/sbg-ib/rest/RecipientService/FutureTransactions',
            deleteFutureTransactions: '/sbg-ib/rest/RecipientService/DeleteFutureTransactions',
            reissueToken: '/sbg-ib/rest/SecurityService/ReIssueToken',
            paymentNotificationHistory: '/sbg-ib/rest/TransactionService/History',
            paymentHistory: '/sbg-ib/rest/Payments/History',
            activateOTP: '/sbg-ib/rest/SecurityService/ActivateOTPPreference',
            migrateExistingUser: migrateWithAtmPinFeature ? '/sbg-ib/rest/SecurityService/CopyIBUserProfile' : '/sbg-ib/rest/SecurityService/MigrateExistingUser',
            maintainMonthlyPaymentLimit: '/sbg-ib/rest/AccountService/MaintainEAPLimit',
            activateAccessDirect: '/sbg-ib/rest/SecurityService/ActivateAccessDirect',
            currentAccountOffers: '/sbg-ib/rest/AccountOriginationService/CurrentAccountOffers',
            acceptOffer: '/sbg-ib/rest/AccountOriginationService/AcceptCurrentAccountOffer',
            acceptDebitOrderSwitching: '/sbg-ib/rest/AccountOriginationService/AcceptDebitOrderSwitching',
            acceptCardCrossSell: '/sbg-ib/rest/AccountOriginationService/AcceptCardCrossSell',
            accountOriginationDeclineLetter: '/sbg-ib/rest/AccountOriginationService/GenerateDeclineLetterPdf',
            accountOriginationCostOfCreditLetter: '/sbg-ib/rest/AccountOriginationService/GenerateCostOfCredit',
            customerInformation: '/sbg-ib/rest/CustomerService/GetCustomer',
            editCustomerInformation: '/sbg-ib/rest/CustomerService/UpdateCustomer',
            updateFraudConsentAndSourceOfFunds: '/sbg-ib/rest/CustomerService/UpdateFraudConsentAndSourceOfFunds',
            updateCustomerIncomeAndExpenses: '/sbg-ib/rest/CustomerService/UpdateCustomerIncomeAndExpenses',
            updateCustomerContactInfo: '/sbg-ib/rest/CustomerService/UpdateCustomerContactInfo',
            updateCustomerEmployment: '/sbg-ib/rest/CustomerService/UpdateCustomerEmployment',
            updateCustomerConsent: '/sbg-ib/rest/CustomerService/UpdateCustomerConsents',
            updateCustomerAddress: '/sbg-ib/rest/CustomerService/UpdateCustomerAddresses',
            updateCustomerBasicInfo: '/sbg-ib/rest/CustomerService/UpdateCustomerBasicInfo',
            createCustomer: '/sbg-ib/rest/CustomerService/CreateCustomer',
            getCustomerCompliance: '/sbg-ib/rest/CustomerService/GetCustomerCompliance',
            getQuotations: '/sbg-ib/rest/AccountOriginationService/GetQuotations',
            getQuotationDetails: '/sbg-ib/rest/AccountOriginationService/GetQuotationDetails',
            getRCPQuotationDetails: '/sbg-ib/rest/AccountOriginationService/GetRcpQuotationDetails',
            getItemsForApproval: '/sbg-ib/rest/AccountOriginationService/GetItemsForApproval',
            formalStatementPreference: '/sbg-ib/rest/StatementService/GetFormalStatementPreference',
            editFormalStatementPreference: '/sbg-ib/rest/StatementService/SaveFormalStatementPreference',
            getOTPPreference: '/sbg-ib/rest/SecurityService/ViewOTPPreference',
            updateDashboard: '/sbg-ib/rest/ProfileService/ChannelProfile',
            createRcpOffer: '/sbg-ib/rest/AccountOriginationService/CreateRcpOffer',
            acceptRcpOffer: '/sbg-ib/rest/AccountOriginationService/AcceptRcpOffer',
            getRcpLoanAgreement: '/sbg-ib/rest/AccountOriginationService/GetRcpLoanAgreement',
            downloadRcpLoanAgreement: '/sbg-ib/rest/AccountOriginationService/DownloadRcpLoanAgreement',
            downloadRcpCostOfCreditAgreement: '/sbg-ib/rest/AccountOriginationService/DownloadRcpLoanCostOfCreditAgreement',
            getPreAgreementHtml: '/sbg-ib/rest/AccountOriginationService/GetRcpPreAgreementHtml',
            downloadRcpPreAgreement: '/sbg-ib/rest/AccountOriginationService/DownloadRcpPreAgreement',
            createSavingsAccountApplication: '/sbg-ib/rest/AccountOriginationService/CreateSavingsAccountApplication',
            originateSavingsAccount: '/sbg-ib/rest/AccountOriginationService/OriginateSavingsAccount',
            sendSecureMessage: '/sbg-ib/rest/SecurityService/SendSecureMessage',
            resendPaymentConfirmation: '/sbg-ib/rest/TransactionService/ResendConfirmation',
            getUncollectedInstantMoneyVouchers: '/sbg-ib/rest/TransactionService/GetUncollectedInstantMoneyVouchers',
            cancelInstantMoneyVouchers: '/sbg-ib/rest/InstantMoneyService/Cancel',
            changeInstantMoneyVoucherPin: '/sbg-ib/rest/InstantMoneyService/ChangePin',
            linkCardStatus: '/sbg-ib/rest/SecurityService/LinkCardStatus',
            leavingFeedback: '/sbg-feedback/leaving',
            errorFeedback: '/sbg-feedback/error',
            viewFormalStatementList: '/sbg-ib/rest/StatementService/ViewFormalStatementList',
            downloadFormalStatement: '/sbg-ib/rest/StatementService/DownloadFormalStatement',
            emailFormalStatement: '/sbg-ib/rest/StatementService/EmailFormalStatement',
            deleteDashboard: '/sbg-ib/rest/ProfileService/DeleteDashboard',
            getTransactions: '/sbg-ib/rest/StatementService/GetTransactions',
            downloadInformalStatementInCsv: '/sbg-ib/rest/StatementService/DownloadInformalStatementInCsv',
            messageList: '/sbg-ib/rest/Messaging/MessageList',

            /* Business Banking Service Endpoints */
            getLinkedBusinesses: '/sbg-ib/rest/BusinessBankingService/LinkedBusinesses',
            getOperatorsForBusiness: '/sbg-ib/rest/BusinessBankingService/Operators',
            getPendingOperatorsForBusiness: '/sbg-ib/rest/BusinessBankingService/PendingOperators',
            reInviteOperator: '/sbg-ib/rest/BusinessBankingService/ReInviteOperator',
            businessProfile: '/sbg-ib/rest/BusinessBankingService/BusinessProfile',
            getRolesForContext: '/sbg-ib/rest/BusinessBankingService/Roles',
            searchOperatorInvite: '/sbg-ib/rest/BusinessBankingService/SearchOperatorInvite',
            addUser: '/sbg-ib/rest/BusinessBankingService/Invitation',
            sendInviteReferenceNumber: '/sbg-ib/rest/BusinessBankingService/InviteReferenceNumber',
            acceptInvitation: '/sbg-ib/rest/BusinessBankingService/OperatorInviteAccept',
            declineInvitation: '/sbg-ib/rest/BusinessBankingService/OperatorInviteDecline',
            deleteInvitation: '/sbg-ib/rest/BusinessBankingService/OperatorInviteDelete',
            deleteOperator: '/sbg-ib/rest/BusinessBankingService/DeleteOperator',
            deactivateOperator: '/sbg-ib/rest/BusinessBankingService/DeactivateOperator',
            activateOperator: '/sbg-ib/rest/BusinessBankingService/ActivateOperator',
            updateOperator: '/sbg-ib/rest/BusinessBankingService/UpdatePerson',
            updateOperatorPermissions: '/sbg-ib/rest/BusinessBankingService/UpdateOperatorPermissions',
            editOperatorInvite: '/sbg-ib/rest/BusinessBankingService/EditOperatorInvite',
            getPendingBeneficiaryPayments: '/sbg-ib/rest/BusinessBankingService/GetPendingBeneficiaryPayments',
            getRejectedBeneficiaryPayments: '/sbg-ib/rest/BusinessBankingService/GetRejectedBeneficiaryPayments',
            getOperatorPermissions: '/sbg-ib/rest/BusinessBankingService/OperatorPermissions',

            /* Cross Border Payment Service Endpoints */
            customerDetailsXBP: '/BusinessBanking/rest/CrossBorderService/GetUserDetailsForXBP',
            getMasterDataForXBP: '/BusinessBanking/rest/CrossBorderService/GetMasterDataForXBP',
            validateDetailsForXBP: '/BusinessBanking/rest/CrossBorderService/ValidateDetailsForXBP',
            getConversionRateAndFeesForXBP: '/BusinessBanking/rest/CrossBorderService/GetConversionRateAndFeesForXBP',
            submitPaymentForXBP: '/BusinessBanking/rest/CrossBorderService/SubmitPaymentForXBP',

            /* eBridge Retail WEB Service Endpoints */
            getPeers: '/sbg-ib/rest/EBridgeRetailService/GetPeers',

            version: '/sbg-ib/rest/VersionService/Version'
        };
    });

    app.factory('ServiceEndpoint', function (URL, EndpointDefinition) {
        var endpoints = {};
        var defaultSpinnerStyle = 'global';

        function defineEndpoint(name, url, method, spinnerStyle, ignoreErrorResponseCodes) {
            endpoints[name] = EndpointDefinition.create(url, method, spinnerStyle, ignoreErrorResponseCodes);
        }

        defineEndpoint('authenticateLithium', URL.authenticateLithium, 'POST');
        defineEndpoint('listBeneficiary', URL.beneficiaries, 'POST');
        defineEndpoint('viewFutureTransactions', URL.futureTransactions, 'POST');
        defineEndpoint('amendFutureTransactions', URL.futureTransactions, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('deleteFutureTransactions', URL.deleteFutureTransactions, 'POST', 'inline', true);
        defineEndpoint('addOrUpdateBeneficiary', URL.beneficiaries, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('changeBeneficiaryGroupMembership', URL.beneficiaries, 'PUT', 'inline', true);
        defineEndpoint('deleteBeneficiary', URL.deleteBeneficiaries, 'POST', 'inline', true);
        defineEndpoint('deleteBeneficiaryGroups', URL.deleteBeneficiaryGroups, 'POST', 'inline');
        defineEndpoint('prepaidHistory', URL.prepaidHistory, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('paginatedStatements', URL.paginatedStatements, 'POST', 'inline', true);
        defineEndpoint('location', '/api/v1/services/location', 'GET');
        defineEndpoint('geocode', '/api/v1/geocode', 'GET');
        defineEndpoint('authenticate', URL.authenticate, 'POST');
        defineEndpoint('cards', URL.cards, 'POST');
        defineEndpoint('register', URL.register, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('linkCard', URL.linkCard, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('listAccounts', URL.listAccounts, 'POST');
        defineEndpoint('getEAPLimit', URL.getEAPLimit, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('viewBeneficiaryGroup', URL.beneficiaryGroups, 'POST');
        defineEndpoint('renameBeneficiaryGroup', URL.beneficiaryGroups, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('addBeneficiaryGroup', URL.beneficiaryGroups, 'PUT', 'inline', true);
        defineEndpoint('pay', URL.transactions, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('transferBetweenAccounts', URL.transactions, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('listBanks', URL.listBanks, 'GET');
        defineEndpoint('listCDI', URL.listCDI, 'GET');
        defineEndpoint('findCompany', URL.findCompany, 'GET');
        defineEndpoint('walkInBranches', URL.walkInBranches, 'GET', 'none');

        //Personal Financial Management Services
        defineEndpoint('getAccountsNetIncome', URL.getAccountsNetIncome, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('getAccountsCashflows', URL.getAccountsCashflows, 'POST');
        defineEndpoint('getTransactionsPage', URL.getTransactionsPage, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('getUserCategories', URL.getUserCategories, 'POST', defaultSpinnerStyle, true);

        //Targeted Offers
        defineEndpoint('targetedOffersGetOffer', URL.targetedOffersGetOffer, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('targetedOffersGetOfferWithTemplateData', URL.targetedOffersGetOfferWithTemplateData, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('targetedOffersGetTemplate', URL.targetedOffersGetTemplate, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('targetedOffersActionOffer', URL.targetedOffersActionOffer, 'POST');
        defineEndpoint('targetedOffersSubmitDetailsToDCS', URL.targetedOffersSubmitDetailsToDCS, 'POST');

        // lookup tables
        defineEndpoint('getTitles', URL.getTitles, 'GET', 'none');
        defineEndpoint('getCountries', URL.getCountries, 'GET', 'none');
        defineEndpoint('getContactTypes', URL.getContactTypes, 'GET', 'none');
        defineEndpoint('getIdTypes', URL.getIdTypes, 'GET', 'none');
        defineEndpoint('getAccommodationTypes', URL.getAccommodationTypes, 'GET', 'none');
        defineEndpoint('getMaritalStatuses', URL.getMaritalStatuses, 'GET', 'none');
        defineEndpoint('getOccupationIndustries', URL.getOccupationIndustries, 'GET', 'none');
        defineEndpoint('getOccupationLevels', URL.getOccupationLevels, 'GET', 'none');
        defineEndpoint('getOccupationStatuses', URL.getOccupationStatuses, 'GET', 'none');
        defineEndpoint('getUnemploymentReasons', URL.getUnemploymentReasons, 'GET', 'none');
        defineEndpoint('getEducationQualifications', URL.getEducationQualifications, 'GET', 'none');
        defineEndpoint('getIncomeAndExpenseTypes', URL.getIncomeAndExpenseTypes, 'GET', 'none');
        defineEndpoint('getLanguages', URL.getLanguages, 'GET', 'none');
        // -

        defineEndpoint('searchBranches', URL.searchBranch, 'POST', 'inline');
        defineEndpoint('reissueToken', URL.reissueToken, 'POST', 'none');
        defineEndpoint('paymentNotificationHistory', URL.paymentNotificationHistory, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('paymentHistory', URL.paymentHistory, 'GET', 'inline', true);
        defineEndpoint('prepaidRecharge', URL.prepaidRecharge, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('prepaidRechargePurchase', URL.prepaidRechargePurchase, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('prepaidProviderDetails', URL.prepaidProviderDetails, 'GET', defaultSpinnerStyle, true);
        defineEndpoint('changePassword', URL.changePassword, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('resetPassword', URL.resetPassword, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('activateOTP', URL.activateOTP, 'POST');
        defineEndpoint('migrateExistingUser', URL.migrateExistingUser, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('currentAccountOffers', URL.currentAccountOffers, 'POST');
        defineEndpoint('acceptOffer', URL.acceptOffer, 'POST');
        defineEndpoint('acceptDebitOrderSwitching', URL.acceptDebitOrderSwitching, 'POST');
        defineEndpoint('acceptCardCrossSell', URL.acceptCardCrossSell, 'POST');
        defineEndpoint('accountOriginationDeclineLetter', URL.accountOriginationDeclineLetter, 'POST', 'inline');
        defineEndpoint('maintainMonthlyPaymentLimit', URL.maintainMonthlyPaymentLimit, 'POST', defaultSpinnerStyle, true);

        defineEndpoint('customerInformation', URL.customerInformation, 'POST');
        defineEndpoint('updateCustomerInformation', URL.editCustomerInformation, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('updateFraudConsentAndSourceOfFunds', URL.updateFraudConsentAndSourceOfFunds, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('updateCustomerIncomeAndExpenses', URL.updateCustomerIncomeAndExpenses, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('updateCustomerContactInfo', URL.updateCustomerContactInfo, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('updateCustomerEmployment', URL.updateCustomerEmployment, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('updateCustomerConsent', URL.updateCustomerConsent, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('updateCustomerAddress', URL.updateCustomerAddress, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('updateCustomerBasicInfo', URL.updateCustomerBasicInfo, 'PUT', defaultSpinnerStyle, true);
        defineEndpoint('createCustomer', URL.createCustomer, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('getCustomerCompliance', URL.getCustomerCompliance, 'POST');

        defineEndpoint('activateAccessDirect', URL.activateAccessDirect, 'POST');
        defineEndpoint('getQuotations', URL.getQuotations, 'POST');
        defineEndpoint('getQuotationDetails', URL.getQuotationDetails, 'POST');
        defineEndpoint('getRCPQuotationDetails', URL.getRCPQuotationDetails, 'POST');
        defineEndpoint('getItemsForApproval', URL.getItemsForApproval, 'POST');
        defineEndpoint('formalStatementPreference', URL.formalStatementPreference, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('editFormalStatementPreference', URL.editFormalStatementPreference, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('getOTPPreference', URL.getOTPPreference, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('updateDashboard', URL.updateDashboard, 'PUT');
        defineEndpoint('createRcpOffer', URL.createRcpOffer, 'POST');
        defineEndpoint('acceptRcpOffer', URL.acceptRcpOffer, 'POST');
        defineEndpoint('getRcpLoanAgreement', URL.getRcpLoanAgreement, 'POST');
        defineEndpoint('getPreAgreementHtml', URL.getPreAgreementHtml, 'POST');
        defineEndpoint('createSavingsAccountApplication', URL.createSavingsAccountApplication, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('originateSavingsAccount', URL.originateSavingsAccount, 'POST');
        defineEndpoint('sendSecureMessage', URL.sendSecureMessage, 'POST');
        defineEndpoint('resendPaymentConfirmation', URL.resendPaymentConfirmation, 'POST', 'inline');
        defineEndpoint('getUncollectedInstantMoneyVouchers', URL.getUncollectedInstantMoneyVouchers, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('cancelInstantMoneyVouchers', URL.cancelInstantMoneyVouchers, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('changeInstantMoneyVoucherPin', URL.changeInstantMoneyVoucherPin, 'POST');
        defineEndpoint('linkCardStatus', URL.linkCardStatus, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('leavingFeedback', URL.leavingFeedback, 'POST');
        defineEndpoint('errorFeedback', URL.errorFeedback, 'POST');

        defineEndpoint('viewFormalStatementList', URL.viewFormalStatementList, 'POST');
        defineEndpoint('emailFormalStatement', URL.emailFormalStatement, 'POST');
        defineEndpoint('deleteDashboard', URL.deleteDashboard, 'PUT');
        defineEndpoint('getTransactions', URL.getTransactions, 'POST', 'inline', true);


        /* Business Banking */
        defineEndpoint('getLinkedBusinesses', URL.getLinkedBusinesses, 'POST');
        defineEndpoint('getOperatorsForBusiness', URL.getOperatorsForBusiness, 'POST');
        defineEndpoint('getPendingOperatorsForBusiness', URL.getPendingOperatorsForBusiness, 'POST');
        defineEndpoint('reInviteOperator', URL.reInviteOperator, 'PUT');
        defineEndpoint('getRolesForContext', URL.getRolesForContext, 'POST');
        defineEndpoint('businessProfile', URL.businessProfile, 'POST');
        defineEndpoint('version', URL.version, 'GET');
        defineEndpoint('searchOperatorInvite', URL.searchOperatorInvite, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('addUser', URL.addUser, 'POST', defaultSpinnerStyle, true);
        defineEndpoint('sendInviteReferenceNumber', URL.sendInviteReferenceNumber, 'POST');
        defineEndpoint('acceptInvitation', URL.acceptInvitation, 'POST');
        defineEndpoint('declineInvitation', URL.declineInvitation, 'POST');
        defineEndpoint('deleteInvitation', URL.deleteInvitation, 'POST');
        defineEndpoint('deleteOperator', URL.deleteOperator, 'POST', defaultSpinnerStyle, false);
        defineEndpoint('activateOperator', URL.activateOperator, 'PUT', defaultSpinnerStyle, false);
        defineEndpoint('deactivateOperator', URL.deactivateOperator, 'PUT', defaultSpinnerStyle, false);
        defineEndpoint('updateOperator', URL.updateOperator, 'PUT');
        defineEndpoint('updateOperatorPermissions', URL.updateOperatorPermissions, 'PUT');
        defineEndpoint('editOperatorInvite', URL.editOperatorInvite, 'POST', defaultSpinnerStyle, false);
        defineEndpoint('getPendingBeneficiaryPayments', URL.getPendingBeneficiaryPayments, 'POST', defaultSpinnerStyle, false);
        defineEndpoint('getRejectedBeneficiaryPayments', URL.getRejectedBeneficiaryPayments, 'POST', defaultSpinnerStyle, false);
        defineEndpoint('getOperatorPermissions', URL.getOperatorPermissions, 'POST', defaultSpinnerStyle, false);

        /* Cross Border Payment Service Endpoints */
        defineEndpoint('customerDetailsXBP', URL.customerDetailsXBP, 'POST');
        defineEndpoint('getMasterDataForXBP', URL.getMasterDataForXBP, 'POST');
        defineEndpoint('validateDetailsForXBP', URL.validateDetailsForXBP, 'POST');
        defineEndpoint('getConversionRateAndFeesForXBP', URL.getConversionRateAndFeesForXBP, 'POST');
        defineEndpoint('submitPaymentForXBP', URL.submitPaymentForXBP, 'POST');

        /* Messaging Endpoints */
        defineEndpoint('messageList', URL.messageList, 'POST');

        /* EBridge Retail Service Endpoints */
        defineEndpoint('getPeers', URL.getPeers, 'POST');

        return endpoints;
    });

    app.run(function ($rootScope, $timeout) {
        $rootScope.configuration = {
            email: {
                maxLength: 100,
                pattern: "[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\\\.[a-zA-Z0-9-.]+[A-Za-z0-9]"
            },
            password: {
                minLength: 8,
                maxLength: 20,
                pattern: "(?=.*\\\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z._^%$#!~@,-]{8,}"
            }
        };

        $rootScope.fixIeDynamicOption = function () {
            $timeout(function () {
                $('select').each(function (dx, selectObject) {
                    // fix: IE9 do not support dynamic option change
                    var text = selectObject.options[selectObject.selectedIndex].text;
                    selectObject.options[selectObject.selectedIndex].text = text + " ";
                    selectObject.options[selectObject.selectedIndex].text = text;
                });
            });
        };
    });

})();
