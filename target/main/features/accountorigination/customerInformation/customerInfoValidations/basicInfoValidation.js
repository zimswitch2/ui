var customerManagementV4Feature = false;

{
    customerManagementV4Feature = true;
}

function BasicInfoValidation(navigateCallback, editCallback) {
    'use strict';

    this.validateSection = function (customer) {
        if (_.isEmpty(customer) || !customerManagementV4Feature) {
            return true;
        }
        return !customer.needAdditionalBasicInfo();
    };

    this.getNotificationMessage = function (customer) {
        return 'Please enter all the additional required information to complete your profile';
    };

    this.navigateToSection = function () {
        navigateCallback();
    };

    this.editSection = function (customer) {
        editCallback('additionalBasic');
    };
}
