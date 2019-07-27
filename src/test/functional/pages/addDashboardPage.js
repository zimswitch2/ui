var AddDashboardPage = function () {

    var dashboardName = element(by.id('dashboardName'));

    this.baseActions = require('./baseActions.js');
    this.helpers = require('./helpers.js');

    this.nextButton = function () {
        return element(by.id('next'));
    };

    this.getErrorMessage = function () {
        return element(by.css('.notification'));
    };

    this.getDashboardName = function() {
        return dashboardName.getAttribute('value');
    };

    this.enterDashboardName = function(dashboardNameText){
        dashboardName.clear();
        dashboardName.sendKeys(dashboardNameText);
    };

    this.saveDashboardButton = function () {
        return element(by.id('save'));
    };

    this.getDashboards = function () {
        return element(by.css('.data'));
    };

    this.clickOnCancelButton = function () {
        this.helpers.scrollThenClick(element(by.id('cancel')));
    };

    this.getFlowCurrentStep = function () {
        return element(by.css('.step-current')).getText();
    };

};

module.exports = new AddDashboardPage();
