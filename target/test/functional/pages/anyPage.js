var AnyPage = function () {
    var helpers = require('./helpers.js');
    this.getSteps = function () {
        var isComplete = function (classAttr) {
            return !_.contains(classAttr, 'step-todo');
        };
        var isCurrent = function (classAttr) {
            return _.contains(classAttr, 'step-current');
        };
        var getStepsPromise = element.all(by.css('ol.steps li'));
        return getStepsPromise.map(function (stepElement, index) {
            return {
                position: getStepsPromise.count().then(function (numberOfSteps) {
                    return (index + 1) + "/" + numberOfSteps;
                }),
                label: stepElement.getText(),
                complete: stepElement.getAttribute('class').then(isComplete),
                current: stepElement.getAttribute('class').then(isCurrent)
            };
        });
    };

    this.currentStep = function () {
        return this.getSteps().then(function (steps) {
            var currentStep = _.find(steps, function (step) {
                return step.current;
            });
            delete currentStep.current;
            return currentStep;
        });
    };

    this.getTitle = function () {
        return element(by.css('h2')).getText();
    };

    this.waitForTitle = function (title) {
        return helpers.waitForText(element(by.css('h2')), title).getText();
    };

    this.setFilterQuery = function (queryString) {
        var queryInput = element(by.css('filter-box input'));
        queryInput.clear();
        queryInput.sendKeys(queryString);
    };

    this.canProceed = function () {
        return element(by.css('#proceed')).isEnabled();
    };

    this.canContinue = function () {
        return element(by.css('#continue')).isEnabled();
    };

    this.getInfoNotification = function () {
        return element(by.css('.info.notification'));
    };

    this.getErrorNotification = function () {
        return element(by.css('.error.notification'));
    };

    this.getInfoNotificationExists = function () {
        var myElement = element(by.css('.info.notification'));
        return myElement.isPresent();
    };

};
module.exports = new AnyPage();
