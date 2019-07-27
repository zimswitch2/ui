var loginStepDefinition = function () {
    var loginPage = require('../../../pages/loginPage.js');

    var users = {
        'with a pending offer': 'hasPendingOffer',
        'with an accepted offer': 'hasAcceptedOffer',
        'with a pending offer that is not about to expire': 'hasPendingOfferNotAboutToExpire',
        'with a profile that will be rejected': 'aoReject',
        'who does not have an existing current account': 'canApply',
        'with an offer of a product that is not supported by IBR': 'unsupportedOffer',
        'without a specified preferred branch': 'canApplyNoBranch',
        'who does not have an existing RCP account': 'canApply',
        'without a transactional account': 'canApplyNoTA',
        'with an RCP product that is not linked to a card': 'hasExistingUnlinkedRcp',
        'with an RCP product that is linked to a card': 'hasExistingLinkedRcp',
        'with an existing RCP product': 'cannotApplyRcp',
        'who has accepted an RCP offer': 'hasAcceptedOffer',
        'who is new to bank and has accepted an RCP offer': 'newToBankHasAcceptedOffer',
        'who has a pending RCP offer and a transactional account': 'pendingRcpWithTransactionalAccount',
        'who has a pending RCP offer that is not about to expire and a transactional account': 'pendingNotAboutToExpireRcpWithTransactionalAccount',
        'who is new to bank and has a pending RCP offer that is about to expire': 'newToBankRcpPending',
        'who only has basic information':'onlyHasBasicInfo',
        'who has no employment information':'amlIncompleteNoEmploymentInformation',
        'who is unemployed':'unemployed',
        'owner of small medium enterprise':'seodata',
        'delinking a card on SIT2':'delinksit',
        'who has incomplete country of birth': 'amlIncompleteCountryOfBirth',
        'with a rejected application':'accountApplicationRejected'
    };

    var login = function (credentials) {
        loginPage.loginWith(credentials);
    };

    this.Given(/^I have logged in$/, function () {
        login(browser.params.credentials);
    });

    this.Given(/^I have logged in as a "([^"]*)" customer$/, function (user) {
        login(browser.params[_.camelCase(user)]);
    });

    this.Given(/^I want to apply for "([^"]*)" account as a customer "([^"]*)"$/, function (product, user) {
        login(browser.params[product][users[user]]);
    });

    this.Given(/^I want to apply for an account as a customer "([^"]*)"$/, function (user) {
        login(browser.params["accountOrigination"][users[user]]);
    });

    this.Given(/^I go to the login page$/, function () {
        loginPage.load();
    });

    this.When(/^The "([^"]*)" button is enabled$/, function (buttonText) {
        loginPage.enableButton(buttonText);
    });
};
module.exports = loginStepDefinition;