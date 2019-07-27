var captureBasicPage = function () {
    this.baseActions = require('./baseActions.js');

    this.actions = {
        fillFirstContact: function (value) {
            var rows = element.all(by.repeater('contact in customerInformationData.communicationInformation'));
            return rows.first().element(by.tagName('input')).sendKeys(value);
        }

    };

};

module.exports = new captureBasicPage();
