var transact_step_definitions = function () {
    var expect = require('../../step_definitions/expect');

    var getTile = function (tileName) {
        return element(by.linkText(tileName));
    };

    this.Then(/^the "([^"]*)" tile should be visible$/, function (tileName) {
        return expect(getTile(tileName).isPresent()).to.eventually.be.true;
    });

    this.When(/^I click on the "([^"]*)" tile$/, function (tileName) {
        return getTile(tileName).click();
    });
};
module.exports = transact_step_definitions;