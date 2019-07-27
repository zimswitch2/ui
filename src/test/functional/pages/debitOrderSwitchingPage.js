var debitOrderSwitchingPage = function () {
    this.actions = {
        switch: element(by.id('switch')),
        decline: element(by.buttonText('decline'))
    };
};

module.exports = new debitOrderSwitchingPage();