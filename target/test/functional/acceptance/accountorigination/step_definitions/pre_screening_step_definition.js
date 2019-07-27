var PreScreeningStepDefinitions = function () {
    var expect = require('../../step_definitions/expect');

    this.Then(/^I should see the following pre-screening questions:$/, function (questions) {
        var visibleQuestions = element.all(by.css('section:not(.ng-hide) > label')).getText();
        var expectedQuestions = questions.hashes().map(function (q) {
            return q['question'];
        });

        return expect(visibleQuestions).to.eventually.deep.equal(expectedQuestions);
    });
};
module.exports = PreScreeningStepDefinitions;