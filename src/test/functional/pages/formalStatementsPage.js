var formalStatementsPage = function () {

    this.baseActions = require('./baseActions.js');

    this.getFormalStatementsHeader = function () {
        return element(by.css('div h2')).getText();
    };

    this.getLast6MonthsSubheader = function () {
        return element(by.id('lastMonthsText')).getText();
    };

    this.getStatementData = function (item) {
        return element(by.css('ul.data li:first-child div div.'+ item + ' div')).getText();
    };

    this.searchForStatement = function (sendkey) {
        element(by.id('filter')).sendKeys(sendkey);
    };

    this.navigateBackToTransactPage = function () {
        element(by.css('.btn.secondary')).click();
    };

    this.getDownloadTrackClickText = function(){
        return element(by.css('hidden-form-button')).getAttribute('track-click');
    };

    this.getEmailTrackClickText = function () {
        return element(by.css('form .primary')).getAttribute('track-click');
    };

    this.getSearchTrackClickText = function () {
        return element(by.css('filter-box')).getAttribute('track-click');
    };
};

module.exports = new formalStatementsPage();

