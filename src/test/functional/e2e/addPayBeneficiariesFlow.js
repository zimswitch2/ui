'use strict';

describe('E2E - Add and pay beneficiary', function () {

    var helpers = require('../pages/helpers.js');
    var otpPage = require('../pages/otpPage.js');
    var loginPage = require('../pages/loginPage.js');
    var anyPage = require('../pages/anyPage.js');
    var landingPage = require('../pages/landingPage.js');
    var paymentPage = require('../pages/paymentPage.js');
    var addBeneficiaryPage = require('../pages/addBeneficiaryPage.js');
    var confirmBeneficiaryPage = require('../pages/confirmBeneficiaryPage.js');
    var listBeneficiaryPage = require('../pages/listBeneficiaryPage.js');
    var viewBeneficiaryDetailsPage = require('../pages/viewBeneficiaryDetailsPage.js');
    var transactionPage = require('../pages/transactionPage.js');
    var manageScheduledPaymentsPage = require('../pages/manageScheduledPaymentsPage.js');

    var beneficiariesSteps = require('./../steps/beneficiariesSteps.js');
    var paymentSteps = require('./../steps/paymentSteps.js');
    var groupSteps = require('./../steps/groupSteps.js');

    var Chance = require('../../lib/chance');
    var chance = new Chance();

    var correctOtp;
    var incorrectBeneficiaryDetails;
    var truworthsBeneficiaryDetails;
    var smsPaymentConfirmationDetails;
    var correctBeneficiaryDetailsABSA;
    var correctBeneficiaryDetails;
    var beneficiariesList = listBeneficiaryPage.getBeneficiaryList();
    var __credentialsOfLoggedInUser__;

    function cloneTestData () {
        correctOtp = _.cloneDeep(browser.params.oneTimePassword);
        truworthsBeneficiaryDetails = _.cloneDeep(browser.params.beneficiaryInformation.truworths);
        incorrectBeneficiaryDetails = _.cloneDeep(browser.params.badBeneficiaryInformation.wrongDetails);
        smsPaymentConfirmationDetails = _.cloneDeep(browser.params.smsPaymentConfirmation.successInformation);
        correctBeneficiaryDetailsABSA = _.cloneDeep(browser.params.beneficiaryInformation.absaBank);
        correctBeneficiaryDetails = _.cloneDeep(browser.params.beneficiaryInformation.sbsaBank);
        correctBeneficiaryDetails.name =  chance.word();
    }

    function parseCurrency(value) {
        return Number(value.replace(/[^0-9\.]+/g, ""));
    }

    beforeEach(function () {
        var credentials = browser.params.credentials;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        cloneTestData();
    });

    it('should not add beneficiary when account number does not exist', function () {
        beneficiariesSteps.addPrivateBeneficiary(incorrectBeneficiaryDetails);
        expect(addBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/add");
        expect(addBeneficiaryPage.baseActions.getErrorMessage()).toEqual('Please enter a valid account number');
    });

    describe('E2E - Positive Scenarios', function () {
        describe('listed beneficiaries', function () {

            afterEach(function () {
                beneficiariesSteps.deleteBeneficiary(truworthsBeneficiaryDetails.name);
            });

            it('should add and edit a listed beneficiary', function () {
                landingPage.baseActions.navigateToBeneficiaries();
                listBeneficiaryPage.clickAddBeneficiary();
                addBeneficiaryPage.enterListedBeneficiaryDetails(truworthsBeneficiaryDetails.nameForSearch, truworthsBeneficiaryDetails.initialMyReference, truworthsBeneficiaryDetails.invalidBeneficiaryReference);
                beneficiariesSteps.proceedAndSubmitOtp(correctOtp);
                expect(addBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/add");
                expect(addBeneficiaryPage.baseActions.getErrorMessage()).toEqual('Please enter a valid beneficiary reference');
                addBeneficiaryPage.cleanReferenceDetails();
                addBeneficiaryPage.enterReferenceDetails(truworthsBeneficiaryDetails.initialMyReference, truworthsBeneficiaryDetails.validBeneficiaryReference);
                beneficiariesSteps.proceedAndSubmitOtp(correctOtp);

                expect(listBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
                var beneficiariesList = listBeneficiaryPage.getBeneficiaryList();
                beneficiariesList.then(function (beneficiaries) {
                        expect(beneficiaries[0].getText()).toContain((truworthsBeneficiaryDetails.name));
                    }).then(function () {
                        helpers.scrollThenClick(listBeneficiaryPage.getEditIcon());

                        addBeneficiaryPage.cleanReferenceDetails();
                        addBeneficiaryPage.enterReferenceDetails(truworthsBeneficiaryDetails.editedMyReference, truworthsBeneficiaryDetails.validBeneficiaryReference);
                        beneficiariesSteps.proceedAndSubmitOtp(correctOtp);
                        expect(listBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
                        return listBeneficiaryPage.getBeneficiaryList();
                    }).then(function (beneficiaries) {
                        expect(beneficiaries[0].getText()).toContain((truworthsBeneficiaryDetails.name));
                        expect(beneficiaries[0].getText()).toContain((truworthsBeneficiaryDetails.editedMyReference));
                    });
            });
        });

        describe('private beneficiaries', function () {
            var topRowBeneficiaryDetails = {
                "name"                : "911 TRUCK RENTALS",
                "beneficiaryReference": "first one",
                "myReference"         : "on the list"
            };

            afterEach(function () {
                beneficiariesSteps.deleteBeneficiary(correctBeneficiaryDetails.name);
            });

            it('should display the beneficiary at the top of the list when beneficiary added successfully', function () {
                beneficiariesSteps.addListedBeneficiary(topRowBeneficiaryDetails);
                beneficiariesSteps.addPrivateBeneficiary(correctBeneficiaryDetails);
                expect(listBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
                var beneficiariesList = listBeneficiaryPage.getBeneficiaryList();
                beneficiariesList.then(function (beneficiaries) {
                    expect(beneficiaries[0].getText()).toContain((correctBeneficiaryDetails.name).toUpperCase());
                    beneficiariesSteps.deleteBeneficiary(topRowBeneficiaryDetails.name);
                });
            });

            it('should update the beneficiary list and balances once payment has been done', function () {
                var name = beneficiariesSteps.addPrivateBeneficiary(correctBeneficiaryDetails);
                paymentSteps.payBeneficiary('0.01', name);
                paymentPage.clickDone();
                listBeneficiaryPage.setFilterQuery(correctBeneficiaryDetails.name);
                expect(listBeneficiaryPage.getBeneficiaryLatestPayment().getText()).toEqual('R 0.01');
            });

            it('should search for and update the beneficiaries details', function () {
                beneficiariesSteps.addPrivateBeneficiary(correctBeneficiaryDetails);
                beneficiariesSteps.editBeneficiary(correctBeneficiaryDetails.name);
                addBeneficiaryPage.cleanBeneficiaryDetails();
                correctBeneficiaryDetailsABSA.name = correctBeneficiaryDetails.name;
                addBeneficiaryPage.enterPrivateBeneficiaryDetails(correctBeneficiaryDetailsABSA);
                beneficiariesSteps.proceedAndSubmitOtp(correctOtp);
                listBeneficiaryPage.setFilterQuery(correctBeneficiaryDetailsABSA.name);
                var beneficiariesList = listBeneficiaryPage.getBeneficiaryList();
                beneficiariesList.then(function (beneficiaries) {
                    expect(beneficiaries[0].getText()).toContain((correctBeneficiaryDetailsABSA.myReference).toUpperCase());
                });
            });

            it('should add beneficiary with confirmation payment', function () {
                beneficiariesSteps.addBeneficiaryWithConfirmationPayment(correctBeneficiaryDetails, "Email");

                expect(listBeneficiaryPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/list");
                expect(beneficiariesList.get(0).getText()).toContain((correctBeneficiaryDetails.name).toUpperCase());

                helpers.scrollThenClick(beneficiariesList.get(0));
                expect(viewBeneficiaryDetailsPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/view");
                expect(viewBeneficiaryDetailsPage.paymentConfirmationType()).toContain("ben (user@standardbank.co.za)");

                helpers.scrollThenClick(viewBeneficiaryDetailsPage.editBeneficiary());
                addBeneficiaryPage.setPaymentConfirmation("SMS", smsPaymentConfirmationDetails);

                beneficiariesSteps.proceedAndSubmitOtp(correctOtp);
                helpers.scrollThenClick(beneficiariesList.get(0));
                expect(viewBeneficiaryDetailsPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/view");
                expect(viewBeneficiaryDetailsPage.paymentConfirmationType()).toContain("ben (0782345678)");
            });

            it('should remove confirmation payment from beneficiary', function () {
                beneficiariesSteps.addBeneficiaryWithConfirmationPayment(correctBeneficiaryDetails, "Email");
                helpers.scrollThenClick(beneficiariesList.get(0));
                helpers.scrollThenClick(viewBeneficiaryDetailsPage.editBeneficiary());
                addBeneficiaryPage.cancelPaymentConfirmationMethod();
                expect(anyPage.canProceed()).toEqual(true);

                beneficiariesSteps.proceedAndSubmitOtp(correctOtp);
                helpers.scrollThenClick(beneficiariesList.get(0));
                expect(viewBeneficiaryDetailsPage.baseActions.getCurrentUrl()).toContain("/beneficiaries/view");
                expect(viewBeneficiaryDetailsPage.getBeneficiaryDetails().getText()).not.toContain("user@standardbank.co.za");
            });

            it('should select a different account to make a payment from', function () {
                beneficiariesSteps.addPrivateBeneficiary(correctBeneficiaryDetails);
                listBeneficiaryPage.clickOnPay();
                var amount = 1.00;
                paymentPage.changeFromAccount();
                var currentBalance = paymentPage.availableBalance().getInnerHtml().then(parseCurrency);
                currentBalance.then(function (balance) {
                    return balance - amount;
                }).then(function (expectedBalance) {
                    paymentPage.proceedPayment('1.00');
                    paymentPage.clickConfirm();
                    expect(paymentPage.availableBalance().getInnerHtml().then(parseCurrency)).toEqual(expectedBalance);
                    expect(paymentPage.baseActions.getVisibleSuccessMessage()).toContain("Payment was successful");
                });
            });


            it('should edit a beneficiary with group specified',function(){
                beneficiariesSteps.addPrivateBeneficiary(correctBeneficiaryDetails);
                groupSteps.addGroup('Test group');
                beneficiariesSteps.editBeneficiary(correctBeneficiaryDetails.name);
                expect(addBeneficiaryPage.group()).toEqual('-- No group --');
                addBeneficiaryPage.group('Test group');
                addBeneficiaryPage.proceed();
                expect(confirmBeneficiaryPage.getBeneficiaryDetails()).toContain("Beneficiary group\nTest group");
                groupSteps.deleteGroup('Test group');
            });

        });
    });

    describe('schedule future dated payment', function () {
        afterEach(function () {
            beneficiariesSteps.deleteBeneficiary(correctBeneficiaryDetails.name);
        });

        it('should update info on beneficiary details page', function () {
            futurePayment();
            paymentPage.proceed();
            paymentPage.clickConfirm();
            expect(paymentPage.baseActions.getVisibleSuccessMessage()).toEqual("Payment was successfully scheduled");

            paymentPage.baseActions.clickOnTab('Transact');
            transactionPage.manageFuturePayments();
            manageScheduledPaymentsPage.filterByBeneficiaryName(correctBeneficiaryDetails.name).then(function (beneficiaryNames) {
                expect(beneficiaryNames.length).toEqual(1);
                assertDeleteFuturePayment();
            });

        });
    });

    describe('schedule a repeat payment', function () {
            afterEach(function () {
                beneficiariesSteps.deleteBeneficiary(correctBeneficiaryDetails.name);
            });

            it('should update info on beneficiary details page', function () {
                futurePayment();
                paymentPage.selectRepeatPayment();
                paymentPage.selectFirstRepeatInterval();
                paymentPage.enterRepeatNumber(5);
                paymentPage.proceed();
                paymentPage.clickConfirm();
                expect(paymentPage.baseActions.getVisibleSuccessMessage()).toEqual("Payments were successfully scheduled");

                paymentPage.baseActions.clickOnTab('Transact');
                transactionPage.manageFuturePayments();
                manageScheduledPaymentsPage.filterByBeneficiaryName(correctBeneficiaryDetails.name).then(function (beneficiaryNames) {
                    expect(beneficiaryNames.length).toEqual(1);
                    assertDeleteFuturePayment();
                });

            });
        });

    function assertDeleteFuturePayment() {
        manageScheduledPaymentsPage.filter(correctBeneficiaryDetails.name);
        manageScheduledPaymentsPage.delete();
        manageScheduledPaymentsPage.confirm();
        manageScheduledPaymentsPage.filter(correctBeneficiaryDetails.name);
        expect(manageScheduledPaymentsPage.baseActions.getWarningMessage()).toBeAnyOf([
            "There are no payments scheduled.",
            "No matches found."]);
    }

    function futurePayment() {
        landingPage.baseActions.navigateToBeneficiaries();
        listBeneficiaryPage.clickAddBeneficiary();
        addBeneficiaryPage.enterPrivateBeneficiaryDetails(correctBeneficiaryDetails);
        beneficiariesSteps.proceedAndSubmitOtp(correctOtp);
        helpers.scrollThenClick(beneficiariesList.get(0));
        helpers.scrollThenClick(viewBeneficiaryDetailsPage.payBeneficiary());
        paymentPage.selectLastDate();
        paymentPage.amount('0.01');
    }
});
