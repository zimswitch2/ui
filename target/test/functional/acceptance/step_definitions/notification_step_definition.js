var notificationStepDefinition = function () {
    var expect = require('./expect');

    this.Then(/^I should see information text notification with "([^"]*)"$/, function (text) {
        return expect(element(by.css('.text-notification:not(.ng-hide)')).getText()).to.eventually.contain(text);
    });

    this.Then(/^I should not see (information|success|error) notification with "([^"]*)"$/, function (type, message) {
        if (type === 'information') {
            type = 'info';
        }

        return expect(element.all(by.css('.notification.' + type + ':not(.ng-hide)')).getText()).to.eventually.not.contain(message);
    });

    this.Then(/^I should see (information|success|error) notification with "([^"]*)"$/, function (type, message) {
        if (type === 'information') {
            type = 'info';
        }

        return expect(
            element(by.cssContainingText('.notification.' + type + ':not(.ng-hide)', message)).isDisplayed()
        ).to.eventually.be.true;
    });
};
module.exports = notificationStepDefinition;