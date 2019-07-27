'use strict';

describe('onceOffPaymentModel ', function () {
    beforeEach(module('refresh.onceOffPayment'));

    var onceOffPaymentModel, model;
    var cardProfileWithEAPLimit = {
        "monthlyEAPLimit": {"amount": 10000, "currency": "ZAR"},
        "monthlyWithdrawalLimit": {"amount": 10000, "currency": "ZAR"},
        "usedEAPLimit": {"amount": 2000, "currency": "ZAR"}
    };
    var initialBeneficiary = {
        "name": null,
        "oldName": null,
        "accountNumber": null,
        "beneficiaryType": "PRIVATE",
        "recipientId": "1",
        "oldBank": undefined,
        "bank": undefined,
        "paymentConfirmation": {
            "address": null,
            "confirmationType": 'Email',
            "recipientName": null,
            "sendFutureDated": null
        }
    };

    beforeEach(inject(function (OnceOffPaymentModel) {
        onceOffPaymentModel = OnceOffPaymentModel;
        onceOffPaymentModel.initialise();
        model = onceOffPaymentModel.getOnceOffPaymentModel();
    }));

    it('should return an initial model ', function () {
        expect(model.account).toBeNull();
        expect(model.amount).toBeUndefined();
        expect(model.beneficiary).toEqual(initialBeneficiary);
        expect(model.cardProfile).toBeNull();
        expect(model.errorMessage).toBeNull();
        expect(model.beneficiaryAdded).toEqual(false);
        expect(model.listedBeneficiary).toBeUndefined();
        expect(model.oldListedBeneficiaryName).toBeNull();
        expect(model.paymentConfirmation).toEqual(true);
        expect(model.saveAsBeneficiary).toEqual(false);
        expect(model.isSuccessful).toEqual(false);
    });

    it('should get true for property beneficiaryAdded after setting it to true with the setBeneficiary function', function () {
        onceOffPaymentModel.setBeneficiaryAdded(true);
        expect(model.beneficiaryAdded).toEqual(true);
    });

    it('should set to hasZeroEAPLimit to false when limit is zero', function () {
        onceOffPaymentModel.setCardProfile({"monthlyEAPLimit": {"amount": 0.00}});

        expect(onceOffPaymentModel.hasZeroEAPLimit()).toBeTruthy();
    });

    it('should set to hasZeroEAPLimit to true when limit is not zero', function () {
        onceOffPaymentModel.setCardProfile({"monthlyEAPLimit": {"amount": 10.00}});

        expect(onceOffPaymentModel.hasZeroEAPLimit()).toBeFalsy();
    });
    it('should know if a listed beneficiary is being added', function () {
        onceOffPaymentModel.setListedBeneficiary({name: "edgars", number: "67890"});
        expect(onceOffPaymentModel.isPrivateBeneficiary()).toBeFalsy();
        expect(onceOffPaymentModel.isListedBeneficiary()).toBeTruthy();
    });

    it('should know if a private beneficiary is being added', function () {
        onceOffPaymentModel.setListedBeneficiary(undefined);
        expect(onceOffPaymentModel.isPrivateBeneficiary()).toBeTruthy();
        expect(onceOffPaymentModel.isListedBeneficiary()).toBeFalsy();
    });

    it('should default the beneficiary if a null or undefined object is given', function () {
        onceOffPaymentModel.setBeneficiary(undefined);
        expect(model.beneficiary).toEqual(initialBeneficiary);
    });

    it('should find hasPaymentConfirmation to be true as confirmation.address is not null', function () {
        var beneficiary = model.beneficiary;
        beneficiary.paymentConfirmation.address = 'someAddress';
        onceOffPaymentModel.setBeneficiary(beneficiary);
        expect(onceOffPaymentModel.hasPaymentConfirmation()).toBeTruthy();
    });

    it('should find hasPaymentConfirmation to be false as confirmation.address is null', function () {
        var beneficiary = model.beneficiary;
        beneficiary.paymentConfirmation.address = null;
        onceOffPaymentModel.setBeneficiary(beneficiary);
        expect(onceOffPaymentModel.hasPaymentConfirmation()).toBeFalsy();
    });

    it('should know available EAP limit', function () {
        onceOffPaymentModel.setCardProfile(cardProfileWithEAPLimit);
        expect(onceOffPaymentModel.getAvailableEAPLimit()).toEqual(8000);
    });

    it('should determine if a transaction has a payment confirmation', function () {
        var beneficiary = model.beneficiary;
        beneficiary.paymentConfirmation.address = null;
        expect(onceOffPaymentModel.hasPaymentConfirmation()).toBeFalsy();
        beneficiary.paymentConfirmation.address = "some address";
        expect(onceOffPaymentModel.hasPaymentConfirmation()).toBeTruthy();
    });

    it('should remember past confirmation details as switching between the various confirmation types', function () {
        model.setPaymentConfirmation(true);
        var beneficiary = model.beneficiary;

        model.setBeneficiaryPaymentConfirmationConfirmationType('SMS');
        beneficiary.paymentConfirmation.address = '0123456789';
        expect(model.beneficiary.paymentConfirmation.confirmationType).toEqual('SMS');
        expect(model.beneficiary.paymentConfirmation.address).toEqual('0123456789');

        model.setBeneficiaryPaymentConfirmationConfirmationType('Email');
        beneficiary.paymentConfirmation.address = 'test@testing.co.za';
        expect(model.beneficiary.paymentConfirmation.confirmationType).toEqual('Email');
        expect(model.beneficiary.paymentConfirmation.address).toEqual('test@testing.co.za');

        model.setBeneficiaryPaymentConfirmationConfirmationType('SMS');
        expect(model.beneficiary.paymentConfirmation.confirmationType).toEqual('SMS');
        expect(model.beneficiary.paymentConfirmation.address).toEqual('0123456789');

        model.setBeneficiaryPaymentConfirmationConfirmationType('Email');
        expect(model.beneficiary.paymentConfirmation.confirmationType).toEqual('Email');
        expect(model.beneficiary.paymentConfirmation.address).toEqual('test@testing.co.za');

        model.setBeneficiaryPaymentConfirmationConfirmationType('None');
        expect(model.beneficiary.paymentConfirmation.confirmationType).toEqual('None');
        expect(model.beneficiary.paymentConfirmation.address).toEqual(null);
    });

});
