var TransferPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');
    var landingPage = require('../pages/landingPage.js');
    var transactionPage = require('../pages/transactionPage.js');

    var transferFromSelect = element(by.css('#transferFrom'));
    var transferToSelect = element(by.css('#transferTo'));
    var amountInput = element(by.css('#amount'));
    var referenceInput = element(by.css('#reference'));
    var Amount = element(by.css('#amount'));

    this.load = function () {
        browser.get('index.html#/transfers');
        browser.waitForAngular();
    };

    this.navigateTo = function () {
        landingPage.baseActions.clickOnTab('Transact');
        transactionPage.createInterAccountTransfer();
    };

    this.getHeaderText = function (){
        return element(by.css('div.page-heading-row h2')).getText();
    };

    this.getInfoMessageText = function () {
        return element(by.css('div.notification.info')).getText();
    };

    this.getTransferFromList = function(){
        return element.all(by.css('#transferFrom option'));
    };

    this.getTransferToList = function(){
        return element.all(by.css('#transferTo option'));
    };

    this.transferFrom = function (accountLabel) {
        return this.baseActions.textForDropdown(transferFromSelect, accountLabel);
    };

    this.transferTo = function (accountLabel) {
        return this.baseActions.textForDropdown(transferToSelect, accountLabel);
    };

    this.amount = function(amountAsString) {
        return this.baseActions.textForInput(amountInput, amountAsString);
    };

    this.reference = function(reference) {
        return this.baseActions.textForInput(referenceInput, reference);
    };

    this.data = function (transfer) {
        this.transferFrom(transfer.from);
        this.transferTo(transfer.to);
        this.reference(transfer.reference);
        this.amount(transfer.amount);
    };
    
    this.FromAccountdata = function (fromAccountNo) {
        this.transferFrom(fromAccountNo);      
    };

    this.next = function () {
        return element(by.css('#proceed'));
    };

    this.proceed = function () {
        helpers.scrollThenClick(this.next());
    };

    this.cancel = function () {
        helpers.scrollThenClick(element(by.css('#cancel')));
    };

    this.getFromAvailableBalance = function(){
        return element(by.css('#transferFromAvailableBalance')).getText();
    };

    this.getToAvailableBalance = function(){
        return element(by.css('#transferToAvailableBalance')).getText();
    };

    this.getTransferDate = function(){
        return element(by.css('#transferDate'));
    };

    this.getAmountInfoMessageElement = function() {
        return element(by.css('form div.text-notification'));
    };

    this.getAmountErrorMessageElement = function() {
        return element(by.css('sb-amount .form-error'));
    };

    this.getConfirmpageheading = function () {
        return element(by.css('.page-heading-row'));
    };

    this.getPureSaveAccountDetails = function () {
        return element(by.css('h2'));
    };

    this.getTaxFreeAccountDetails = function () {
        return element(by.css('h2'));
    };
    this.getMarketLinkAccountDetails = function () {
        return element(by.css('h2'));
    };
    
    this.getAmountExceedsErrorMessage = function () {
        return element(by.css('.input-group'));
    };
    this.getEnterAnAmountAtleastMessage = function () {
        return element(by.css('.input-group'));
    };

    this.getEnterAnAmountGreaterthenzerp = function () {
        return element(by.css('.input-group'));
    };

    this.getMinimumOpeningBalance = function () {
        return element(by.css('.text-notification'));
    };

    this.getAvailableBalanceText = function () {
        return element(by.css(' .inline-info'));
    };    

     this.getRandAmount = function () {
        return element(by.id('transferFromAvailableBalance'));
    };    

    this.getAmountDefaultValue = function () {
        var e = $('#amount');
        return e.getAttribute('value');
    };

     this.Amount = function (AmountinRand) {
        helpers.wait(Amount);
         Amount.clear();
        Amount.sendKeys(AmountinRand);
    };  

    this.getPureSaveTitleTransfer = function () {
        return element(by.css('.offer ng-form h3'));
    };   

};
module.exports = new TransferPage();
