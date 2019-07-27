function AddressValidation(navigateCallback, editCallback) {
    'use strict';

    this.validateSection = function (customer) {
        if (_.isEmpty(customer)) {
            return true;
        }

        return customer.hasCurrentResidentialAddress();
    };

    this.getNotificationMessage = function (customer) {
        return 'Please enter your address details';
    };

    this.navigateToSection = function () {
        navigateCallback();
    };

    this.editSection = function () {
        editCallback('address');
    };
}