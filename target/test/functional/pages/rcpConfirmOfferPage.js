var rcpConfirmOfferPage = function () {
    'use strict';
    var helpers = require('./helpers.js');
    this.baseActions = require('./baseActions.js');

    var acceptedOfferSelectorDetails = {
        cssPropertyMap : {
            "Account type": '#accountType',
            "Revolving Credit Plan amount": '#acceptOfferRcpAmount',
            "Interest rate": '#acceptOfferInterestRate',
            "Loan disbursement account": "#disbursementAccount",
            "Repayment account": '#repaymentAccount',
            "Repayment term": '#repaymentTerm',
            "Repayment date": '#repaymentDate',
            "Monthly repayment amount": '#acceptOfferMonthlyRepayment'
        },
        rowSelector : ".summary-ao"
    };

    this.actions = {
        confirmOffer: function () {
            return helpers.scrollThenClick(element(by.id('rcpConfirm')));
        },

        backToRevolvingCreditPlan: function () {
            return helpers.scrollThenClick(element(by.id('rcpGoToRevolvingCreditPlan')));
        },

        agreeToConditions: function () {
            return helpers.scrollThenClick(element(by.id('termsAndConditions')));
        }
    };

    this.getAcceptedOfferSelectorDetails = function(){
        return acceptedOfferSelectorDetails;
    };

    this.getTitle = function () {
        return element(by.id('acceptRcpOfferTitle')).getText();
    };

    this.getRCPAmount = function () {
        return element(by.id('acceptOfferRcpAmount')).getText();
    };

    this.getInterestRate = function () {
        return element(by.id('acceptOfferInterestRate')).getText();
    };

    this.getMonthlyRepaymentAmount = function () {
        return element(by.id('acceptOfferMonthlyRepayment')).getText();
    };

    this.getAccountType = function () {
        return element(by.id('accountType')).getText();
    };

    this.getRepaymentAccount = function () {
        return element(by.id('repaymentAccount')).getText();
    };

    this.getRepaymentDate = function () {
        return element(by.id('repaymentDate')).getText();
    };


    this.getRepaymentTerm = function () {
        return element(by.id('repaymentTerm')).getText();
    };


};

module.exports = new rcpConfirmOfferPage();
