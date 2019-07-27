var ChangePasswordPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');
    var newPasswordField = element(by.id('newPassword'));
    var oldPasswordField = element(by.id('oldPassword'));
    var confirmPasswordField = element(by.id('confirmPassword'));

    this.currentPassword = function (oldPassword) {
        this.baseActions.textForInput(oldPasswordField, oldPassword);
    };

    this.newPassword = function (newPassword) {
        this.baseActions.textForInput(newPasswordField, newPassword);
    };

    this.confirmPassword = function (confirmPassword) {
        this.baseActions.textForInput(confirmPasswordField, confirmPassword);
    };

    this.saveButton = function () {
        return element(by.id('save-password'));
    };

};

module.exports = new ChangePasswordPage();
