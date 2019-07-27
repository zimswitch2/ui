var paymentConfirmationPreferencesPage = function () {

    var preferredName = element(by.css('#preferredName'));

    this.preferredName = function () {
        return preferredName.getText();
    };
};

module.exports = new paymentConfirmationPreferencesPage();