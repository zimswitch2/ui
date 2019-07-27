var OverviewPage = function () {
    var helpers = require('./helpers.js');
    this.transactionClick = function () {
        helpers.scrollThenClick(this.transactionBalance);
    };

    this.waitForNetIncomeChart = function () {
        helpers.wait(element(by.id('netIncomeChartContainer')));
    };

    this.overviewTitle = element(by.id('overviewTitle'));
    this.sinceDateSubTitle = element(by.id('overviewSinceDateSubTitle'));
    this.summarySubTitle = element(by.css('h4'));

    this.transactionBalance = element(by.css('.product.transaction h2'));
    this.creditBalance = element(by.css('.product.creditcard h2'));
    this.loanBalance = element(by.css('.product.loan h2'));
    this.investmentBalance = element(by.css('.product.investment h2'));

    this.netIncomeChartContainer = element(by.id('netIncomeChartContainer'));
    this.netIncomeChartCanvas = element(by.css('.chart-container canvas'));
    this.netIncomeChartLegendHeaderLabel = element(by.css('.chart-legend-header-label'));
    this.netIncomeChartLegendHeaderValue = element(by.css('.chart-legend-header-value'));

    this.netIncomeChartLegendItemColourSwabs = element.all(by.css('.chart-legend-colour-swab'));
    this.netIncomeChartLegendItemValues = element.all(by.css('.chart-legend-item span:last-child'));

    this.noCurrentAccountNotification = element(by.css('.net-income-doughnut-chart div.info.notification span'));

    this.noNetIncomeAccountsOptionPanelHeaders = element.all(by.css('.net-income-doughnut-chart div.divider-container div.divider-item h4'));
    this.noNetIncomeAccountsOptionPanelButtons = element.all(by.css('.net-income-doughnut-chart div.divider-container div.divider-item a.button.secondary'));

    this.NetIncomeChartErrorNotification = element(by.css('.net-income-doughnut-chart div.error.notification span'));
    this.NetIncomeChartErrorNotificationCloseButton = element(by.css('.net-income-doughnut-chart div.error.notification i.icon.icon-times-circle'));
};

module.exports = new OverviewPage();