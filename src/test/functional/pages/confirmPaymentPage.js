var confirmPaymentPage = function () {
    var helpers = require('./helpers.js');

    this.getValueOf = function(elementId) {
      return element(by.id(elementId)).getText();
    };
};

module.exports = new confirmPaymentPage();
