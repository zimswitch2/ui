var personalFinanceManagementFeature = false;

var overviewPageFeature = false;


if (personalFinanceManagementFeature && overviewPageFeature){
    describe('ACCEPTANCE - Account Summary Cashflows Charts', function () {
        'use strict';

        var helpers = require('../../pages/helpers.js');
        var landingPage = require('../../pages/landingPage.js');
        var loginPage = require('../../pages/loginPage.js');
        var overviewPage = require('../../pages/overviewPage.js');
        var accountSummaryPage = require('../../pages/accountSummaryPage.js');

        function navigateUsing(credentials) {
            loginPage.loginWith(credentials);
        }

        describe('when Meniga services return error', function () {
            beforeEach(function () {
                navigateUsing(browser.params.cashflowChartError);
                landingPage.baseActions.clickOnTab('Overview');
                overviewPage.waitForNetIncomeChart();

                helpers.scrollThenClick(overviewPage.netIncomeChartLegendItemValues.first());
                accountSummaryPage.waitForAccountSummaryCashflowChart();
            });

            it('should show a notification to show that an error has occurred', function () {
                expect(accountSummaryPage.AccountsCashflowsChartErrorNotification.isDisplayed()).toBeTruthy();
            });

            it('should hide the notification when user clicks on the notification\'s close button', function () {
                helpers.scrollThenClick(accountSummaryPage.AccountsCashflowsChartErrorNotificationCloseButton);
                expect(accountSummaryPage.AccountsCashflowsChartErrorNotification.isDisplayed()).toBeFalsy();
            });
        });

        describe('when Meniga services return valid data', function () {
            beforeEach(function () {
                navigateUsing(browser.params.credentials);
            });

            describe('cash in chart', function () {
                beforeEach(function () {
                    browser.getLocationAbsUrl().then(function (currentUrl) {
                        if(currentUrl.indexOf("account-summary/transactional-cash-in") < 0) {
                            landingPage.baseActions.clickOnTab('Overview');
                            overviewPage.waitForNetIncomeChart();

                            helpers.scrollThenClick(overviewPage.netIncomeChartLegendItemValues.first());
                            accountSummaryPage.waitForAccountSummaryCashflowChart();
                        }
                    });
                });

                it('should render cashflow chart canvas', function () {
                    expect(accountSummaryPage.accountsCashflowsChartCanvas.isPresent()).toBeTruthy();
                });

                it('should display the correct values in the chart legend header', function () {
                    expect(accountSummaryPage.accountsCashflowsChartLegendHeaderLabel.getText()).toEqual("Total Cash in (Since 1 April)");
                    expect(accountSummaryPage.accountsCashflowsChartLegendHeaderValue.getText()).toEqual("R 36 000.00");
                });

                it('should display the chart header text in green', function () {
                    expect(accountSummaryPage.accountsCashflowsChartLegendHeaderValue.getCssValue('color')).toEqual("rgba(36, 147, 9, 1)");
                });

                it('should display the correct labels in the chart legend items', function () {
                    expect(accountSummaryPage.accountsCashflowsChartLegendItemLabels.first().getText()).toEqual("ELITE");
                });

                it('should display the correct values in the chart legend items', function () {
                    expect(accountSummaryPage.accountsCashflowsChartLegendItemValues.first().getText()).toEqual("R 36 000.00");
                });

                it('should display the correct colours in the chart legend item swabs', function () {
                    expect(accountSummaryPage.accountsCashflowsChartLegendItemColourSwabs.first().getCssValue("background-color")).toEqual("rgba(2, 93, 140, 1)");
                });
            });

            describe('Cash out chart', function () {
                beforeEach(function () {
                    browser.getLocationAbsUrl().then(function (currentUrl) {
                        if(currentUrl.indexOf("account-summary/transactional-cash-out") < 0) {
                            landingPage.baseActions.clickOnTab('Overview');
                            overviewPage.waitForNetIncomeChart();

                            helpers.scrollThenClick(overviewPage.netIncomeChartLegendItemValues.last());
                            accountSummaryPage.waitForAccountSummaryCashflowChart();
                        }
                    });
                });

                it('should render chashflow chart canvas', function () {
                    expect(accountSummaryPage.accountsCashflowsChartCanvas.isPresent()).toBeTruthy();
                });

                it('should display the correct values in the chart legend header', function () {
                    expect(accountSummaryPage.accountsCashflowsChartLegendHeaderLabel.getText()).toEqual("Total Cash out (Since 1 April)");
                    expect(accountSummaryPage.accountsCashflowsChartLegendHeaderValue.getText()).toEqual("- R 31 629.35");
                });

                it('should display the chart header text in red', function () {
                    expect(accountSummaryPage.accountsCashflowsChartLegendHeaderValue.getCssValue('color')).toEqual("rgba(220, 24, 10, 1)");
                });

                it('should display the correct labels in the chart legend items', function () {
                    accountSummaryPage.accountsCashflowsChartLegendItemLabels.then(function(chartLegendItemLabels) {
                        expect(chartLegendItemLabels[0].getText()).toEqual("CREDIT CARD");
                        expect(chartLegendItemLabels[2].getText()).toEqual("ELITE");
                    });
                });

                it('should display the correct values in the chart legend items', function () {
                    accountSummaryPage.accountsCashflowsChartLegendItemValues.then(function(chartLegendItemValues) {
                        expect(chartLegendItemValues[0].getText()).toEqual("- R 11 118.95");
                        expect(chartLegendItemValues[1].getText()).toEqual("- R 20 510.40");
                    });
                });

                it('should display the correct colours in the chart legend item swabs', function () {
                    accountSummaryPage.accountsCashflowsChartLegendItemColourSwabs.then(function(chartLegendItemColourSwabs) {
                        expect(chartLegendItemColourSwabs[0].getCssValue("background-color")).toEqual('rgba(244, 141, 44, 1)');
                        expect(chartLegendItemColourSwabs[1].getCssValue("background-color")).toEqual('rgba(2, 93, 140, 1)');
                    });
                });
            });
        });
    });
}