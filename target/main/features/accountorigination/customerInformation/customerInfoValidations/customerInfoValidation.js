(function () {
    var app = angular.module('refresh.accountOrigination.customerInfoValidation', []);

    app.factory('CustomerInfoValidation', function () {
        var _invalidSections = [];
        var _customer;

        var _sections = {
            basicInfo: {
                order: 1,
                name     : 'Basic Information',
                route: 'profile',
                validation: new BasicInfoValidation()
            },
            addressInfo: {
                order: 2,
                name: 'Address',
                route: 'address',
                validation: new AddressValidation()
            },
            employmentInfo: {
                order: 3,
                name: 'Employment',
                route: 'employment',
                validation: new EmploymentValidation()
            },
            incomeInfo: {
                order: 4,
                name: 'Income and expenses',
                route: 'income',
                validation: new IncomeAndExpenseValidation()
            }
        };

        return {
            getInvalidSections: function (customerInformationData) {
                _customer = _.cloneDeep(customerInformationData);
                _invalidSections = [];

                for (var sectionKey in _sections) {
                    var section = _sections[sectionKey];
                    var sectionValidation = section.validation;
                    if (!sectionValidation.validateSection(_customer)) {
                        _invalidSections.push({name: section.name, route: section.route, validationMessage: sectionValidation.getNotificationMessage(_customer)});
                    }
                }
                return _invalidSections;
            },
            getValidationNotificationForSection: function (sectionPath) {
                return _.get(_.find(_invalidSections, {route: sectionPath}), 'validationMessage', undefined);
            }
        };
    });

})();
