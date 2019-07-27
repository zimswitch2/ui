(function () {
    'use strict';

    var app = angular.module('refresh.lookups', ['refresh.cache']);

    app.factory('LookUps', function (Cacher) {
        var trimAndCapitalize = function (text) {
            var trimmed = text.trim();
            return trimmed.charAt(0).toUpperCase() + trimmed.substr(1).toLowerCase();
        };

        var decorateSpecificIncomeTypes = function (incomeType){
            if (incomeType.inextIncomI === 'I' && padLeft(incomeType.inextC) === '01') {
                return 'Gross salary';
            }
            return null;
        };

        function StaticLookUp(staticValues) {
            return {
                values: function () {
                    return staticValues;
                }
            };
        }

        var padLeft = function (value) {
            return _.padLeft(convertToString(value), 2, 0);
        };

        var convertToString = function (value) {
            return value.toString().trim();
        };

        var defaultMapping = function (fieldMapping, convertFunction) {
            return function (response) {
                return _.map(response.data[fieldMapping.responseField], function (item) {
                    convertFunction = convertFunction || convertToString;
                    return {
                        code: convertFunction(item[fieldMapping.code]),
                        description: trimAndCapitalize(item[fieldMapping.description])
                    };
                });
            };
        };

        var incomeAndExpenseMapping = function (type) {
            return function (response) {
                return _.filter(response.data.inexTypes, {inextIncomI: type}).map(function (item) {
                    return {
                        code: padLeft(item.inextC),
                        description: decorateSpecificIncomeTypes(item) || trimAndCapitalize(item.inextEngX)
                    };
                });
            };
        };

        function ServiceLookUp(endpoint, mappingFunction) {
            var cachedValues, cachedPromise;

            var initialize = function () {
                if (!cachedPromise) {
                    cachedPromise = Cacher.perennial.fetch(endpoint).then(mappingFunction);
                    cachedPromise.then(function (response) {
                        cachedValues = response;
                    });
                }
            };

            return {
                values: function () {
                    initialize();
                    return cachedValues;
                },
                promise: function () {
                    initialize();
                    return cachedPromise;
                }
            };
        }

        return {
            boolean: new StaticLookUp([{code: true, description: 'Yes'}, {code: false, description: 'No'}]),
            beneficiaryType: new StaticLookUp([{code: "INDIVIDUAL", description: 'Person'},
                {code: "ENTITY", description: 'Entity'}]),
            beneficiaryAccountType: new StaticLookUp([{code: "IBAN", description: 'IBAN'},
                {code: "accountNumber", description: 'Account number'}]),
            beneficiaryFee: new StaticLookUp([{code: "OWN", description: 'You pay all the fees'},
                {code: "SHA", description: 'Split the fees'}]),
            branch: new ServiceLookUp('walkInBranches',
                defaultMapping({responseField: 'branches', code: 'code', description: 'name'}, parseInt)),
            consent: new StaticLookUp([
                {
                    code: '03',
                    description: "Contact you about Standard Bank products, services and special offers.",
                    analytics_name: 'SB_products'
                },
                {
                    code: '01',
                    description: "Contact you about other companies' products, services and special offers. If you agree, you may be contacted by these companies.",
                    analytics_name: 'Other_companies'
                },
                {
                    code: '04',
                    description: "Share your personal information within the Group for marketing purposes.",
                    analytics_name: 'Marketing'
                },
                {
                    code: '02',
                    description: "Contact you for research purposes. Your personal information is confidential under a strict code of conduct.",
                    analytics_name: 'Research'
                }]),
            contactType: new ServiceLookUp('getContactTypes',
                defaultMapping({responseField: 'SapCommunicationType', code: 'typeCode', description: 'description'})),
            country: new ServiceLookUp('getCountries',
                defaultMapping({responseField: 'countries', code: 'cnrySwiftCode', description: 'cnryEngX'})),
            dialingCodes: new ServiceLookUp('getCountries', function (response) {
                return _.map(response.data['countries'], function (item) {
                    return {
                        internationalDialingCode: item.cnryIntnlDilngC,
                        description: item.cnryEngX,
                        countryCode: item.cnryCode
                    };
                });
            }),
            employmentType: new ServiceLookUp('getOccupationStatuses',
                defaultMapping({responseField: 'occupStatus', code: 'ocusStatusC', description: 'ocusEngDescX'})),
            expenseType: new ServiceLookUp('getIncomeAndExpenseTypes', incomeAndExpenseMapping('E')),
            gender: new StaticLookUp([{code: '1', description: 'Male'}, {code: '2', description: 'Female'}]),
            idType: new StaticLookUp([{code: '01', description: 'South African ID'}, {code: '06', description: 'Passport'}]),
            incomeType: new ServiceLookUp('getIncomeAndExpenseTypes', incomeAndExpenseMapping('I')),
            language: new StaticLookUp([{code: 'EN', description: 'English'}, {code: 'AF', description: 'Afrikaans'}]),
            levelOfEducation: new ServiceLookUp('getEducationQualifications', function (response) {
                var educationLevels = _.reject(response.data['education'], function (item) {
                    return item.terqLevelN === 0;
                });
                return _.map(educationLevels, function (item) {
                    return {
                        code: item.terqQlfcnCodeN.toString(),
                        description: trimAndCapitalize(item.terqDescEngX),
                        category: trimAndCapitalize(item.terqStudyTypeX)
                    };
                });
            }),
            maritalStatus: new ServiceLookUp('getMaritalStatuses',
                defaultMapping({responseField: 'maritalStatus', code: 'mrtalSttusC', description: 'mrtalEngDescX'})),
            maritalType: new StaticLookUp([{code: "F", description: 'Foreign matrimonial systems'},
                {code: "S", description: 'Married in community of property'},
                {code: "T", description: 'Married out of community of property with accrual'},
                {code: "U", description: 'Married out of community of property without accrual'},
                {code: "W", description: 'Common law spouse'},
                {code: "Z", description: 'Traditional marriage'}]),
            occupationIndustry: new ServiceLookUp('getOccupationIndustries',
                defaultMapping({responseField: 'cccupIndustries', code: 'ocuiIndustyC', description: 'ocuiEngDescX'})),
            occupationLevel: new ServiceLookUp('getOccupationLevels',
                defaultMapping({responseField: 'occupLevels', code: 'oculLevelC', description: 'oculEngDescX'})),
            permitType: new StaticLookUp([{code: "03", description: 'General work visa'},
                {code: "04", description: 'Critical skills work visa'},
                {code: "05", description: 'Intra-company transfer work visa'},
                {code: "09", description: 'Business visa'},
                {code: "11", description: 'Quota work visa'}]),
            productCategories: new StaticLookUp([
                {code: 1, description: 'current'},
                {code: 4, description: 'rcp'}
            ]),
            residentialStatus: new ServiceLookUp('getAccommodationTypes',
                defaultMapping({
                    responseField: 'accommodationTypes',
                    code: 'acmdnTypeC',
                    description: 'acmdnEngX'
                }, padLeft)),
            title: new ServiceLookUp('getTitles',
                defaultMapping({responseField: 'titles', code: 'title', description: 'engX'})),
            unemploymentReason: new ServiceLookUp('getUnemploymentReasons',
                defaultMapping({responseField: 'occupUnempReasons', code: 'ocueReasnC', description: 'ocueEngDescX'})),
            communicationChannel: new StaticLookUp([
                {code: 'email', description: 'email\tR 0.70'},
                {code: 'sms', description: 'SMS\tR 0.80'},
                {code: 'none', description: 'Don\'t send'}
                ])
        };
    });
})();
