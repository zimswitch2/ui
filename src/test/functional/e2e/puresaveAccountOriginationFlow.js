describe('E2E - pureSave Product', function () {
    'use strict';

    var loginPage = require('../pages/loginPage.js');
    var currentAccountDetailsPage = require('../pages/currentAccountDetailsPage.js');
    var availableProductsPage = require('../pages/availableProductsPage.js');
    var savingsAndInvestmentsOptionsPage = require('../pages/savingsAndInvestmentsOptionsPage.js');
    var pureSaveProductPage = require('../pages/pureSaveProductPage.js');
    var editBasicInformationPage = require('../pages/editBasicPage.js');
    var customerInformationPage = require('../pages/customerInformationPage.js');
    var otpPage = require('../pages/otpPage.js');
    var addressPage = require('../pages/addressPage.js');
    var employmentPage = require('../pages/employmentPage.js');
    var consentPage = require('../pages/consentPage.js');
    var transferPage = require('../pages/transferPage.js');
    var acceptOfferPage = require('../pages/acceptOfferPage.js');
    var savingsFinishPage = require('../pages/savingsFinishPage.js');

    var currentUser;
    var loginAs = function (user) {
        if (currentUser !== user) {
            currentUser = user;
            loginPage.loginWith(currentUser);
        }
    };

    var goToSavingsAndInvestments = function (user) {
        loginAs(user);
        loginPage.baseActions.clickOnTab('Apply for Account');
        availableProductsPage.actions.clickOnBrowseSavingsAndInvestments();
    };

    var goToAccountApplicationScreens = function (user) {
        goToSavingsAndInvestments(user);
        savingsAndInvestmentsOptionsPage.actions.pureSaveAccountApplyNow();
        pureSaveProductPage.actions.fraudCheckConsentCheckBoxClick();
        pureSaveProductPage.actions.fraudCheckConsentFormNextClick();
        browser.getLocationAbsUrl().then(function (url) {
            if (url.indexOf('/apply/pure-save/transfer') < 0) {
                customerInformationPage.actions.goToConsentPage();
                consentPage.actions.submit();
            }
        });
    };

    describe('Scenario:1 - Not-KYC customer that CANNOT apply for pureSave Clicks on apply button for pureSave', function () {
        it('Should refer the customer to a branch', function () {
            goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.notKYC);
            savingsAndInvestmentsOptionsPage.actions.pureSaveAccountApplyNow();
            expect(savingsAndInvestmentsOptionsPage.getKycNonCompliantMessageModal("pure-save").isDisplayed()).toBeTruthy();
            savingsAndInvestmentsOptionsPage.actions.kycNonCompliantMessageModalClose();
            expect(savingsAndInvestmentsOptionsPage.getKycNonCompliantMessageModal("pure-save").isDisplayed()).toBeFalsy();
            savingsAndInvestmentsOptionsPage.actions.pureSaveDetails();
            pureSaveProductPage.actions.apply();
            expect(pureSaveProductPage.getKycNonCompliantMessageModal("pure-save").isDisplayed()).toBeTruthy();
            pureSaveProductPage.actions.kycNonCompliantMessageModalClose();
            expect(pureSaveProductPage.getKycNonCompliantMessageModal("pure-save").isDisplayed()).toBeFalsy();
        });
    });

    describe('Scenario:2 - AML Complaint customer with SA-ID that can apply for pureSave Clicks on apply button and get successful applcation submission through saving and investment page', function () {
        it('Application should get success for normal customer (i.e) Without AML complaint custome through Saving and investment screen flow.', function () {
            goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.amlComplaintWithSaID);
            savingsAndInvestmentsOptionsPage.actions.pureSaveAccountApplyNow();
            expect(pureSaveProductPage.getFraudCheckModal().isDisplayed()).toBeTruthy();
            expect(pureSaveProductPage.getFraudCheckModalNextButton().isEnabled()).toBeFalsy();
            pureSaveProductPage.actions.fraudCheckConsentCheckBoxClick();
            expect(pureSaveProductPage.getFraudCheckModalNextButton().isEnabled()).toBeTruthy();
            pureSaveProductPage.actions.fraudCheckConsentFormNextClick();
            expect(currentAccountDetailsPage.baseActions.flow.numberOfSteps()).toEqual(4);
            expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Transfer');
            currentAccountDetailsPage.baseActions.flow.steps().then(function (flowSteps) {
                expect(flowSteps[1].getText()).toEqual('Transfer');
                expect(transferPage.getPureSaveAccountDetails().getText()).toBe("PureSave Account Details");
                expect(transferPage.getAmountDefaultValue()).toBe("50");
                transferPage.FromAccountdata('ELITE PLUS - 03-264-328-4');
                expect(transferPage.getRandAmount().getText()).toBe("R 9 922.50");
                expect(transferPage.getAvailableBalanceText().getText()).toContain("Available Balance");
                goToAccountApplicationScreens(browser.params.credentials);
                transferPage.Amount('60');
                transferPage.proceed();
                acceptOfferPage.clickCheckBox();
                acceptOfferPage.proceed();
                expect(savingsFinishPage.getApplicationSuccessPage().getText()).toBe("Your application was successful");
                expect(savingsFinishPage.getSummary().getText()).toBe("Summary");
                expect(savingsFinishPage.getAccountTypeLabel().getText()).toBe("Account type");
                expect(savingsFinishPage.getAccountType().getText()).toBe("PureSave");
                expect(savingsFinishPage.getAccountNoLabel().getText()).toBe("Account number");
                expect(savingsFinishPage.getAccountNo().getText()).toBe("03-264-328-4");
                expect(savingsFinishPage.getDateLabel().getText()).toBe("Date");
                expect(savingsFinishPage.getDateValue().getText()).toBe("14 September 2015");
                expect(savingsFinishPage.getTimeLabel().getText()).toBe("Time");
                expect(savingsFinishPage.Timevalue().getText()).toBe("12:49:51");
            });
        });

        describe('Scenario:3 - AML Complaint customer with Non SA-ID with passport that can apply for pureSave Clicks on apply button and get successful applcation submission through saving and investment page', function () {
            it('Application should get success for normal customer (i.e) Without AML complaint custome through Saving and investment screen flow.', function () {
                goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.amlComplaintWithNonSaIDWithPassport);
                savingsAndInvestmentsOptionsPage.actions.pureSaveAccountApplyNow();
                expect(pureSaveProductPage.getFraudCheckModal().isDisplayed()).toBeTruthy();
                expect(pureSaveProductPage.getFraudCheckModalNextButton().isEnabled()).toBeFalsy();
                pureSaveProductPage.actions.fraudCheckConsentCheckBoxClick();
                expect(pureSaveProductPage.getFraudCheckModalNextButton().isEnabled()).toBeTruthy();
                pureSaveProductPage.actions.fraudCheckConsentFormNextClick();
                expect(currentAccountDetailsPage.baseActions.flow.numberOfSteps()).toEqual(4);
                expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Transfer');
                currentAccountDetailsPage.baseActions.flow.steps().then(function (flowSteps) {
                    expect(flowSteps[1].getText()).toEqual('Transfer');
                    expect(transferPage.getPureSaveAccountDetails().getText()).toBe("PureSave Account Details");
                    expect(transferPage.getAmountDefaultValue()).toBe("50");
                    transferPage.FromAccountdata('ELITE PLUS - 03-264-328-4');
                    expect(transferPage.getRandAmount().getText()).toBe("R 9 922.50");
                    expect(transferPage.getAvailableBalanceText().getText()).toContain("Available Balance");
                    goToAccountApplicationScreens(browser.params.credentials);
                    transferPage.Amount('60');
                    transferPage.proceed();
                    acceptOfferPage.clickCheckBox();
                    acceptOfferPage.proceed();
                    expect(savingsFinishPage.getApplicationSuccessPage().getText()).toBe("Your application was successful");
                    expect(savingsFinishPage.getSummary().getText()).toBe("Summary");
                    expect(savingsFinishPage.getAccountTypeLabel().getText()).toBe("Account type");
                    expect(savingsFinishPage.getAccountType().getText()).toBe("PureSave");
                    expect(savingsFinishPage.getAccountNoLabel().getText()).toBe("Account number");
                    expect(savingsFinishPage.getAccountNo().getText()).toBe("03-264-328-4");
                    expect(savingsFinishPage.getDateLabel().getText()).toBe("Date");
                    expect(savingsFinishPage.getDateValue().getText()).toBe("14 September 2015");
                    expect(savingsFinishPage.getTimeLabel().getText()).toBe("Time");
                    expect(savingsFinishPage.Timevalue().getText()).toBe("12:49:51");
                });
            });


            describe('Scenario:4 - AML Incomplete Country Of Birth customer with SA-ID that can apply for pureSave account by updaing thed country of birht', function () {
                it('Should display the basic details page with all required fields uneditable except for Country of Birth which is editable and allow the user to save the country of birth field', function () {
                    goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.amlIncompleteCountryOfBirth);
                    savingsAndInvestmentsOptionsPage.actions.pureSaveAccountApplyNow();
                    savingsAndInvestmentsOptionsPage.actions.fraudCheckConsentCheckBoxClick();
                    savingsAndInvestmentsOptionsPage.actions.fraudCheckConsentFormNextClick();
                    expect(editBasicInformationPage.infoNotification().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.infoNotification().getText()).toBe("Please enter all the additional required information to complete your profile");
                    expect(editBasicInformationPage.titleElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.titleElement().getText()).toBe("Mr");
                    expect(editBasicInformationPage.surnameElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.surnameElement().getText()).toBe("Devtwo");
                    expect(editBasicInformationPage.firstNamesElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.firstNamesElement().getText()).toBe("Testing");
                    expect(editBasicInformationPage.initialsElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.initialsElement().getText()).toBe("T");
                    expect(editBasicInformationPage.genderElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.genderElement().getText()).toBe("Male");
                    expect(editBasicInformationPage.idNumberElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.idNumberElement().getText()).toBe("*********6082");
                    expect(editBasicInformationPage.dateOfBirthElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.dateOfBirthElement().getText()).toBe("23 September 1976");
                    expect(editBasicInformationPage.countryOfBirthInput().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.maritalStatusElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.maritalStatusElement().getText()).toBe("Single");
                    expect(editBasicInformationPage.yourBranchElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.yourBranchElement().getText()).toBe("Ballito");
                    expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                    expect(editBasicInformationPage.cancel().isEnabled()).toBeTruthy();
                    editBasicInformationPage.actions.selectItemInTypeAhead("Country of birth *", "South Africa");
                    expect(editBasicInformationPage.save().isEnabled()).toBeTruthy();
                    editBasicInformationPage.actions.cancelBasicInformation();
                    editBasicInformationPage.actions.confirmBasicInformation();
                    expect(savingsAndInvestmentsOptionsPage.getPureSaveProductContainerHeader()).toEqual('PureSave');
                    expect(savingsAndInvestmentsOptionsPage.getPureSaveProductContainerMessage()).toEqual('Simple savings with instant access to your money');
                });
            });


            describe('Scenario:5 User is NOT a SA Citizen but has SA ID and Nationality, Country of Birth and Country of Citizenship are not Populated, Applies for PureSave account and Consents to fraud check', function () {
                it('Should display the basic details page with all required fields uneditable except for Country of Birth which is editable and clicking cancel from back info page', function () {
                    goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.amlIncompleteNonSACitizen);
                    savingsAndInvestmentsOptionsPage.actions.pureSaveAccountApplyNow();
                    savingsAndInvestmentsOptionsPage.actions.fraudCheckConsentCheckBoxClick();
                    savingsAndInvestmentsOptionsPage.actions.fraudCheckConsentFormNextClick();
                    expect(editBasicInformationPage.infoNotification().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.infoNotification().getText()).toBe("Please enter all the additional required information to complete your profile");
                    expect(editBasicInformationPage.titleElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.titleElement().getText()).toBe("Mr");
                    expect(editBasicInformationPage.surnameElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.surnameElement().getText()).toBe("Devtwo");
                    expect(editBasicInformationPage.firstNamesElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.firstNamesElement().getText()).toBe("Testing");
                    expect(editBasicInformationPage.initialsElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.initialsElement().getText()).toBe("T");
                    expect(editBasicInformationPage.genderElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.genderElement().getText()).toBe("Male");
                    expect(editBasicInformationPage.idNumberElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.idNumberElement().getText()).toBe("*********6182");
                    expect(editBasicInformationPage.dateOfBirthElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.dateOfBirthElement().getText()).toBe("23 September 1976");
                    expect(editBasicInformationPage.nationalityInput().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.nationalityInput().getAttribute('value')).toBe("");
                    expect(editBasicInformationPage.countryOfBirthInput().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.countryOfBirthInput().getAttribute('value')).toBe("");
                    expect(editBasicInformationPage.countryOfCitizenshipInput().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.countryOfCitizenshipInput().getAttribute('value')).toBe("");
                    expect(editBasicInformationPage.maritalStatusElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.maritalStatusElement().getText()).toBe("Single");
                    expect(editBasicInformationPage.yourBranchElement().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.yourBranchElement().getText()).toBe("Ballito");
                    expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                    expect(editBasicInformationPage.cancel().isEnabled()).toBeTruthy();
                    editBasicInformationPage.actions.selectItemInTypeAhead("Country of birth *", "South Africa");
                    expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                    editBasicInformationPage.actions.selectItemInTypeAhead("Country of citizenship *", "South Africa");
                    expect(editBasicInformationPage.save().isEnabled()).toBeTruthy();
                    editBasicInformationPage.actions.cancelBasicInformation();
                    editBasicInformationPage.actions.confirmBasicInformation();
                    expect(savingsAndInvestmentsOptionsPage.getPureSaveProductContainerHeader()).toEqual('PureSave');
                    expect(savingsAndInvestmentsOptionsPage.getPureSaveProductContainerMessage()).toEqual('Simple savings with instant access to your money');
                });
            });

            describe('proceed to Account details screen validations', function () {
                it('should display the Pure save account details screen and should throw the notificaion based on the negative inputs and the balance notifications', function () {
                    goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.amlComplaintWithNonSaIDWithPassport);
                    savingsAndInvestmentsOptionsPage.actions.pureSaveAccountApplyNow();
                    expect(savingsAndInvestmentsOptionsPage.getFraudCheckModal().isDisplayed()).toBeTruthy();
                    expect(savingsAndInvestmentsOptionsPage.getFraudCheckModalNextButton().isEnabled()).toBeFalsy();
                    savingsAndInvestmentsOptionsPage.actions.fraudCheckConsentCheckBoxClick();
                    expect(savingsAndInvestmentsOptionsPage.getFraudCheckModalNextButton().isEnabled()).toBeTruthy();
                    savingsAndInvestmentsOptionsPage.actions.fraudCheckConsentFormNextClick();
                    expect(currentAccountDetailsPage.baseActions.getCurrentUrl()).toContain('/apply/pure-save/transfer');
                    expect(currentAccountDetailsPage.baseActions.flow.numberOfSteps()).toEqual(4);
                    expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Transfer');
                    currentAccountDetailsPage.baseActions.flow.steps().then(function (flowSteps) {
                        expect(flowSteps[1].getText()).toEqual('Transfer');
                    });
                    expect(transferPage.getPureSaveAccountDetails().getText()).toBe("PureSave Account Details");
                    expect(transferPage.getAmountDefaultValue()).toBe("50");
                    transferPage.FromAccountdata('ACCESSACC - 10-00-530-418-2');
                    transferPage.Amount('50');
                    expect(transferPage.getAmountExceedsErrorMessage().getText()).toContain("The amount exceeds your available balance");
                    transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                    transferPage.Amount('12');
                    expect(transferPage.getEnterAnAmountAtleastMessage().getText()).toContain("Enter an amount of at least R50");
                    transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                    transferPage.Amount('00');
                    expect(transferPage.getEnterAnAmountGreaterthenzerp().getText()).toContain("Please enter an amount greater than zero");
                    expect(transferPage.getMinimumOpeningBalance().getText()).toContain("Minimum opening balance: R 50.00");
                    transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                    expect(transferPage.getRandAmount().getText()).toBe("R 8 756.41");
                    expect(transferPage.getAvailableBalanceText().getText()).toContain("Available Balance");
                    transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                    expect(transferPage.getRandAmount().getText()).toBe("R 8 756.41");
                    transferPage.FromAccountdata('ACCESSACC - 10-00-530-418-2');
                    expect(transferPage.getRandAmount().getText()).toBe("- R 23.98");
                    transferPage.FromAccountdata('CREDIT CARD - 5592-0070-1204-1578');
                    expect(transferPage.getRandAmount().getText()).toBe("R 99 919 239.00");
                    expect(transferPage.getPureSaveAccountDetails().getText()).toBe("PureSave Account Details");
                    expect(transferPage.getAmountDefaultValue()).toBe("50");
                    transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                    transferPage.Amount('50.256');
                    expect(transferPage.getAmountExceedsErrorMessage().getText()).toContain("Please enter the amount in a valid format");
                    transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                    transferPage.Amount('50');
                    transferPage.cancel();
                    expect(savingsAndInvestmentsOptionsPage.getSavingInvestmentTitle().getText()).toEqual('Savings and Investments');
                });
            });
        });
    });
});