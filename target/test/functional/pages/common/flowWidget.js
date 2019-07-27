var FlowWidget = function() {
    this.numberOfSteps = function() {
        return element.all(by.repeater('step in flow.steps')).count();
    };

    this.steps = function() {
        return element.all(by.repeater('step in flow.steps'));
    };

    this.currentStep = function() {
        return element(by.css('li.step-current')).getText();
    };

    this.next = function () {
      return element(by.css('li.step-todo')).getText();
    };
};

module.exports = new FlowWidget();