(function () {

    'use strict';
    var app = angular.module('refresh.accountOrigination.savings.domain.savingsAccountApplication', []);
    app.factory('SavingsAccountApplication', function () {
        var _state = {
            productName: undefined,
            productCode: undefined,
            minimumInitialDeposit: 0.00,
            initialDepositAmountHints: undefined,
            maximumInitialDeposit: undefined,
            maximumInitialDepositExceededMessage: undefined,
            productTermsAndConditionsLink: undefined,
            transferPageAdditionalInformation: undefined,
            offerId: undefined,
            caseId: undefined,
            transferFromAccount: undefined,
            initialDepositAmount: undefined,
            accountNumber: undefined,
            originationDate: undefined,
            applicationSuccessful: false
        };

        function initialise(productInformation) {
            _state.offerId = undefined;
            _state.caseId = undefined;
            _state.transferFromAccount = undefined;
            _state.initialDepositAmount = undefined;
            _state.accountNumber = undefined;
            _state.applicationSuccessful = false;
            _state.productName = productInformation.ProductName;
            _state.productCode = productInformation.ProductCode;
            _state.minimumInitialDeposit = productInformation.MinimumInitialDeposit;
            _state.initialDepositAmountHints = productInformation.InitialDepositAmountHints;
            _state.maximumInitialDeposit = productInformation.MaximumInitialDeposit;
            _state.maximumInitialDepositExceededMessage = productInformation.MaximumInitialDepositExceededMessage;
            _state.productTermsAndConditionsLink = productInformation.ProductTermsAndConditionsLink;
            _state.transferPageAdditionalInformation = productInformation.TransferPageAdditionalInformation;
        }

        var availableProducts = {
            'pure-save': {
                ProductName: 'PureSave',
                ProductCode: '9258',
                ProductTermsAndConditionsLink: 'https://www.standardbank.co.za/secure/applications/wcf/puresavetc.pdf',
                TransferPageAdditionalInformation: '',
                MinimumInitialDeposit: 50.00,
                MaximumInitialDeposit: 4999999.99,
                MaximumInitialDepositExceededMessage: 'Please note that you have specified an amount that exceeds the maximum amount permitted for a transfer of R4 999 999.99. Please capture an amount in the permitted range'
            },
            'market-link': {
                ProductName: 'MarketLink',
                ProductCode: '9257',
                ProductTermsAndConditionsLink: 'https://www.standardbank.co.za/secure/applications/wcf/MarketLinktc.pdf',
                TransferPageAdditionalInformation: '',
                MinimumInitialDeposit: 5000.00,
                MaximumInitialDeposit: 4999999.99,
                MaximumInitialDepositExceededMessage: 'Please note that you have specified an amount that exceeds the maximum amount permitted for a transfer of R4 999 999.99. Please capture an amount in the permitted range'
            },
            'tax-free-call-account': {
                ProductName: 'Tax-Free Call',
                ProductCode: '9273',
                ProductTermsAndConditionsLink: 'https://www.standardbank.co.za/standimg/South%20Africa/PDF/Terms%20and%20Conditions/Personal/Banking/Savings%20and%20Investments%20Accounts/Tax%20Free%20Call%20Deposit%20Terms%20and%20Conditions.pdf',
                TransferPageAdditionalInformation: 'Maximum transfer: R 30 000.00 per year',
                MinimumInitialDeposit: 250.00,
                MaximumInitialDeposit: 30000.00,
                MaximumInitialDepositExceededMessage: 'Please note that you have specified an amount that exceeds the annual contribution permitted on this account of R30 000. Please capture an amount in the permitted range'
            }
        };

        return {
            start: function(productType){
                initialise(availableProducts[productType]);
            },
            productName: function () {
                return _state.productName;
            },
            productCode: function () {
                return _state.productCode;
            },
            minimumInitialDeposit: function () {
                return _state.minimumInitialDeposit;
            },
            initialDepositAmountHints: function () {
                return _state.initialDepositAmountHints;
            },
            maximumInitialDeposit: function () {
                return _state.maximumInitialDeposit;
            },
            maximumInitialDepositExceededMessage: function () {
                return _state.maximumInitialDepositExceededMessage;
            },
            productTermsAndConditionsLink: function () {
                return _state.productTermsAndConditionsLink;
            },
            transferPageAdditionalInformation: function () {
                return _state.transferPageAdditionalInformation;
            },
            offerId: function () {
                return _state.offerId;
            },
            caseId: function () {
                return _state.caseId;
            },
            offer: function(offer) {
                _state.offerId = offer ? offer.offerId : undefined;
                _state.caseId = offer ? offer.caseId : undefined;
                return {
                    applicationNumber: _state.offerId
                };
            },
            decline: function () {},
            isNew: function () {},
            transferFromAccount: function() {
                return _state.transferFromAccount;
            },
            initialDepositAmount: function() {
                return _state.initialDepositAmount;
            },
            setInitialDeposit: function (transferFromAndAmount) {
                _state.transferFromAccount = transferFromAndAmount.transferFromAccount;
                _state.initialDepositAmount = transferFromAndAmount.initialDepositAmount;
            },
            accountOriginated: function (newAccountDetails) {
                _state.accountNumber = newAccountDetails.accountNumber;
                _state.originationDate = new Date(newAccountDetails.originationDate);
                _state.applicationSuccessful = true;
            },
            accountNumber: function () {
                return _state.accountNumber;
            },
            originationDate: function () {
                return _state.originationDate;
            },
            applicationSuccessful: function () {
                return _state.applicationSuccessful;
            },
            availableProducts: function () {
                return availableProducts;
            }
        };
    });
})();