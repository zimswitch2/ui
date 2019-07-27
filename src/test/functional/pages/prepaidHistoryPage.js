var prepaidHistoryPage = function () {
    'use strict';

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.getTitle = function () {
        return element(by.css('h2')).getText();
    };

    this.getPrintButton = function () {
        return element(by.id('print'));
    };

    this.getInfoMessage = function(){
     return element(by.css('.information.message')).getText();
    };

    var getContent = function (listElement, dataHeader) {
        return listElement.element(by.css("div[data-header='" + dataHeader + "']")).getText();
    };

    this.getPrepaidHistory = function () {
        return element.all(by.css('.prepaid-history .data li div.information:not(.print-only)')).map(function (listElement) {
            return {
                transactionDate : getContent(listElement, 'Purchase date'),
                serviceProvider : getContent(listElement, 'Service provider'),
                voucherType : getContent(listElement, 'Voucher type'),
                purchasedFor : getContent(listElement, 'Purchased for'),
                invoiceNumber : getContent(listElement, 'Invoice number'),
                amount : getContent(listElement, 'Amount')
            };
        });
    };
};

module.exports = new prepaidHistoryPage();
