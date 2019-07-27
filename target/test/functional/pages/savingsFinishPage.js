var savingsFinishPage = function () {
    'use strict';
    var helpers = require('./helpers.js');
    this.baseActions = require('./baseActions.js');

	this.getAccountTypeLabel = function () {
	       return element(by.css('#accountType span.summary-sni-label'));
	   };  
	this.getAccountType = function () {
	       return element(by.css('#accountType span.summary-ao-value'));
	   };  
	this.getAccountNoLabel = function () {
	       return element(by.css('#accountNumber span.summary-sni-label'));
	   };  
	this.getAccountNo = function () {
	       return element(by.css('#accountNumber span.summary-ao-value'));
	   };  
	this.getDateLabel = function () {
	       return element(by.css('#dateAccepted span.summary-sni-label'));
	   };  
	this.getDateValue = function () {
	       return element(by.css('#dateAccepted span.summary-ao-value'));
	   };

	this.getTimeLabel = function () {
	       return element(by.css('#timeAccepted span.summary-sni-label'));
	   };  
	this.Timevalue = function () {
	       return element(by.css('#timeAccepted span.summary-ao-value'));
	   };
	this.getSummary = function () {
	   return element(by.css('.account-information h3'));
	  };

	this.getApplicationSuccessPage = function () {
	        return element(by.css('.notification'));
	    };    
	this.getApplicationUnSuccessPage = function () {
	        return element.all(by.css('.text-notification'));
	   }; 
};
module.exports = new savingsFinishPage();

