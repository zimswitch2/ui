var ViewUserProfiles = function () {
    'use strict';

    var currentDashboardValue = function (key) {
        return element(by.xpath("//*[contains(@class, 'row-highlight')]//div[@data-header='" + key + "']")).getText();
    };

    this.currentDashboardName = function () {
        return currentDashboardValue('Dashboard name');
    };

    this.currentDashboardCardNumber = function () {
        return currentDashboardValue('Card number');
    };

    this.currentDashboardStatus = function () {
        return currentDashboardValue('Card status');
    };
};

module.exports = new ViewUserProfiles();
