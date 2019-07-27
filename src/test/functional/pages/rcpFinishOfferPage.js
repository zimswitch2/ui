var rcpFinishOfferPage = function () {
    'use strict';
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var confirmedOfferSelectorDetails = {
        cssPropertyMap : {
            "Account type": '#accountType .summary-ao-value',
            "Account number": '#accountNumber .summary-ao-value',
            "RCP amount": '#rcpAmount .summary-ao-value',
            "Interest rate": '#interestRate .summary-ao-value',
            "Monthly repayment amount": '#monthlyRepaymentAmount .summary-ao-value',
            "Preferred branch": '#preferredBranch .summary-ao-value',
            "Date accepted": '#dateAccepted .summary-ao-value',
            "Time accepted": '#timeAccepted .summary-ao-value'
        },
        rowSelector : ".summary-ao"
    };

    this.actions = {
        goBackToAccountSummary: function () {
            return helpers.scrollThenClick(element(by.id('rcpGoAccountSummary')));
        }
    };



    this.getTitle = function () {
        return element(by.id('confirmRcpTitle')).getText();
    };

    this.getAccountType = function () {
        return element(by.id('accountType')).getText();
    };


    this.getAccountNumber = function () {
        return element(by.id('accountNumber')).getText();
    };

    this.getRCPAmount = function () {
        return element(by.id('rcpAmount')).getText();
    };

    this.getInterestRate = function () {
        return element(by.id('interestRate')).getText();
    };

    this.getMonthlyRepaymentAmount = function () {
        return element(by.id('monthlyRepaymentAmount')).getText();
    };

    this.getPrefferedBranch = function () {
        return element(by.id('preferredBranch')).getText();
    };

    this.getDateAccepted = function () {
        return element(by.id('dateAccepted')).getText();
    };

    this.getTimeAccepted = function () {
        return element(by.id('timeAccepted')).getText();
    };

    this.getWhatHappensNext = function () {
        return element(by.id('whatHappensNext')).getText();
    };

    this.getConfirmedOfferSelectorDetails = function(){
        return confirmedOfferSelectorDetails;
    };

};

module.exports = new rcpFinishOfferPage();
