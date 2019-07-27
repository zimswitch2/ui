var addBasicInformationAMLFeature = false;

{
    addBasicInformationAMLFeature = true;
}

describe('ACCEPTANCE - marketLinkFeature Product', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var currentAccountDetailsPage = require('../../pages/currentAccountDetailsPage.js');
    var availableProductsPage = require('../../pages/availableProductsPage.js');
    var savingsAndInvestmentsOptionsPage = require('../../pages/savingsAndInvestmentsOptionsPage.js');
    var editBasicInformationPage = require('../../pages/editBasicPage.js');
    var savingsTransferPage = require('../../pages/savingsTransferPage.js');
    var customerInformationPage = require('../../pages/customerInformationPage.js');
    var otpPage = require('../../pages/otpPage.js');
    var addressPage = require('../../pages/addressPage.js');
    var employmentPage = require('../../pages/employmentPage.js');
    var incomeAndExpensePage = require('../../pages/incomeAndExpensePage.js');
    var consentPage = require('../../pages/consentPage.js');
    var transferPage = require('../../pages/transferPage.js');
    var acceptOfferPage = require('../../pages/acceptOfferPage.js');
    var savingsFinishPage = require('../../pages/savingsFinishPage.js');
    var marketLinkProductPage = require('../../pages/marketLinkProductPage.js');
    var editIncomeAndExpensePage = require('../../pages/editIncomeExpensesPage.js');
    var savingsPrescreeningWidget = require('../../pages/common/savingsPrescreeningWidget.js');

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
        savingsPrescreeningWidget.actions.apply("market-link");
        savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
        savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");
        browser.getLocationAbsUrl().then(function (url) {
            if (url.indexOf('/apply/market-link/transfer') < 0) {
                customerInformationPage.actions.goToConsentPage();
                consentPage.actions.submit();
            }
        });
    };

    describe('When a customer that can apply for MarketLink', function () {
        describe('PW-14271: Scenario 1, 2 and 3: User has all AML fields populated', function () {
            it('Should display the MarketLink product tile', function () {
                goToSavingsAndInvestments(browser.params.credentials);
                expect(savingsPrescreeningWidget.getFraudCheckModal('market-link').isDisplayed()).toBeFalsy();
                expect(savingsAndInvestmentsOptionsPage.getMarketLinkProductContainerHeader()).toEqual('MarketLink');
                expect(savingsAndInvestmentsOptionsPage.getMarketLinkProductContainerMessage()).toEqual('An investment account with the flexibility of a current account');
            });

            describe('PW 14272: Then clicks on Details button in the MarketLink Product Tile', function () {
                it('Should show the MarketLink product page', function () {
                    savingsAndInvestmentsOptionsPage.actions.marketLinkDetails();
                    expect(marketLinkProductPage.getTitle()).toEqual('Apply for Savings Account');
                    expect(marketLinkProductPage.baseActions.getCurrentUrl()).toContain('/apply/market-link');
                    expect(marketLinkProductPage.getProductTitle()).toContain('MarketLink');
                    expect(marketLinkProductPage.getMarketLinkProductDescription()).toEqual('With MarketLink you gain the flexibility of a current account in addition to competitive interest rates.');
                    expect(marketLinkProductPage.getContentHeaders()).toContain('Highlights');
                    expect(marketLinkProductPage.getContentHeaders()).toContain('How to qualify');
                    expect(marketLinkProductPage.getContentHeadersPanelTwo()).toContain('What it costs');
                    expect(marketLinkProductPage.getContentHeadersPanelTwo()).toContain('What you\'ll need');
                    expect(marketLinkProductPage.getPricingGuide()).toEqual('MarketLink pricing (PDF)');
                    expect(savingsPrescreeningWidget.applyButtonVisible("market-link").isDisplayed()).toBeTruthy();
                    expect(marketLinkProductPage.backtoSavingInvestment().isDisplayed()).toBeTruthy();
                });

                describe('Then clicks on the apply button', function () {
                    it('should display the fraud check consent form', function () {
                        savingsPrescreeningWidget.actions.apply("market-link");
                        expect(savingsPrescreeningWidget.getFraudCheckModal("market-link").isDisplayed()).toBeTruthy();
                        expect(savingsPrescreeningWidget.getFraudCheckModalNextButton("market-link").isEnabled()).toBeFalsy();
                    });

                    describe('Then clicks on fraud check consent checkbox', function () {
                        it('should enable the next button', function () {
                            savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
                            expect(savingsPrescreeningWidget.getFraudCheckModalNextButton("market-link").isEnabled()).toBeTruthy();
                        });

                        describe('Then clicks on next button', function () {
                            it('Should create the MarketLink flow and direct the user to the account application transfer page', function () {
                                savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");
                                expect(marketLinkProductPage.baseActions.getCurrentUrl()).toContain('/apply/market-link/transfer');
                                expect(currentAccountDetailsPage.baseActions.flow.numberOfSteps()).toEqual(4);
                                expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Transfer');
                                currentAccountDetailsPage.baseActions.flow.steps().then(function (flowSteps) {
                                    expect(flowSteps[1].getText()).toEqual('Transfer');
                                });
                            });
                        });
                    });

                    describe('Then clicks on cancel button', function () {
                        it('should close the fraud check consent form and show popup asking customer to agree to fraud check', function () {
                            goToSavingsAndInvestments(browser.params.credentials);
                            savingsPrescreeningWidget.actions.apply("market-link");
                            savingsPrescreeningWidget.actions.fraudCheckConsentFormCancelClick("market-link");
                            expect(savingsPrescreeningWidget.getFraudCheckModal("market-link").isDisplayed()).toBeFalsy();
                        });
                    });
                });
            });

            describe('Then Clicks on apply button for MarketLink in the product tile', function () {
                it('should display the fraud check consent form', function () {
                    goToSavingsAndInvestments(browser.params.credentials);
                    savingsPrescreeningWidget.actions.apply("market-link");
                    expect(savingsPrescreeningWidget.getFraudCheckModal("market-link").isDisplayed()).toBeTruthy();
                    expect(savingsPrescreeningWidget.getFraudCheckModalNextButton("market-link").isEnabled()).toBeFalsy();
                });

                describe('Then clicks on fraud check consent checkbox', function () {
                    it('should enable the next button', function () {
                        savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
                        expect(savingsPrescreeningWidget.getFraudCheckModalNextButton("market-link").isEnabled()).toBeTruthy();
                    });

                    describe('Then clicks on next button', function () {
                        it('Should create the MarketLink flow and direct the user to the account application transfer page', function () {
                            savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");
                            expect(currentAccountDetailsPage.baseActions.getCurrentUrl()).toContain('/apply/market-link/transfer');
                            expect(currentAccountDetailsPage.baseActions.flow.numberOfSteps()).toEqual(4);
                            expect(currentAccountDetailsPage.baseActions.flow.currentStep()).toEqual('Transfer');
                            currentAccountDetailsPage.baseActions.flow.steps().then(function (flowSteps) {
                                expect(flowSteps[1].getText()).toEqual('Transfer');
                            });
                        });

                        describe('PW-14295: proceed to Account details screen validations', function () {
                            it('should display the MarketLink account details screen and should through the amount exceeds error for low balance account', function () {
                                expect(transferPage.getMarketLinkAccountDetails().getText()).toBe("MarketLink Account Details");
                                expect(transferPage.getAmountDefaultValue()).toBe("5000");
                                transferPage.FromAccountdata('ACCESSACC - 10-00-530-418-2');
                                transferPage.Amount('5000');
                                expect(transferPage.getAmountExceedsErrorMessage().getText()).toContain("The amount exceeds your available balance");
                            });

                            it('should display the MarketLink account details screen and should through the minimum amount message for less 5000 rands', function () {
                                transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                transferPage.Amount('12');
                                expect(transferPage.getEnterAnAmountAtleastMessage().getText()).toContain("Enter an amount of at least R5000");
                            });

                            it('should display the Market Link account details screen and should through the erro "Please enter the amount in a valid format" for the .3 digit cents', function () {
                                expect(transferPage.getMarketLinkAccountDetails().getText()).toBe("MarketLink Account Details");
                                transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                transferPage.Amount('50.256');
                                expect(transferPage.getAmountExceedsErrorMessage().getText()).toContain("Please enter the amount in a valid format");
                            });

                            it('should display the MarketLink account details screen and should highlite the message Please enter an amount greater than zero for 0 Rands', function () {
                                transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                transferPage.Amount('00');
                                expect(transferPage.getEnterAnAmountGreaterthenzerp().getText()).toContain("Please enter an amount greater than zero");
                            });

                            it('should display the minimum opening balance message as Minimum opening balance: R 50.00 in MarketLink account details screen', function () {
                                transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                expect(transferPage.getMinimumOpeningBalance().getText()).toContain("Minimum opening balance: R 5 000.00");
                            });

                            it('should display the Available balance text and available rand amount in the MarketLink account details screen based on the account selected', function () {
                                transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                expect(transferPage.getRandAmount().getText()).toBe("R 8 756.41");
                                expect(transferPage.getAvailableBalanceText().getText()).toContain("Available Balance");
                            });

                            it('should display the available balance based on the account selection in MarketLink account details', function () {
                                transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                expect(transferPage.getRandAmount().getText()).toBe("R 8 756.41");
                                transferPage.FromAccountdata('ACCESSACC - 10-00-530-418-2');
                                expect(transferPage.getRandAmount().getText()).toBe("- R 23.98");
                                transferPage.FromAccountdata('CREDIT CARD - 5592-0070-1204-1578');
                                expect(transferPage.getRandAmount().getText()).toBe("R 99 919 239.00");
                            });

                            it('should display the saving and investments screen once we click cancel button Marletlink account details screen', function () {
                                transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                transferPage.Amount('50');
                                transferPage.cancel();
                                expect(savingsAndInvestmentsOptionsPage.getSavingInvestmentTitle().getText()).toEqual('Savings and Investments');
                            });

                            describe('PW-14295: proceed to Accept offer screen  validations', function () {
                                it('should display the Terms and condition check box  as unchecked in accept offer screen', function () {
                                    goToAccountApplicationScreens(browser.params.credentials);
                                    transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                    transferPage.Amount('6000');
                                    transferPage.proceed();
                                    expect(transferPage.getConfirmpageheading().getText()).toBe("Confirm");
                                    expect(acceptOfferPage.getAcceptTermsAndConditionsCheckbox()).toBeFalsy();
                                });

                                it('should display the confirm button once the Terms and condition check box  checked in', function () {
                                    acceptOfferPage.clickCheckBox();
                                    expect(acceptOfferPage.confirmButtonEnabled).toBeTruthy();
                                });

                                it('should display Your market link account title and the transfer opening account and amount which is selected', function () {
                                    expect(transferPage.getPureSaveTitleTransfer().getText()).toBe("Your MarketLink Account");
                                    expect(acceptOfferPage.getOpeningAccountLabel().getText()).toBe("Transfer opening amount from");
                                    expect(acceptOfferPage.getOpeningAccountNo().getText()).toBe("ACCESSACC - 10-00-035-814-0");
                                    expect(acceptOfferPage.getAmountLabel().getText()).toBe("Amount");
                                    expect(acceptOfferPage.getSelectedAmount().getText()).toBe("R 6 000.00");
                                });

                                it('should display Banking Solutions for You screen after clicking the cancel button in accept offer screen', function () {
                                    acceptOfferPage.clickCancelBtn();
                                    expect(savingsAndInvestmentsOptionsPage.getSavingInvestmentTitle().getText()).toEqual('Savings and Investments');
                                });

                                it('should display MarketLink Account Details screen after clicking the Back button in accept offer screen', function () {
                                    goToAccountApplicationScreens(browser.params.credentials);
                                    transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                    transferPage.Amount('6000');
                                    transferPage.proceed();
                                    acceptOfferPage.clickBackBtn();
                                    expect(transferPage.getMarketLinkAccountDetails().getText()).toBe("MarketLink Account Details");
                                });

                                describe('PW-14295: proceed to finish screen  validations', function () {
                                    it('should display the Your application was successful and summary in finish screen', function () {
                                        goToAccountApplicationScreens(browser.params.credentials);
                                        transferPage.FromAccountdata('ACCESSACC - 10-00-035-814-0');
                                        transferPage.Amount('6000');
                                        transferPage.proceed();
                                        acceptOfferPage.clickCheckBox();
                                        acceptOfferPage.proceed();
                                        expect(savingsFinishPage.getApplicationSuccessPage().getText()).toBe("Your application was successful");
                                        expect(savingsFinishPage.getSummary().getText()).toBe("Summary");
                                        expect(savingsFinishPage.getAccountTypeLabel().getText()).toBe("Account type");
                                        expect(savingsFinishPage.getAccountType().getText()).toBe("MarketLink");
                                        expect(savingsFinishPage.getAccountNoLabel().getText()).toBe("Account number");
                                        expect(savingsFinishPage.getAccountNo().getText()).toBe("10-00-035-814-00");
                                        expect(savingsFinishPage.getDateLabel().getText()).toBe("Date");
                                        expect(savingsFinishPage.getDateValue().getText()).toBe("14 September 2015");
                                        expect(savingsFinishPage.getTimeLabel().getText()).toBe("Time");
                                        expect(savingsFinishPage.Timevalue().getText()).toBe("12:49:51");
                                    });
                                });
                            });
                        });
                    });
                });

                describe('click on cancel button', function () {
                    it('should close the fraud check consent form and display a message to the user', function () {
                        goToSavingsAndInvestments(browser.params.credentials);
                        savingsPrescreeningWidget.actions.apply("market-link");
                        savingsPrescreeningWidget.actions.fraudCheckConsentFormCancelClick("market-link");
                        expect(savingsPrescreeningWidget.getFraudCheckModal("market-link").isDisplayed()).toBeFalsy();
                    });
                });
            });
        });

        describe('PW-14294: Scenario 4: User is SA Citizen with SA ID but Country of Birth is not Populated, Applies for MarketLink account and Consents to fraud check', function () {
            it('Should display the basic details page with all required fields uneditable except for Country of Birth which is editable and allow the user to save the country of birth field', function () {
                goToSavingsAndInvestments(browser.params.accountOrigination.amlIncompleteCountryOfBirth);
                savingsPrescreeningWidget.actions.apply("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");
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
                editBasicInformationPage.actions.saveBasicInformation();
                otpPage.submitOtp('12345');
                expect(editBasicInformationPage.countryOfBirthReadonlyElement().getText()).toBe("South Africa");
                expect(editBasicInformationPage.cellPhoneReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.cellPhoneReadonlyElement().getText()).toBe("******5887");
                expect(editBasicInformationPage.firstEmailAddressReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.firstEmailAddressReadonlyElement().getText()).toBe("i***********@s***********.c*.z*");
                expect(editBasicInformationPage.lastEmailAddressReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.lastEmailAddressReadonlyElement().getText()).toBe("J****.S*******@s***********.c*.z*");
                expect(editBasicInformationPage.preferredCommunicationLanguageReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.preferredCommunicationLanguageReadonlyElement().getText()).toBe("English");
                expect(editBasicInformationPage.modifyContactInformationButton().isDisplayed()).toBeFalsy();
            });

            describe('PW:15152: Then proceeds to the address screen', function () {
                it('should display the customer\'s addresses but not the show modify button', function () {
                    customerInformationPage.actions.goToAddressPage();
                    expect(addressPage.homeStreetElement().getText()).toBe("5 Simmonds St");
                    expect(addressPage.homeSuburbElement().getText()).toBe("Marshalltown");
                    expect(addressPage.homeCityElement().getText()).toBe("Johannesburg");
                    expect(addressPage.homePostCodeElement().getText()).toBe("2001");
                    expect(addressPage.homeResidentialStatusElement().getText()).toBe("Owner");
                    expect(addressPage.postalStreetElement().getText()).toBe("52 Anderson St");
                    expect(addressPage.postalSuburbElement().getText()).toBe("Marshalltown");
                    expect(addressPage.postalCityElement().getText()).toBe("Johannesburg");
                    expect(addressPage.postalPostCodeElement().getText()).toBe("2001");
                    expect(addressPage.homeModifyButton().isDisplayed()).toBeFalsy();
                });

                describe('PW:14999: Then proceeds to the employment screen', function () {
                    it('should display the customer\'s employment and education details', function () {
                        customerInformationPage.actions.goToEmploymentPage();
                        expect(employmentPage.employedReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.employedReadonlyValueElement().getText()).toBe("Yes");
                        expect(employmentPage.employerNameReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.employerNameReadonlyValueElement().getText()).toBe("SBSA");
                        expect(employmentPage.startDateReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.startDateReadonlyValueElement().getText()).toBe("1 February 2004");
                        expect(employmentPage.industryReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.industryReadonlyValueElement().getText()).toBe("Construction");
                        expect(employmentPage.occupationLevelReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.occupationLevelReadonlyValueElement().getText()).toBe("Supervisor");
                        expect(employmentPage.statusReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.statusReadonlyValueElement().getText()).toBe("Contractor");
                        expect(employmentPage.addEmployerLinkElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.levelOfEducationReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.levelOfEducationReadonlyValueElement().getText()).toBe("B compt");
                        expect(employmentPage.employmentModifyButton().isDisplayed()).toBeTruthy();
                    });

                    it('should display the modified customer\'s employment and education details after modify and save', function () {
                        customerInformationPage.actions.goToEmploymentPage();
                        expect(employmentPage.employmentModifyButton().isDisplayed()).toBeTruthy();
                        employmentPage.employmentModifyButtonClick();
                        employmentPage.actions.selectEmployerName("My Company");
                        employmentPage.actions.selectStartDate();
                        employmentPage.actions.selectOccupationIndustry('Agriculture');
                        employmentPage.actions.selectOccupationLevel('Director');
                        employmentPage.actions.selectStatus('Full time');
                        expect(employmentPage.save().isEnabled()).toBeTruthy();
                        employmentPage.actions.saveEmployment();
                        otpPage.submitOtp('12345');
                        expect(employmentPage.employerNameReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.employerNameReadonlyValueElement().getText()).toBe("My Company");
                        expect(employmentPage.startDateReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.startDateReadonlyValueElement().getText()).toBeDefined();
                        expect(employmentPage.startDateReadonlyValueElement().getText()).not.toBe("");
                        expect(employmentPage.industryReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.industryReadonlyValueElement().getText()).toBe("Agriculture");
                        expect(employmentPage.occupationLevelReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.occupationLevelReadonlyValueElement().getText()).toBe("Director");
                        expect(employmentPage.statusReadonlyValueElement().isDisplayed()).toBeTruthy();
                        expect(employmentPage.statusReadonlyValueElement().getText()).toBe("Full time");
                    });

                    describe('Then proceeds to the income and expenses screen', function () {
                        it('should display the customer\'s income and expenses details', function () {
                            goToSavingsAndInvestments(browser.params.accountOrigination.amlIncompleteCountryOfBirth);
                            savingsPrescreeningWidget.actions.apply("market-link");
                            savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
                            savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");
                            editBasicInformationPage.actions.selectItemInTypeAhead("Country of birth *", "South Africa");
                            editBasicInformationPage.actions.saveBasicInformation();
                            otpPage.submitOtp('12345');
                            customerInformationPage.actions.goToIncomeAndExpensesPage();
                            expect(incomeAndExpensePage.salaryReadonlyValueElement().isDisplayed()).toBeTruthy();
                            expect(incomeAndExpensePage.salaryReadonlyValueElement().getText()).toBe("R 60 000.00");
                            expect(incomeAndExpensePage.totalIncomeReadonlyValueElement().isDisplayed()).toBeTruthy();
                            expect(incomeAndExpensePage.totalIncomeReadonlyValueElement().getText()).toBe("R 60 000.00");
                            expect(incomeAndExpensePage.totalExpensesValueElement().isDisplayed()).toBeTruthy();
                            expect(incomeAndExpensePage.totalExpensesValueElement().getText()).toBe("R 60 000.00");
                            expect(incomeAndExpensePage.incomeAndExpensesModifyButton().isDisplayed()).toBeTruthy();
                        });

                        it('should display the modified customer\'s income and expenses details details after modify and save', function () {
                            customerInformationPage.actions.goToIncomeAndExpensesPage();
                            incomeAndExpensePage.incomeAndExpensesModifyButtonClick();
                            incomeAndExpensePage.actions.selectMonthlyIncome("Gross salary");
                            incomeAndExpensePage.actions.setMonthlyIncomeAmount("100000");
                            expect(incomeAndExpensePage.confirm().isEnabled()).toBeTruthy();
                            editIncomeAndExpensePage.actions.setTotalExpensesAmount("70000");
                            incomeAndExpensePage.actions.clickConfirmButton();
                            otpPage.submitOtp('12345');
                            expect(incomeAndExpensePage.salaryReadonlyValueElement().isDisplayed()).toBeTruthy();
                            expect(incomeAndExpensePage.salaryReadonlyValueElement().getText()).toBe("R 100 000.00");
                            expect(incomeAndExpensePage.totalIncomeReadonlyValueElement().isDisplayed()).toBeTruthy();
                            expect(incomeAndExpensePage.totalIncomeReadonlyValueElement().getText()).toBe("R 100 000.00");
                            expect(incomeAndExpensePage.totalExpensesValueElement().isDisplayed()).toBeTruthy();
                            expect(incomeAndExpensePage.totalExpensesValueElement().getText()).toBe("R 70 000.00");
                            expect(incomeAndExpensePage.incomeAndExpensesModifyButton().isDisplayed()).toBeTruthy();
                        });

                        describe('Then proceeds to the consent screen', function () {
                            it('should display the customer\'s marketing consent details', function () {
                                customerInformationPage.actions.goToConsentPage();
                                expect(consentPage.receiveMarketing().isDisplayed()).toBeTruthy();
                                expect(consentPage.receiveMarketing().isSelected()).toBeFalsy();
                                expect(consentPage.receiveMarketing().isEnabled()).toBeFalsy();
                                expect(consentPage.shareCustomerData().isDisplayed()).toBeTruthy();
                                expect(consentPage.shareCustomerData().isSelected()).toBeFalsy();
                                expect(consentPage.shareCustomerData().isEnabled()).toBeFalsy();
                                expect(consentPage.contactForResearch().isDisplayed()).toBeTruthy();
                                expect(consentPage.contactForResearch().isSelected()).toBeFalsy();
                                expect(consentPage.contactForResearch().isEnabled()).toBeFalsy();
                                expect(consentPage.contactForSpecialOffers().isDisplayed()).toBeTruthy();
                                expect(consentPage.contactForSpecialOffers().isSelected()).toBeFalsy();
                                expect(consentPage.contactForSpecialOffers().isEnabled()).toBeFalsy();
                                expect(consentPage.submit().getText()).toBe('Submit');

                                consentPage.clickEditButton();
                                expect(consentPage.receiveMarketingEdit().isEnabled()).toBeTruthy();
                                expect(consentPage.shareCustomerDataEdit().isEnabled()).toBeTruthy();
                                expect(consentPage.contactForResearchEdit().isEnabled()).toBeTruthy();
                                expect(consentPage.contactForSpecialOffersEdit().isEnabled()).toBeTruthy();

                                consentPage.clickCheckBox('edit-consent-01');
                                consentPage.clickCheckBox('edit-consent-02');
                                consentPage.clickCheckBox('edit-consent-03');
                                consentPage.clickCheckBox('edit-consent-04');

                                consentPage.actions.saveConsent();
                                otpPage.submitOtp('12345');
                                expect(consentPage.receiveMarketing().isEnabled()).toBeFalsy();
                                expect(consentPage.receiveMarketing().isSelected()).toBeTruthy();
                                expect(consentPage.shareCustomerData().isEnabled()).toBeFalsy();
                                expect(consentPage.shareCustomerData().isSelected()).toBeTruthy();
                                expect(consentPage.contactForResearch().isEnabled()).toBeFalsy();
                                expect(consentPage.contactForResearch().isSelected()).toBeTruthy();
                                expect(consentPage.contactForSpecialOffers().isEnabled()).toBeFalsy();
                                expect(consentPage.contactForSpecialOffers().isSelected()).toBeTruthy();
                                consentPage.actions.submit();
                                expect(browser.getLocationAbsUrl()).toContain('/apply/market-link/transfer');
                            });

                            it('should display the modified the consent details screen after modify and save', function () {
                                goToSavingsAndInvestments(browser.params.accountOrigination.amlIncompleteCountryOfBirth);
                                goToSavingsAndInvestments(browser.params.accountOrigination.amlIncompleteCountryOfBirth);
                                savingsPrescreeningWidget.actions.apply("market-link");
                                savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
                                savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");
                                customerInformationPage.actions.goToConsentPage();
                                consentPage.clickEditButton();
                                consentPage.clickCheckBox('edit-consent-01');
                                consentPage.clickCheckBox('edit-consent-02');
                                consentPage.clickCheckBox('edit-consent-03');
                                consentPage.clickCheckBox('edit-consent-04');
                                consentPage.actions.saveConsent();
                                otpPage.submitOtp('12345');
                                expect(consentPage.receiveMarketing().isSelected()).toBeTruthy();
                                expect(consentPage.shareCustomerData().isSelected()).toBeTruthy();
                                expect(consentPage.contactForResearch().isSelected()).toBeTruthy();
                                expect(consentPage.contactForSpecialOffers().isSelected()).toBeTruthy();
                                expect(consentPage.receiveMarketing().isEnabled()).toBeFalsy();
                                expect(consentPage.shareCustomerData().isEnabled()).toBeFalsy();
                                expect(consentPage.contactForResearch().isEnabled()).toBeFalsy();
                                expect(consentPage.contactForSpecialOffers().isEnabled()).toBeFalsy();
                            });

                        });
                    });
                });
            });
        });

        describe('PW-14294: Scenario 5: User is NOT a SA Citizen but has SA ID and Nationality, Country of Birth and Country of Citizenship are not Populated, Applies for MarketLink account and Consents to fraud check', function () {
            it('Should display the basic details page with all required fields uneditable except for Country of Birth which is editable', function () {
                goToSavingsAndInvestments(browser.params.accountOrigination.amlIncompleteNonSACitizen);
                savingsPrescreeningWidget.actions.apply("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");

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
                editBasicInformationPage.actions.selectItemInTypeAhead("Nationality *", "South Africa");
                expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                editBasicInformationPage.actions.selectItemInTypeAhead("Country of birth *", "South Africa");
                expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                editBasicInformationPage.actions.selectItemInTypeAhead("Country of citizenship *", "South Africa");
                expect(editBasicInformationPage.save().isEnabled()).toBeTruthy();
                editBasicInformationPage.actions.saveBasicInformation();
                otpPage.submitOtp('12345');
                expect(editBasicInformationPage.nationalityReadonlyElement().getText()).toBe("South Africa");
                expect(editBasicInformationPage.countryOfBirthReadonlyElement().getText()).toBe("South Africa");
                expect(editBasicInformationPage.countryOfCitizenshipReadonlyElement().getText()).toBe("South Africa");
                expect(editBasicInformationPage.cellPhoneReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.cellPhoneReadonlyElement().getText()).toBe("******5887");
                expect(editBasicInformationPage.firstEmailAddressReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.firstEmailAddressReadonlyElement().getText()).toBe("i***********@s***********.c*.z*");
                expect(editBasicInformationPage.lastEmailAddressReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.lastEmailAddressReadonlyElement().getText()).toBe("J****.S*******@s***********.c*.z*");
                expect(editBasicInformationPage.preferredCommunicationLanguageReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.preferredCommunicationLanguageReadonlyElement().getText()).toBe("English");
                expect(editBasicInformationPage.modifyContactInformationButton().isDisplayed()).toBeFalsy();
            });
        });

        describe('PW-14294: Scenario 6: User is has no SA ID document and Nationality, Country of Birth, Country of Citizenship and Permit details are not Populated, Applies for MarketLink account and Consents to fraud check', function () {
            it('Should display the basic details page with all required fields uneditable except for Country of Birth which is editable', function () {
                goToSavingsAndInvestments(browser.params.accountOrigination.amlIncompleteNoSAID);
                savingsPrescreeningWidget.actions.apply("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");
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
                expect(editBasicInformationPage.passportElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.passportElement().getText()).toBe("***6182");
                expect(editBasicInformationPage.passportOriginElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.passportOriginElement().getText()).toBe("United States");

                if (!addBasicInformationAMLFeature) {
                    expect(editBasicInformationPage.permitTypeDropdown().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.permitTypeDropdown().getAttribute('value')).toBe("");
                    expect(editBasicInformationPage.permitNumberInput().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.permitNumberInput().getText()).toBe("");
                    expect(editBasicInformationPage.permitIssueDateInput().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.permitIssueDateInput().getText()).toBe("");
                    expect(editBasicInformationPage.permitExpiryDateInput().isDisplayed()).toBeTruthy();
                    expect(editBasicInformationPage.permitExpiryDateInput().getText()).toBe("");
                    expect(editBasicInformationPage.permitExpiryInfoValue().getText()).toBe("We cannot offer you an account if your permit expires within 3 months");
                    expect(editBasicInformationPage.permitExpiryInfoValue().getCssValue('color')).toBe("rgba(120, 120, 120, 1)");
                }
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
                editBasicInformationPage.actions.selectItemInTypeAhead("Nationality *", "South Africa");
                expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                editBasicInformationPage.actions.selectItemInTypeAhead("Country of birth *", "South Africa");
                expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                editBasicInformationPage.actions.selectItemInTypeAhead("Country of citizenship *", "South Africa");
                if(!addBasicInformationAMLFeature) {
                    expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                    editBasicInformationPage.actions.selectItemInDropDown("Permit type *", "string:04");
                    expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                    editBasicInformationPage.actions.enterTextIntoInput("Permit number *", "1234567890");
                    expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                    editBasicInformationPage.actions.selectFirstDayInPreviousMonthInDatePicker("Permit issue date *");
                    expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                    editBasicInformationPage.actions.selectFirstDayInNextMonthInDatePicker("Permit expiry date *");
                    expect(editBasicInformationPage.permitExpiryInfoValue().getCssValue('color')).toBe("rgba(206, 25, 54, 1)");
                    expect(editBasicInformationPage.save().isEnabled()).toBeFalsy();
                    editBasicInformationPage.actions.selectFirstDayInFourMonthsTimeInDatePicker("Permit expiry date *");
                    expect(editBasicInformationPage.permitExpiryInfoValue().getCssValue('color')).toBe("rgba(120, 120, 120, 1)");
                }
                expect(editBasicInformationPage.save().isEnabled()).toBeTruthy();
                editBasicInformationPage.actions.saveBasicInformation();
                otpPage.submitOtp('12345');
                expect(editBasicInformationPage.nationalityReadonlyElement().getText()).toBe("South Africa");
                expect(editBasicInformationPage.countryOfBirthReadonlyElement().getText()).toBe("South Africa");
                expect(editBasicInformationPage.countryOfCitizenshipReadonlyElement().getText()).toBe("South Africa");
                if(!addBasicInformationAMLFeature) {
                    expect(editBasicInformationPage.permitTypeReadonlyElement().getText()).toBe("Critical skills work visa");
                    expect(editBasicInformationPage.permitNumberReadonlyElement().getText()).toBe("1234567890");
                    expect(editBasicInformationPage.permitIssueDateReadonlyElement().getText()).not.toBe("");
                    expect(editBasicInformationPage.permitExpiryDateReadonlyElement().getText()).not.toBe("");
                }
                expect(editBasicInformationPage.cellPhoneReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.cellPhoneReadonlyElement().getText()).toBe("******5887");
                expect(editBasicInformationPage.firstEmailAddressReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.firstEmailAddressReadonlyElement().getText()).toBe("i***********@s***********.c*.z*");
                expect(editBasicInformationPage.lastEmailAddressReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.lastEmailAddressReadonlyElement().getText()).toBe("J****.S*******@s***********.c*.z*");
                expect(editBasicInformationPage.preferredCommunicationLanguageReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.preferredCommunicationLanguageReadonlyElement().getText()).toBe("English");
                expect(editBasicInformationPage.modifyContactInformationButton().isDisplayed()).toBeFalsy();
            });
        });

        describe('PW-14999: Scenario 3 and 4: View and update mandatory AML fields relating to "Employment"', function () {
            beforeEach(function () {

                goToSavingsAndInvestments(browser.params.accountOrigination.amlIncompleteNoEmploymentInformation);
                savingsPrescreeningWidget.actions.apply("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");
            });

            it('should display the customer\'s basic information and contact details', function () {
                expect(editBasicInformationPage.infoNotification().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.infoNotification().getText()).toBe("Please visit your nearest branch to update your basic information");
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
                expect(editBasicInformationPage.countryOfBirthReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.countryOfBirthReadonlyElement().getText()).toBe("South Africa");
                expect(editBasicInformationPage.maritalStatusElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.maritalStatusElement().getText()).toBe("Single");
                expect(editBasicInformationPage.yourBranchElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.yourBranchElement().getText()).toBe("Ballito");
                expect(editBasicInformationPage.cellPhoneReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.cellPhoneReadonlyElement().getText()).toBe("******5887");
                expect(editBasicInformationPage.firstEmailAddressReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.firstEmailAddressReadonlyElement().getText()).toBe("i***********@s***********.c*.z*");
                expect(editBasicInformationPage.lastEmailAddressReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.lastEmailAddressReadonlyElement().getText()).toBe("J****.S*******@s***********.c*.z*");
                expect(editBasicInformationPage.preferredCommunicationLanguageReadonlyElement().isDisplayed()).toBeTruthy();
                expect(editBasicInformationPage.preferredCommunicationLanguageReadonlyElement().getText()).toBe("English");
                expect(editBasicInformationPage.modifyContactInformationButton().isDisplayed).toBeTruthy();
            });

            it('Should ask the user if they are employed and prepopulate educational information in the drop down lists. When the user indicated that they are NOT employed, it should display reason for unemployment fields and allow the user to save the data', function () {
                customerInformationPage.actions.goToEmploymentPage();
                expect(employmentPage.currentlyEmployedYesSelection().isDisplayed()).toBeTruthy();
                expect(employmentPage.currentlyEmployedYesSelection().isSelected()).toBeFalsy();
                expect(employmentPage.currentlyEmployedNoSelection().isDisplayed()).toBeTruthy();
                expect(employmentPage.currentlyEmployedNoSelection().isSelected()).toBeFalsy();
                expect(employmentPage.qualificationLevelDropDown().isDisplayed()).toBeTruthy();
                expect(employmentPage.qualificationLevelDropDown().getAttribute('value')).toBe("string:Bachelor");
                expect(employmentPage.qualificationTypeDropDown().isDisplayed()).toBeTruthy();
                expect(employmentPage.qualificationTypeDropDown().getAttribute('value')).toBe("string:3004");
                expect(employmentPage.save().isDisplayed()).toBeTruthy();
                expect(employmentPage.save().isEnabled()).toBeFalsy();
                expect(employmentPage.cancel().isDisplayed()).toBeTruthy();
                expect(employmentPage.cancel().isEnabled()).toBeTruthy();
                employmentPage.actions.setEmploymentToNo();
                expect(employmentPage.reasonForUnemploymentDropdown().isDisplayed()).toBeTruthy();
                employmentPage.actions.selectUnemploymentReason("Unemployed");
                expect(employmentPage.save().isEnabled()).toBeTruthy();
                employmentPage.actions.saveEmployment();
                otpPage.submitOtp('12345');
                expect(employmentPage.reasonForUnemploymentReadonlyValueElement().isDisplayed()).toBeTruthy();
                expect(employmentPage.reasonForUnemploymentReadonlyValueElement().getText()).toBe("Unemployed");
            });

            it('Should ask the user if they are employed and prepopulate educational information in the drop down lists. When the user indicated that they are employed, it should display employer information fields and allow the user to save the data', function () {
                customerInformationPage.actions.goToEmploymentPage();
                expect(employmentPage.currentlyEmployedYesSelection().isDisplayed()).toBeTruthy();
                expect(employmentPage.currentlyEmployedYesSelection().isSelected()).toBeFalsy();
                expect(employmentPage.currentlyEmployedNoSelection().isDisplayed()).toBeTruthy();
                expect(employmentPage.currentlyEmployedNoSelection().isSelected()).toBeFalsy();
                expect(employmentPage.save().isDisplayed()).toBeTruthy();
                expect(employmentPage.save().isEnabled()).toBeFalsy();
                expect(employmentPage.cancel().isDisplayed()).toBeTruthy();
                expect(employmentPage.cancel().isEnabled()).toBeTruthy();
                employmentPage.actions.setEmploymentToYes();
                expect(employmentPage.employerNameInput().isDisplayed()).toBeTruthy();
                expect(employmentPage.startDateInput().isDisplayed()).toBeTruthy();
                expect(employmentPage.industryDropDown().isDisplayed()).toBeTruthy();
                expect(employmentPage.occupationLevelDropDown().isDisplayed()).toBeTruthy();
                expect(employmentPage.statusDropDown().isDisplayed()).toBeTruthy();
                employmentPage.actions.selectEmployerName("My Company");
                employmentPage.actions.selectStartDate();
                employmentPage.actions.selectOccupationIndustry('Agriculture');
                employmentPage.actions.selectOccupationLevel('Director');
                employmentPage.actions.selectStatus('Full time');
                expect(employmentPage.save().isEnabled()).toBeTruthy();
                employmentPage.actions.saveEmployment();
                otpPage.submitOtp('12345');
                expect(employmentPage.employerNameReadonlyValueElement().isDisplayed()).toBeTruthy();
                expect(employmentPage.employerNameReadonlyValueElement().getText()).toBe("My Company");
                expect(employmentPage.startDateReadonlyValueElement().isDisplayed()).toBeTruthy();
                expect(employmentPage.startDateReadonlyValueElement().getText()).toBeDefined();
                expect(employmentPage.startDateReadonlyValueElement().getText()).not.toBe("");
                expect(employmentPage.industryReadonlyValueElement().isDisplayed()).toBeTruthy();
                expect(employmentPage.industryReadonlyValueElement().getText()).toBe("Agriculture");
                expect(employmentPage.occupationLevelReadonlyValueElement().isDisplayed()).toBeTruthy();
                expect(employmentPage.occupationLevelReadonlyValueElement().getText()).toBe("Director");
                expect(employmentPage.statusReadonlyValueElement().isDisplayed()).toBeTruthy();
                expect(employmentPage.statusReadonlyValueElement().getText()).toBe("Full time");
            });
        });

        describe('PW-15001: Scenario 2: View and update mandatory AML fields relating to "Income and Expenses"', function () {
            it('Should ask the user for their source of income and allow them to save', function () {
                goToSavingsAndInvestments(browser.params.accountOrigination.amlIncompleteNoIncomeInformation);
                savingsPrescreeningWidget.actions.apply("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentCheckBoxClick("market-link");
                savingsPrescreeningWidget.actions.fraudCheckConsentFormNextClick("market-link");
                customerInformationPage.actions.goToIncomeAndExpensesPage();
                expect(incomeAndExpensePage.monthlyIncomeDropDown().isDisplayed()).toBeTruthy();
                expect(incomeAndExpensePage.monthlyIncomeAmountInput().isDisplayed()).toBeTruthy();
                expect(incomeAndExpensePage.monthlyIncomeAmountInput().getAttribute('value')).toBe("");
                expect(incomeAndExpensePage.totalIncomeReadonlyValueElement().isDisplayed()).toBeTruthy();
                expect(incomeAndExpensePage.totalIncomeReadonlyValueElement().getText()).toBe("R 0.00");
                expect(incomeAndExpensePage.confirm().isEnabled()).toBeFalsy();
                incomeAndExpensePage.actions.selectMonthlyIncome("Gross salary");
                incomeAndExpensePage.actions.setMonthlyIncomeAmount("100000");
                expect(incomeAndExpensePage.confirm().isEnabled()).toBeTruthy();
                incomeAndExpensePage.actions.clickConfirmButton();
                otpPage.submitOtp('12345');
                expect(incomeAndExpensePage.salaryReadonlyValueElement().isDisplayed()).toBeTruthy();
                expect(incomeAndExpensePage.salaryReadonlyValueElement().getText()).toBe("R 100 000.00");
                expect(incomeAndExpensePage.totalIncomeReadonlyValueElement().isDisplayed()).toBeTruthy();
                expect(incomeAndExpensePage.totalIncomeReadonlyValueElement().getText()).toBe("R 100 000.00");
                expect(incomeAndExpensePage.incomeAndExpensesModifyButton().isDisplayed()).toBeTruthy();
            });
        });
    });

    describe('When a customer that CANNOT apply for MarketLink Clicks on apply button for MarketLink', function () {
        it('Should refer the customer to a branch', function () {
            goToSavingsAndInvestments(browser.params.accountOrigination.notKYC);
            savingsPrescreeningWidget.actions.apply("market-link");
            expect(savingsPrescreeningWidget.getKycNonCompliantMessageModal("market-link").isDisplayed()).toBeTruthy();
            savingsPrescreeningWidget.actions.kycNonCompliantMessageModalClose("market-link");
            expect(savingsPrescreeningWidget.getKycNonCompliantMessageModal("market-link").isDisplayed()).toBeFalsy();
            savingsAndInvestmentsOptionsPage.actions.marketLinkDetails();
            savingsPrescreeningWidget.actions.apply("market-link");
            expect(savingsPrescreeningWidget.getKycNonCompliantMessageModal("market-link").isDisplayed()).toBeTruthy();
            savingsPrescreeningWidget.actions.kycNonCompliantMessageModalClose("market-link");
            expect(savingsPrescreeningWidget.getKycNonCompliantMessageModal("market-link").isDisplayed()).toBeFalsy();
        });
    });
});