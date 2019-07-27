(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.domain.customer', ['refresh.lookups']);

    app.factory('CustomerInformationData', function (LookUps) {
        var modifiableSections = {
            addressesAreReadonly: false,
            contactInformationIsReadonly: false
        };

        var currentCustomer = {};
        var stashedCustomer;

        var Customer = function (properties) {
            var PHYSICAL_ADDRESS_TYPE = '01';
            var POSTAL_ADDRESS_TYPE = '02';
            var KYC_ADDRESS_USAGE = '05';
            var GENERAL_ADDRESS_USAGE = '02';

            var CELLPHONE_TYPE_CODE = '02';
            var TOTAL_EXPENSE_ITEM_CODE = '99';

            var MARKETING_CONSENT_LOWER_LIMIT = 1;
            var MARKETING_CONSENT_UPPER_LIMIT = 5;

            var INCOME_ITEM_INDICATOR = 'I';
            var EXPENSE_ITEM_INDICATOR = 'E';

            var getExpenditures = function (indicator) {
                return _.filter(properties.incomeExpenseItems, {itemExpenditureIndicator: indicator});
            };

            var findAddresses = function (type, usage) {
                return _.map(_.filter(properties.addressDetails, function (address) {
                    return address.addressType === type && _.any(address.addressUsage, {usageCode: usage});
                }), function (address) {
                    return new Address(address, usage);
                });
            };

            var descendingStartDate = function (address) {
                return -moment(address.getUsage().validFrom).valueOf();
            };

            var reduceItemAmount = function (sum, item) {
                return sum + (_.isUndefined(item.itemAmount) ? 0 : parseFloat(item.itemAmount));
            };

            var sortedEmploymentDetails = function () {
                return _.sortBy(properties.employmentDetails, function (employment) {
                    return -moment(employment.startDate).valueOf();
                });
            };

            var canAddEmployment = function (employment) {
                var isEmptyEmployment = _.isEmpty(employment) || _.isEmpty(employment.employerName);
                var isValidStartDate = !_.isEmpty(employment.startDate) && moment(employment.startDate).isValid();
                var isNewEmployment = !_.contains(properties.employmentDetails, employment);

                return !isEmptyEmployment && isValidStartDate && isNewEmployment;
            };

            var needAdditionalPermitInfo = function (permitDetail) {
                if (!getPassport()) {
                    return false;
                }

                if (getPassport() && _.isEmpty(permitDetail)) {
                    return true;
                }

                var requiredFields = ['identityTypeCode', 'identityNumber', 'issuedDate', 'expiryDate'];

                return _.any(requiredFields, function (propertyName) {
                    return _.isEmpty(permitDetail[propertyName]);
                });
            };

            var hasEmploymentDetails = function () {
                return !_.isEmpty(properties.employmentDetails) || !_.isEmpty(properties.unemploymentReason);
            };

            var isEmployed = function () {
                return _.any(properties.employmentDetails, function (item) {
                    return moment(item.endDate) > moment();
                });
            };

            var getPassport = function () {
                return _.find(properties.identityDocuments, {identityTypeCode: '06'});
            };

            var getPermit = function () {
                return _.first(properties.permitDetails);
            };

            var initialize = function () {
                var splitAddressDetails = [];
                _.each(properties.addressDetails, function (address) {
                    _.each(address.addressUsage, function (addressUsage) {
                        var newAddress = _.cloneDeep(address);
                        newAddress.addressUsage = [addressUsage];
                        splitAddressDetails.push(newAddress);
                    });
                });
                properties.addressDetails = splitAddressDetails;

                _.each(['employmentDetails', 'incomeExpenseItems', 'consentClauses'], function (propertyName) {
                    if (_.isUndefined(properties[propertyName])) {
                        properties[propertyName] = [];
                    }
                });

                if (customerManagementV4Feature) {
                    var permit = getPermit();
                    if (!permit && needAdditionalPermitInfo(permit)) {
                        properties.permitDetails = [];
                    }
                } else {
                    properties.permitDetails = [{
                        expiryDate: properties.workPermitExpiryDate
                    }];
                }
            };

            initialize();

            return _.merge(properties, {
                getIncomes: function () {
                    return getExpenditures(INCOME_ITEM_INDICATOR);
                },

                hasAnyIncome: function () {
                    return !_.isEmpty(this.getIncomes());
                },

                getGrossIncome: function () {
                    return _.reduce(this.getIncomes(), reduceItemAmount, 0);
                },

                getTotalExpenseItem: function () {
                    return _.first(_.filter(properties.incomeExpenseItems, {
                        itemExpenditureIndicator: EXPENSE_ITEM_INDICATOR,
                        itemTypeCode: TOTAL_EXPENSE_ITEM_CODE
                    }));
                },

                hasOnlyTotalExpense: function () {
                    return getExpenditures(EXPENSE_ITEM_INDICATOR).length === 1 && (parseFloat(this.getTotalExpenses()) !== 0);
                },

                getTotalExpenses: function () {
                    return _.isUndefined(this.getTotalExpenseItem()) || !_.has(this.getTotalExpenseItem(), 'itemAmount') ? 0 : parseFloat(this.getTotalExpenseItem().itemAmount);
                },

                filterExpenses: function () {
                    if (!this.hasOnlyTotalExpense()) {
                        _.remove(properties.incomeExpenseItems, {itemExpenditureIndicator: EXPENSE_ITEM_INDICATOR});
                    }
                },

                hasCellphoneContact: function () {
                    return _.any(properties.communicationInformation, {communicationTypeCode: CELLPHONE_TYPE_CODE});
                },

                isEmployed: function () {
                    return isEmployed();
                },

                isEmployedForLessThanAYear: function () {
                    return _.any(properties.employmentDetails, function (item) {
                        return moment().diff(moment(item.startDate), 'year') < 1 && moment(item.endDate) > moment();
                    });
                },

                getCurrentEmploymentDetails: function () {
                    return this.isEmployed() ? _.first(sortedEmploymentDetails()) : undefined;
                },

                getPreviousEmploymentDetails: function () {
                    return this.isEmployed() ? _.first(_.slice(sortedEmploymentDetails(), 1)) :
                        _.first(sortedEmploymentDetails());
                },

                addEmployment: function (employment) {
                    if (canAddEmployment(employment)) {
                        properties.employmentDetails.push(employment);
                    }
                },

                hasPreviousEmployment: function () {
                    return !_.isEmpty(this.getPreviousEmploymentDetails());
                },

                hasEmploymentDetails: function () {
                    return hasEmploymentDetails();
                },

                hasNoEmploymentStatus: function () {
                    return !hasEmploymentDetails() && _.isEmpty(properties.unemploymentReason);
                },

                getCurrentResidentialAddress: function () {
                    return _.first(_.sortBy(findAddresses(PHYSICAL_ADDRESS_TYPE, KYC_ADDRESS_USAGE), descendingStartDate));
                },

                getPreviousResidentialAddress: function () {
                    return _.first(_.slice(_.sortBy(findAddresses(PHYSICAL_ADDRESS_TYPE, KYC_ADDRESS_USAGE),
                        descendingStartDate), 1));
                },

                getCurrentPostalAddress: function () {
                    return _.first(_.sortBy(_.union(findAddresses(PHYSICAL_ADDRESS_TYPE, GENERAL_ADDRESS_USAGE), findAddresses(POSTAL_ADDRESS_TYPE, GENERAL_ADDRESS_USAGE)),
                        descendingStartDate));
                },

                hasCurrentResidentialAddress: function () {
                    return !_.isEmpty(this.getCurrentResidentialAddress());
                },

                atResidentialAddressForLessThanAYear: function () {
                    var currentResidentialAddress = this.getCurrentResidentialAddress();
                    return currentResidentialAddress &&
                        moment().diff(moment(currentResidentialAddress.getUsage().validFrom), 'year') < 1;
                },

                getNationalId: function () {
                    return _.find(properties.identityDocuments, {identityTypeCode: '01'});
                },

                isSACitizen: function () {
                    var nationalId = this.getNationalId();
                    return nationalId && nationalId.identityNumber && nationalId.identityNumber[10] === '0';
                },

                getPassport: function () {
                    return getPassport();
                },

                getPermit: function () {
                    return getPermit();
                },

                needAdditionalPermitInfo: function(){
                    return needAdditionalPermitInfo(this.getPermit());
                },

                isKycCompliant: function () {
                    return _.any(properties.complianceItems, {
                        complianceCode: 'Y',
                        complianceType: 'KYC'
                    });
                },

                getConsent: function (consentCode) {
                    return _.find(properties.consentClauses, {consentCode: consentCode});
                },

                hasMarketingConsent: function () {
                    return _.any(properties.consentClauses, function (item) {
                        return _.inRange(parseInt(item.consentCode), MARKETING_CONSENT_LOWER_LIMIT, MARKETING_CONSENT_UPPER_LIMIT);
                    });
                },

                setConsent: function (consentCode, consentFlag) {
                    var consentClause = properties.getConsent(consentCode);
                    if (_.isUndefined(consentClause)) {
                        properties.consentClauses.push({consentCode: consentCode, consentFlag: consentFlag});
                    }
                    else {
                        consentClause.consentFlag = consentFlag;
                    }
                },

                needAdditionalBasicInfo: function () {
                    if (needAdditionalPermitInfo(this.getPermit()) &&  !addBasicInformationAMLFeature) {
                        return true;
                    }

                    var requiredFields = ['birthCountryCode', 'nationalityCountryCode', 'citizenshipCountryCode',
                        'residenceCountryCode'];
                    return _.any(requiredFields, function (fieldName) {
                        return _.isEmpty(properties[fieldName]);
                    });
                },

                makeAddressesReadonly: function () {
                    modifiableSections.addressesAreReadonly = true;
                },

                canModifyAddresses: function () {
                    return !modifiableSections.addressesAreReadonly;
                },

                makeContactInformationReadonly: function () {
                    modifiableSections.contactInformationIsReadonly = true;
                },

                canModifyContactInformation: function () {
                    return !modifiableSections.contactInformationIsReadonly;
                },

                letterData: function () {
                    var residentialAddress = this.getCurrentResidentialAddress();
                    return LookUps.title.promise().then(function (values) {
                        var mappedTitle = _.find(values, {code: properties.customerTitleCode});
                        var displayName;
                        if (mappedTitle) {
                            displayName = mappedTitle.description + ' ' + properties.customerSurname;
                        }
                        else {
                            displayName = properties.customerSurname;
                        }

                        return {
                            residentialAddress: residentialAddress,
                            displayName: displayName,
                            fullName: properties.customerFirstName + ' ' + properties.customerSurname
                        };
                    });
                }
            });
        };

        var initialize = function (properties) {
            modifiableSections.addressesAreReadonly = false;
            modifiableSections.contactInformationIsReadonly = false;
            currentCustomer = new Customer(properties || {});
            stashedCustomer = new Customer(_.cloneDeep(properties || {}));
            return currentCustomer;
        };

        var stash = function () {
            stashedCustomer = new Customer(_.cloneDeep(currentCustomer));
        };

        var apply = function () {
            stashedCustomer = undefined;
        };

        var revert = function () {
            currentCustomer = new Customer(_.cloneDeep(stashedCustomer) || {});
        };

        var hasEditedEmploymentDetails = function () {
            if (_.isEmpty(stashedCustomer)) {
                return false;
            }

            return !(_.isEqual(currentCustomer.getCurrentEmploymentDetails(), stashedCustomer.getCurrentEmploymentDetails()) &&
            currentCustomer.tertiaryQualificationCode === stashedCustomer.tertiaryQualificationCode &&
            currentCustomer.unemploymentReason === stashedCustomer.unemploymentReason);
        };

        var hasEditedConsentClauses = function () {
            if (_.isEmpty(stashedCustomer)) {
                return false;
            }

            return !_.isEqual(stashedCustomer.consentClauses, currentCustomer.consentClauses);
        };

        initialize();
        return {
            current: function () {
                return currentCustomer;
            },
            initialize: initialize,
            revert: revert,
            stash: stash,
            apply: apply,
            hasEditedEmploymentDetails: hasEditedEmploymentDetails,
            hasEditedConsentClauses: hasEditedConsentClauses
        };
    });
})();
