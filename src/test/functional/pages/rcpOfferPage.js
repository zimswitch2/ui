var rcpOfferPage = function () {
    'use strict';
    var helpers = require('./helpers.js');
    var self = this;

    var bankTypeAheadList = element(by.css("#bank .items"));
    var bankTextBox = element(by.id('bank-input'));

    var branchTypeAheadList = element(by.css("#branch .items"));
    var branchTextBox = element(by.id('branch-input'));

    var preferredBranchBox = element(by.id('preferredBranch-typeahead-input'));
    var preferredBranchAheadList = element(by.css("#preferredBranch-typeahead .items"));

    var accountNumberTextBox = element(by.id('accountNumber'));


    this.baseActions = require('./baseActions.js');

    this.actions = {
        acceptOffer: function () {
            return helpers.scrollThenClick(element(by.id('acceptRcpOffer')));
        },
        viewQuote: function () {
            return helpers.scrollThenClick(element(by.cssContainingText('button', 'View quote')));
        },
        closeQuote: function () {
            return helpers.scrollThenClick(element(by.id('closeRcpQuote')));
        },
        fillInDebitOrderDetails: function (debitOrderDetails) {
            self.baseActions.selectFromTypeAhead(debitOrderDetails.bankName, bankTextBox, bankTypeAheadList);
            self.baseActions.selectFromTypeAhead(debitOrderDetails.branchCode, branchTextBox, branchTypeAheadList);
            self.baseActions.textForInput(accountNumberTextBox, debitOrderDetails.accountNumber);

        },
        selectPreferredBranch: function (preferredBranchName) {
            self.baseActions.selectFromTypeAhead(preferredBranchName, preferredBranchBox, preferredBranchAheadList);
        },
        selectBank: function (bank) {
            self.baseActions.selectFromTypeAhead(bank, bankTextBox, bankTypeAheadList);
        },
        selectBankBranch: function (branch) {
            self.baseActions.selectFromTypeAhead(branch, branchTextBox, branchTypeAheadList);
        },
        enterAccountNumber: function (accountNumber) {
            self.baseActions.textForInput(accountNumberTextBox, accountNumber);
        }
    };

    var rcpOfferSelectorDetails = {
        cssPropertyMap : {
            "Minimum monthly repayment": '#minimumRepayment',
            "Interest rate": '#interestRate',
            "Repayment term": '#repaymentTerm'
        },
        rowSelector : '.rcp-properties'
    };

    this.getRcpOfferSelectorDetails = function(){
        return rcpOfferSelectorDetails;
    };

    this.getTitle = function () {
        return element(by.id('rcpOfferTitle')).getText();
    };

    this.getBank = function () {
        return bankTextBox.getAttribute('value');
    };

    this.getBranch = function () {
        return branchTextBox.getAttribute('value');
    };

    this.getAccountNumber = function () {
        return accountNumberTextBox.getAttribute('value');
    };


    this.getRCPAmount = function () {
        return element(by.id('maximumLoanAmount')).getText();
    };

    this.getRequestedLoanAmount = function () {
        return element(by.css('section.overdraft input#amount')).getAttribute('value');
    };

    this.getMinimumLoanAmount = function () {
        return element(by.css('section.overdraft .text-notification .rand-amount')).getText();
    };

    this.getInterestRate = function () {
        return element(by.id('interestRate')).getText();
    };

    this.getMonthlyRepaymentAmount = function () {
        return element(by.id('minimumRepayment')).getText();
    };

    this.getLoanTermInMonths = function () {
        return element(by.id('repaymentTerm')).getText();
    };

    this.isQuotePopupVisible = function () {
        return $('.quote-popup').isDisplayed();
    };

};

module.exports = new rcpOfferPage();
