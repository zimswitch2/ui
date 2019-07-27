(function () {

    var module = angular.module('refresh.internationalPayment.domain.internationalPaymentCustomer', []);

    module.factory('InternationalPaymentCustomer', function () {
        var _customer;

        var Customer = function (properties) {
            var incompleteFields = function () {
                var requiredFields = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'contact',
                    'postalAddressOne', 'postalSuburb', 'postalCity', 'postalProvince', 'postalPostalCode',
                    'residentialAddressOne', 'residentialSuburb', 'residentialCity', 'residentialProvince',
                    'residentialPostalCode'];

                var isIdentificationValid = function() {
                    var hasIdNumber = !_.isEmpty(properties.idNumber);
                    var hasForeignIdNumber = !_.isEmpty(properties.foreignIdNumber);
                    var hasPassportAndForeignId = !_.isEmpty(properties.passportNumber) && !_.isEmpty(properties.workPermitNumber);

                    return  hasIdNumber || hasForeignIdNumber || hasPassportAndForeignId;
                };

                return !isIdentificationValid() || _.any(requiredFields, function (propertyName) {
                    return _.isEmpty(properties[propertyName]);
                });
            };

            var isResident = function () {
                return !_.isUndefined(properties.idNumber) && properties.idNumber.length > 0;
            };

            var hasWorkPermit = function() {
                return !_.isUndefined(properties.workPermitNumber) && properties.workPermitNumber.length > 0;
            };

            return _.merge(properties, {
                incompleteFields: incompleteFields,
                isResident: isResident,
                hasWorkPermit: hasWorkPermit
            });
        };

        var customer = function () {
            return _customer;
        };

        var initialize = function (internationalPaymentCustomer) {
            _customer = new Customer(internationalPaymentCustomer);
            return _customer;
        };

        return {
            initialize: initialize,
            customer: customer
        };
    });
})();