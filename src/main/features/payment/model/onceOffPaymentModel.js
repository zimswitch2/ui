(function (app) {
    'use strict';

    app.factory('OnceOffPaymentModel', function () {

        var defaultConfirmationAddresses = {
          "None": null,
          "Email": null,
          "Fax": null,
          "SMS": null
        };

        var defaultConfirmationType = 'Email';
        var defaultPaymentConfirmation = {
            "address": null,
            "confirmationType": defaultConfirmationType,
            "recipientName": null,
            "sendFutureDated": null
        };

        var defaultBeneficiary = {
          "name": null,
          "oldName": null,
          "accountNumber": null,
          "beneficiaryType": "PRIVATE",
          "recipientId": "1",
          "oldBank": undefined,
          "bank": undefined,
          "paymentConfirmation": _.cloneDeep(defaultPaymentConfirmation)
        };

        var defaultOnceOffPaymentModel = {
          "account" : null,
          "amount" : undefined,
          "beneficiary" : _.cloneDeep(defaultBeneficiary),
          "cardProfile" : null,
          "errorMessage" : null,
          "beneficiaryAdded" : false,
          "listedBeneficiary" : undefined,
          "oldListedBeneficiaryName": null,
          "paymentConfirmation" : true,
          "saveAsBeneficiary" : false,
          "isSuccessful" : false
        };

        var onceOffPaymentModel = _.cloneDeep(defaultOnceOffPaymentModel);

        var confirmationAddresses = _.cloneDeep(defaultConfirmationAddresses);
        var selectedConfirmationType = defaultConfirmationType;

        function setBeneficiaryDefaultsAndMappings() {
          if (!onceOffPaymentModel.beneficiary) {
            onceOffPaymentModel.beneficiary = _.cloneDeep(defaultBeneficiary);
          }
          if (!onceOffPaymentModel.beneficiary.paymentConfirmation ) {
            onceOffPaymentModel.beneficiary.paymentConfirmation = _.cloneDeep(defaultPaymentConfirmation);
          }


          if (onceOffPaymentModel.listedBeneficiary) {
              onceOffPaymentModel.beneficiary.name = onceOffPaymentModel.listedBeneficiary.name;
              onceOffPaymentModel.beneficiary.accountNumber = onceOffPaymentModel.listedBeneficiary.number;
              onceOffPaymentModel.beneficiary.beneficiaryType = 'COMPANY';
          }

          if (onceOffPaymentModel.beneficiary.bank) {
            onceOffPaymentModel.beneficiary.oldBank = _.cloneDeep(onceOffPaymentModel.beneficiary.bank);
          }
        }

        function setPaymentConfirmationDefaultsAndMappings() {
          if (onceOffPaymentModel.paymentConfirmation ) {
            if (onceOffPaymentModel.beneficiary.name && !onceOffPaymentModel.isListedBeneficiary() && !onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName) {
              onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName = onceOffPaymentModel.beneficiary.name;
            }
          }

        }

        function setDefaultsAndMappings() {
            setBeneficiaryDefaultsAndMappings();
            setPaymentConfirmationDefaultsAndMappings();
        }

        function initialise() {
          for (var item in defaultOnceOffPaymentModel) {
            onceOffPaymentModel[item] = _.cloneDeep(defaultOnceOffPaymentModel[item]);
          }

          selectedConfirmationType = defaultConfirmationType;
          confirmationAddresses = _.cloneDeep(defaultConfirmationAddresses);
          setDefaultsAndMappings();

        }

        function getOnceOffPaymentModel () {
          return onceOffPaymentModel;
        }

        onceOffPaymentModel.setCardProfile = function(cardProfile) {
          onceOffPaymentModel.cardProfile = cardProfile;
        };

        onceOffPaymentModel.setAccount = function(account) {
          onceOffPaymentModel.account = account;
        };

        onceOffPaymentModel.setBeneficiary = function (beneficiary) {
          onceOffPaymentModel.beneficiary = beneficiary;
          setDefaultsAndMappings();
          if (onceOffPaymentModel.paymentConfirmation && onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName === onceOffPaymentModel.beneficiary.oldName && onceOffPaymentModel.isPrivateBeneficiary()) {
            onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName = onceOffPaymentModel.beneficiary.name;
          }

          onceOffPaymentModel.beneficiary.oldName = onceOffPaymentModel.beneficiary.name;
        };

        onceOffPaymentModel.setErrorMessage = function (errorMessage) {
          onceOffPaymentModel.errorMessage = errorMessage;
        };

        onceOffPaymentModel.setListedBeneficiary = function(listedBeneficiary) {
          onceOffPaymentModel.listedBeneficiary = listedBeneficiary;
          setDefaultsAndMappings();
          if (onceOffPaymentModel.listedBeneficiary && onceOffPaymentModel.listedBeneficiary.name !== onceOffPaymentModel.oldListedBeneficiaryName) {
            onceOffPaymentModel.errorMessage = null;
            onceOffPaymentModel.oldListedBeneficiaryName = onceOffPaymentModel.listedBeneficiary.name;
          }
        };

        onceOffPaymentModel.setSaveAsBeneficiary = function (saveAsBeneficiary) {
          onceOffPaymentModel.saveAsBeneficiary = saveAsBeneficiary;
        };

        onceOffPaymentModel.setIsSuccessful = function(isSuccessful) {
          onceOffPaymentModel.isSuccessful = isSuccessful;
        };

        onceOffPaymentModel.setAmount = function(amount) {
          onceOffPaymentModel.amount = amount;
        };

        onceOffPaymentModel.setBeneficiaryAdded = function (beneficiaryAdded) {
          onceOffPaymentModel.beneficiaryAdded = beneficiaryAdded;
        };

        onceOffPaymentModel.setPaymentConfirmation = function(paymentConfirmation) {
          onceOffPaymentModel.paymentConfirmation = paymentConfirmation;

          if (onceOffPaymentModel.paymentConfirmation === true) {
            onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType = selectedConfirmationType;
          } else {
            confirmationAddresses[selectedConfirmationType] = onceOffPaymentModel.beneficiary.paymentConfirmation.address;
            onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType = 'None';
          }
          onceOffPaymentModel.beneficiary.paymentConfirmation.address = confirmationAddresses[onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType];

          setDefaultsAndMappings();
        };

        onceOffPaymentModel.setBeneficiaryPaymentConfirmationConfirmationType = function(confirmationType) {

          onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType = confirmationType;
          if (onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType !== 'None' ) {
            confirmationAddresses[selectedConfirmationType] = onceOffPaymentModel.beneficiary.paymentConfirmation.address;
            selectedConfirmationType = onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType;
          }
          onceOffPaymentModel.beneficiary.paymentConfirmation.address = confirmationAddresses[onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType];
        };

        onceOffPaymentModel.hasZeroEAPLimit = function() {
          return onceOffPaymentModel.cardProfile.monthlyEAPLimit.amount === 0;
        };

        onceOffPaymentModel.isPrivateBeneficiary = function() {
            return !onceOffPaymentModel.isListedBeneficiary();
        };

        onceOffPaymentModel.isListedBeneficiary = function() {
            return !(!onceOffPaymentModel.listedBeneficiary);
        };

        onceOffPaymentModel.hasPaymentConfirmation  = function() {
            return onceOffPaymentModel.beneficiary.paymentConfirmation.address !== null;
        };

        onceOffPaymentModel.getAvailableEAPLimit = function() {
          return onceOffPaymentModel.cardProfile.monthlyEAPLimit.amount - onceOffPaymentModel.cardProfile.usedEAPLimit.amount;
        };

        return {
          initialise: initialise,
          getOnceOffPaymentModel: getOnceOffPaymentModel,
          setAccount: onceOffPaymentModel.setAccount,
          setPaymentConfirmation: onceOffPaymentModel.setPaymentConfirmation,
          setBeneficiary: onceOffPaymentModel.setBeneficiary,
          setCardProfile: onceOffPaymentModel.setCardProfile,
          setErrorMessage: onceOffPaymentModel.setErrorMessage,
          setAmount: onceOffPaymentModel.setAmount,
          setIsSuccessful: onceOffPaymentModel.setIsSuccessful,
          setBeneficiaryAdded: onceOffPaymentModel.setBeneficiaryAdded,
          setListedBeneficiary: onceOffPaymentModel.setListedBeneficiary,
          setSaveAsBeneficiary: onceOffPaymentModel.setSaveAsBeneficiary,
          setBeneficiaryPaymentConfirmationConfirmationType: onceOffPaymentModel.setBeneficiaryPaymentConfirmationConfirmationType,
          hasZeroEAPLimit: onceOffPaymentModel.hasZeroEAPLimit,
          isPrivateBeneficiary: onceOffPaymentModel.isPrivateBeneficiary,
          isListedBeneficiary: onceOffPaymentModel.isListedBeneficiary,
          hasPaymentConfirmation: onceOffPaymentModel.hasPaymentConfirmation,
          getAvailableEAPLimit: onceOffPaymentModel.getAvailableEAPLimit
        };
    });
})
(angular.module('refresh.onceOffPayment'));
