var acceptOfferPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.actions = {
        next: element(by.id('next'))
    };
};

module.exports = new acceptOfferPage();
