var customerManagementV4Feature = false;
if(feature.customerManagementV4) {
    customerManagementV4Feature = true;
}

function EmploymentValidation(navigateCallback, editCallback){
    'use strict';

    this.validateSection = function (customer) {

        if (_.isEmpty(customer) || customer.hasEmploymentDetails()) {
            return true;
        }

        if(!customerManagementV4Feature){
            return !_.isEmpty(customer.tertiaryQualificationCode);
        }
        return false;
    };

    this.getNotificationMessage = function(customer){
        return 'Please enter your employment details';
    };

    this.navigateToSection = function () {
        navigateCallback();
    };

    this.editSection = function (customer) {
        editCallback('add');
    };
}