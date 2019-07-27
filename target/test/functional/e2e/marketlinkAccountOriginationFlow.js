describe('E2E - marketLink Product', function () {
    'use strict';

    var loginPage = require('../pages/loginPage.js');
    var currentAccountDetailsPage = require('../pages/currentAccountDetailsPage.js');
    var availableProductsPage = require('../pages/availableProductsPage.js');
    var savingsAndInvestmentsOptionsPage = require('../pages/savingsAndInvestmentsOptionsPage.js');
    var marketLinkProductPage = require('../pages/marketLinkProductPage.js');
    var editBasicInformationPage = require('../pages/editBasicPage.js');
    var savingsTransferPage = require('../pages/savingsTransferPage.js');
    var customerInformationPage = require('../pages/customerInformationPage.js');
    var otpPage = require('../pages/otpPage.js');
    var addressPage = require('../pages/addressPage.js');
    var employmentPage = require('../pages/employmentPage.js');
    var incomeAndExpensePage = require('../pages/incomeAndExpensePage.js');
    var consentPage = require('../pages/consentPage.js');
    var transferPage = require('../pages/transferPage.js');
    var acceptOfferPage = require('../pages/acceptOfferPage.js');
    var savingsFinishPage = require('../pages/savingsFinishPage.js');
    var currentUser;
    var loginAs = function (user) {
        if (currentUser !== user) {
            currentUser = user;

             //browser.get(' https://localhost:8080/index.html#/login');
             browser.get('https://dchop170.standardbank.co.za:12345/#/login');
             loginPage.enterUserCredentials(user.username,user.password);
        }
    };

    var goToSavingsAndInvestments = function (user) {
        loginAs(user);
        loginPage.baseActions.clickOnTab('Apply for Account');
        availableProductsPage.actions.clickOnBrowseSavingsAndInvestments();
    };

    var goToAccountApplicationScreens = function (user) {
        goToSavingsAndInvestments(user);
        savingsAndInvestmentsOptionsPage.actions.marketLinkAccountApplyNow();
        marketLinkProductPage.actions.fraudCheckConsentCheckBoxClick();
        marketLinkProductPage.actions.fraudCheckConsentFormNextClick();
        browser.getLocationAbsUrl().then(function (url) {
            if (url.indexOf('/apply/market-link/transfer') < 0) {
                customerInformationPage.actions.goToConsentPage();
                consentPage.actions.submit();
            }
        });
    };

    describe('Scenario:1 - Not-KYC customer that CANNOT apply for marketLink Clicks on apply button for marketLink', function () {
        it('Should refer the customer to a branch', function () {
            goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.notKYC);
            savingsAndInvestmentsOptionsPage.actions.marketLinkAccountApplyNow();
            expect(savingsAndInvestmentsOptionsPage.getKycNonCompliantMessageModal("market-link").isDisplayed()).toBeTruthy();
            savingsAndInvestmentsOptionsPage.actions.kycNonCompliantMessageModalClose();
            expect(savingsAndInvestmentsOptionsPage.getKycNonCompliantMessageModal("market-link").isDisplayed()).toBeFalsy();
            savingsAndInvestmentsOptionsPage.actions.marketLinkDetails();
            marketLinkProductPage.actions.apply();
            expect(marketLinkProductPage.getKycNonCompliantMessageModal("market-link").isDisplayed()).toBeTruthy();
            marketLinkProductPage.actions.kycNonCompliantMessageModalClose();
            expect(marketLinkProductPage.getKycNonCompliantMessageModal("market-link").isDisplayed()).toBeFalsy();

        });
    });

    describe('Scenario:2 - AML Complaint customer with SA-ID that can apply for marketlink Clicks on apply button and get successful applcation submission through saving and investment page', function () {
        it('Application should get success for normal customer (i.e) Without AML complaint custome through Saving and investment screen flow.', function () {
            goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.amlComplaintWithSaID);
            savingsAndInvestmentsOptionsPage.actions.marketLinkAccountApplyNow();
            expect(marketLinkProductPage.getFraudCheckModal().isDisplayed()).toBeTruthy();
            expect(marketLinkProductPage.getFraudCheckModalNextButton().isEnabled()).toBeFalsy();
            marketLinkProductPage.actions.fraudCheckConsentCheckBoxClick();
            expect(marketLinkProductPage.getFraudCheckModalNextButton().isEnabled()).toBeTruthy();
            marketLinkProductPage.actions.fraudCheckConsentFormNextClick();
            expect(currentAccountDetailsPage.baseActions.flow.numberOfSteps()).toEqual(4);
            expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Transfer');
            currentAccountDetailsPage.baseActions.flow.steps().then(function (flowSteps) {
            expect(flowSteps[1].getText()).toEqual('Transfer'); });
            expect(transferPage.getMarketLinkAccountDetails().getText()).toBe("MarketLink Account Details");
            expect(transferPage.getAmountDefaultValue()).toBe("5000");
            transferPage.Amount('6000');
            transferPage.proceed();
            acceptOfferPage.clickCheckBox();
            acceptOfferPage.proceed();
            expect(savingsFinishPage.getApplicationSuccessPage().getText()).toBe("Your application was successful");
            expect(savingsFinishPage.getSummary().getText()).toBe("Summary");
            expect(savingsFinishPage.getAccountTypeLabel().getText()).toBe("Account type");
            expect(savingsFinishPage.getAccountType().getText()).toBe("MarketLink");
            expect(savingsFinishPage.getAccountNoLabel().getText()).toBe("Account number");
            expect(savingsFinishPage.getDateLabel().getText()).toBe("Date");
            expect(savingsFinishPage.getDateValue().getText()).toBe("14 September 2015");
            expect(savingsFinishPage.getTimeLabel().getText()).toBe("Time");
            expect(savingsFinishPage.Timevalue().getText()).toBe("12:49:51");
        });
    });


    describe('Scenario:3 - AML Complaint customer with Non SA-ID with passport that can apply for marketLink Clicks on apply button and get successful applcation submission through saving and investment page', function () {
        it('Application should get success for normal customer (i.e) Without AML complaint custome through Saving and investment screen flow.', function () {
            goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.amlComplaintWithNonSaIDWithPassport);
            savingsAndInvestmentsOptionsPage.actions.marketLinkAccountApplyNow();
            expect(marketLinkProductPage.getFraudCheckModal().isDisplayed()).toBeTruthy();
            expect(marketLinkProductPage.getFraudCheckModalNextButton().isEnabled()).toBeFalsy();
            marketLinkProductPage.actions.fraudCheckConsentCheckBoxClick();
            expect(marketLinkProductPage.getFraudCheckModalNextButton().isEnabled()).toBeTruthy();
            marketLinkProductPage.actions.fraudCheckConsentFormNextClick();
            expect(currentAccountDetailsPage.baseActions.flow.numberOfSteps()).toEqual(4);
            expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Transfer');
            currentAccountDetailsPage.baseActions.flow.steps().then(function (flowSteps) {
            expect(flowSteps[1].getText()).toEqual('Transfer'); });
            expect(transferPage.getMarketLinkAccountDetails().getText()).toBe("MarketLink Account Details");
            expect(transferPage.getAmountDefaultValue()).toBe("5000");
            expect(transferPage.getAvailableBalanceText().getText()).toContain("Available Balance");
            goToAccountApplicationScreens(browser.params.credentials);
            transferPage.Amount('6000');
            transferPage.proceed();
            acceptOfferPage.clickCheckBox();
            acceptOfferPage.proceed();
            expect(savingsFinishPage.getApplicationSuccessPage().getText()).toBe("Your application was successful");
            expect(savingsFinishPage.getSummary().getText()).toBe("Summary");
            expect(savingsFinishPage.getAccountTypeLabel().getText()).toBe("Account type");
            expect(savingsFinishPage.getAccountType().getText()).toBe("MarketLink");
            expect(savingsFinishPage.getAccountNoLabel().getText()).toBe("Account number");
            expect(savingsFinishPage.getDateLabel().getText()).toBe("Date");
            expect(savingsFinishPage.getDateValue().getText()).toBe("14 September 2015");
            expect(savingsFinishPage.getTimeLabel().getText()).toBe("Time");
            expect(savingsFinishPage.Timevalue().getText()).toBe("12:49:51");
        });
    });


     describe('Scenario:4 - AML Incomplete Country Of Birth customer with SA-ID that can apply for MarketLink account by updaing thed country of birht', function () {
        it('Should display the basic details page with all required fields uneditable except for Country of Birth which is editable and allow the user to save the country of birth field', function () {
           goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.amlIncompleteCountryOfBirth);
            savingsAndInvestmentsOptionsPage.actions.marketLinkAccountApplyNow();
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
            editBasicInformationPage.actions.confirmAppBasicInformation();
            expect(savingsAndInvestmentsOptionsPage.getMarketLinkProductContainerHeader()).toEqual('MarketLink');
            expect(savingsAndInvestmentsOptionsPage.getMarketLinkProductContainerMessage()).toEqual('An investment account with the flexibility of a current account');
        });
    });


    describe('Scenario:5 User is NOT a SA Citizen but has SA ID and Nationality, Country of Birth and Country of Citizenship are not Populated, Applies for MarketLink account and Consents to fraud check', function () {
        it('Should display the basic details page with all required fields uneditable except for Country of Birth which is editable and clicking cancel from back info page', function () {
                goToSavingsAndInvestments(browser.params.sapproductAccountOrigination.amlIncompleteNonSACitizen);
                savingsAndInvestmentsOptionsPage.actions.marketLinkAccountApplyNow();
                savingsAndInvestmentsOptionsPage.actions.fraudCheckConsentCheckBoxClick();
                savingsAndInvestmentsOptionsPage.actions.fraudCheckConsentFormNextClick();
                expect(editBasicInformationPage.infoNotification().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.infoNotification().getText()).toBe("Please enter all the additional required information to complete your profile");
                expect(editBasicInformationPage.titleElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.titleElement().getText()).toBe("Mr");
                expect(editBasicInformationPage.surnameElement().isDisplayed()).toBeTruthy();
               // expect(editBasicInformationPage.surnameElement().getText()).toBe("Devtwo");
                expect(editBasicInformationPage.firstNamesElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.firstNamesElement().getText()).toBe("Testing");
                expect(editBasicInformationPage.initialsElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.initialsElement().getText()).toBe("T");
                expect(editBasicInformationPage.genderElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.genderElement().getText()).toBe("Male");
                expect(editBasicInformationPage.idNumberElement().isDisplayed()).toBeTruthy();
                //expect(editBasicInformationPage.idNumberElement().getText()).toBe("*********6182");
                expect(editBasicInformationPage.dateOfBirthElement().isDisplayed()).toBeTruthy();
               //expect(editBasicInformationPage.dateOfBirthElement().getText()).toBe("23 September 1976");
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
                editBasicInformationPage.actions.selectItemInTypeAhead("Nationality *", "South Africa");
                expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                editBasicInformationPage.actions.selectItemInTypeAhead("Country of birth *", "South Africa");
                expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                editBasicInformationPage.actions.selectItemInTypeAhead("Country of citizenship *", "South Africa");
                expect(editBasicInformationPage.save().isEnabled()).toBeTruthy();
                editBasicInformationPage.actions.cancelBasicInformation();
                editBasicInformationPage.actions.confirmBasicInformation();
                editBasicInformationPage.actions.confirmAppBasicInformation();
                expect(savingsAndInvestmentsOptionsPage.getMarketLinkProductContainerHeader()).toEqual('MarketLink');
                expect(savingsAndInvestmentsOptionsPage.getMarketLinkProductContainerMessage()).toEqual('An investment account with the flexibility of a current account');
        });
    });
});
