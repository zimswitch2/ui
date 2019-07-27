var pageStepDefinition = function () {
    var expect = require('./expect');
    var Promise = require('bluebird');

    this.Then(/^I should see the "([^"]*)" page$/, function (pageName) {
        var page = browser.params.pages[_.camelCase(pageName)];

        return Promise.all([
            expect(element(by.css('h2')).getText()).to.eventually.contain(page.title),
            expect(browser.getLocationAbsUrl()).to.eventually.endsWith(page.path)
        ]);

    });

    //TODO add otp page to page objects and reuse exisitng step definition
    this.Then(/^I should see the OTP page with "([^"]*)" title$/, function (pageTitle) {
        return Promise.all([
            expect(element(by.css('h2')).getText()).to.eventually.equal(pageTitle),
            expect(browser.getLocationAbsUrl()).to.eventually.endsWith('otp/verify')
        ]);
    });

    this.Then(/^I should see the "([^"]*)" "([^"]*)" page$/, function (pageName, currentPage) {
        var page = browser.params.pages[_.camelCase(pageName)];
        return expect(browser.getLocationAbsUrl()).to.eventually.contain(page.path + '/' + currentPage);
    });

    this.Then(/^I should see the "([^"]*)" "([^"]*)" "([^"]*)" page$/, function (pageName, currentPage, action) {
        var page = browser.params.pages[_.camelCase(pageName)];
        return expect(browser.getLocationAbsUrl()).to.eventually.contain(page.path + '/' + currentPage + '/' + action);
    });
};
module.exports = pageStepDefinition;