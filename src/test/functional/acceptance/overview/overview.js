var overviewPageFeature = false;
if(feature.overviewPage){
    overviewPageFeature = true;
}
var personalFinanceManagementFeature = false;
if (feature.personalFinanceManagement) {
    personalFinanceManagementFeature = true;
}

if (overviewPageFeature){
    describe('ACCEPTANCE - Overview Page', function () {
        'use strict';

        var helpers = require('../../pages/helpers.js');
        var landingPage = require('../../pages/landingPage.js');
        var loginPage = require('../../pages/loginPage.js');
        var accountSummaryPage = require('../../pages/accountSummaryPage.js');
        var overviewPage = require('../../pages/overviewPage.js');
        var __credentialsOfLoggedInUser__;

        function navigateUsing(credentials) {
            if (__credentialsOfLoggedInUser__ !== credentials) {
                loginPage.loginWith(credentials);
                __credentialsOfLoggedInUser__ = credentials;
            }
        }

        describe('Logged in user has transactional products', function () {
            beforeEach(function () {
                navigateUsing(browser.params.credentials);
                landingPage.baseActions.clickOnTab('Overview');
            });

            it('should display overview page', function () {
                expect(overviewPage.overviewTitle.getText()).toEqual('Overview');
                expect(overviewPage.sinceDateSubTitle.getText()).toContain('Since ');
                expect(overviewPage.summarySubTitle.getText()).toEqual('Consolidated view of all your accounts');
                expect(overviewPage.transactionBalance.getText()).toEqual('R 8 732.43');
                expect(overviewPage.creditBalance.getText()).toEqual('R 99 919 239.00');
                expect(overviewPage.loanBalance.getText()).toEqual('R 13 100 000.00');
                expect(overviewPage.investmentBalance.getText()).toEqual('R 878 111.00');
            });

            it('should display the 1st day of the previous month in the Since (DATE) sub title', function () {
                var date = new Date();
                date.setDate(1);
                date.setMonth(date.getMonth() - 1);
                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                expect(overviewPage.sinceDateSubTitle.getText()).toEqual('Since 1 ' + monthNames[date.getMonth()] + ' ' + (date.getYear() + 1900));
            });

            it('should display account summary page, when clicking on transaction', function () {
                overviewPage.transactionClick();
                expect(accountSummaryPage.getAccountInfo('transaction')).toContain("Transaction accounts");
            });

            if(personalFinanceManagementFeature) {
                describe('Net income chart', function () {
                    it('should hide the net income chart', function () {
                        expect(overviewPage.netIncomeChartContainer.isPresent()).toBeTruthy();
                        expect(overviewPage.netIncomeChartContainer.isDisplayed()).toBeTruthy();
                    });

                    it('should render net income chart canvas', function () {
                        expect(overviewPage.netIncomeChartCanvas.isPresent()).toBeTruthy();
                    });

                    it('should display the correct values in the chart legend header', function () {
                        expect(overviewPage.netIncomeChartLegendHeaderLabel.getText()).toEqual("Total Change (Since 1 April)");
                        expect(overviewPage.netIncomeChartLegendHeaderValue.getText()).toEqual("R 4 370.65");
                    });

                    it('should display the correct values in the chart legend items', function () {
                        overviewPage.netIncomeChartLegendItemValues.then(function(chartLegendItemValues) {
                            expect(chartLegendItemValues[0].getText()).toEqual("R 36 000.00");
                            expect(chartLegendItemValues[1].getText()).toEqual("- R 31 629.35");
                        });
                    });

                    it('should display the correct colours in the chart legend item swabs', function () {
                        overviewPage.netIncomeChartLegendItemColourSwabs.then(function(chartLegendItemColourSwabs) {
                            expect(chartLegendItemColourSwabs[0].getCssValue("background-color")).toEqual('rgba(159, 235, 171, 1)');
                            expect(chartLegendItemColourSwabs[1].getCssValue("background-color")).toEqual('rgba(244, 115, 114, 1)');
                        });
                    });

                    it('should display account summary page with cash in route, when clicking on cash in legend item', function () {
                        helpers.scrollThenClick(overviewPage.netIncomeChartLegendItemValues.first());
                        expect(accountSummaryPage.baseActions.getCurrentUrl()).toContain("account-summary/transactional-cash-in");
                    });

                    it('should display account summary page with cash out route, when clicking on cash out legend item', function () {
                        helpers.scrollThenClick(overviewPage.netIncomeChartLegendItemValues.last());
                        expect(accountSummaryPage.baseActions.getCurrentUrl()).toContain("account-summary/transactional-cash-out");
                    });

                    it('should not show a notification to indicate any error', function () {
                        expect(overviewPage.NetIncomeChartErrorNotification.isDisplayed()).toBeFalsy();
                    });
                });
            }
        });

        describe('Logged in user has no transactional products', function () {
            if(personalFinanceManagementFeature) {
                beforeEach(function () {
                    navigateUsing(browser.params.noCurrentOrCreditCardAccounts);
                    landingPage.baseActions.clickOnTab('Overview');
                });

                describe('Net income charts', function () {
                    it('should show a notification to show that no current accounts are linked to the user\'s profile', function () {
                        expect(overviewPage.noCurrentAccountNotification.getText()).toEqual('No current accounts linked to your profile');
                    });

                    it('should load options to apply for an account or link a card', function () {
                        overviewPage.noNetIncomeAccountsOptionPanelHeaders.then(function(noNetIncomeAccountsOptionPanelHeader) {
                            expect(noNetIncomeAccountsOptionPanelHeader[0].getText()).toEqual("Need a current account?");
                            expect(noNetIncomeAccountsOptionPanelHeader[1].getText()).toEqual("Already have a current account?");
                        });
                    });

                    it('should provide a link to apply for a current account and a link to edit the user\'s dashboard', function () {
                        overviewPage.noNetIncomeAccountsOptionPanelButtons.then(function(noNetIncomeAccountsOptionButtons) {
                            expect(noNetIncomeAccountsOptionButtons[0].getAttribute('href')).toContain("#/apply");
                            expect(noNetIncomeAccountsOptionButtons[1].getAttribute('href')).toContain("#/dashboards");
                        });
                    });

                    it('should hide the net income chart', function () {
                        expect(overviewPage.netIncomeChartContainer.isPresent()).toBeFalsy();
                    });
                });
            }
        });

        if(personalFinanceManagementFeature) {
            describe('Meniga services return error', function () {
                beforeEach(function () {
                    navigateUsing(browser.params.netIncomeChartError);
                    landingPage.baseActions.clickOnTab('Overview');
                });

                describe('Net income charts', function () {
                    it('should show a notification to show that an error has occurred', function () {
                        expect(overviewPage.NetIncomeChartErrorNotification.isDisplayed()).toBeTruthy();
                    });

                    it('should hide the notification when user clicks on the notification\'s close button', function () {
                        helpers.scrollThenClick(overviewPage.NetIncomeChartErrorNotificationCloseButton);
                        expect(overviewPage.NetIncomeChartErrorNotification.isDisplayed()).toBeFalsy();
                    });
                });
            });
        }
    });
}