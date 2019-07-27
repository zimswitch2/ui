var customerManagementV4Feature = false;

if (feature.customerManagementV4) {
    customerManagementV4Feature = true;
}

(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformation.edit.employment',
        ['refresh.metadata',
            'refresh.accountOrigination.customerService',
            'refresh.accountOrigination.common.directives.cancelConfirmation',
            'refresh.accountOrigination.customerInfoValidation']);

    app.config(function ($routeProvider) {

        $routeProvider.when('/apply/:product/employment/edit', {
            templateUrl: 'features/accountorigination/customerInformation/partials/editEmployment.html',
            controller: 'EditEmploymentController',
            resolve: {
                addStatus: function () {
                    return false;
                }
            }
        });

        $routeProvider.when('/apply/:product/employment/add', {
            templateUrl: 'features/accountorigination/customerInformation/partials/editEmployment.html',
            controller: 'EditEmploymentController',
            resolve: {
                addStatus: function () {
                    return true;
                }
            }
        });
    });

    app.controller('EditEmploymentController',
        function ($scope, $location, $routeParams, $window, User, ApplicationParameters,
                  LookUps, CustomerService, CustomerInformationData, CancelConfirmationService,
                  CustomerInfoValidation, addStatus) {

            function setLookupTable(mapProperty, lookUp) {
                lookUp.promise().then(function (response) {
                    $scope[mapProperty] = response;
                });
            }

            //Extract to LevelOfEducation service which behaves similarly to Lookups
            function updateLevelsOfEducation(studyType) {
                $scope.levelsOfEducation = _.where($scope.allLevelsOfEducation, {category: studyType});
            }

            function needPreviousEmploymentForAdd() {
                var isAdditionalEmployment = $scope.isAdding && $scope.customerInformationData.hasEmploymentDetails();
                var isCurrentEmploymentLessThanAYear = $scope.isEmployed && $scope.currentEmploymentIsLessThanAYear();
                return isAdditionalEmployment || isCurrentEmploymentLessThanAYear;
            }

            function needPreviousEmploymentForModify() {
                return $scope.customerInformationData.hasEmploymentDetails() && !$scope.isEmployed;
            }

            function resetPreviousEmployment() {
                for (var key in $scope.previousEmployment()) {
                    delete $scope.previousEmployment()[key];
                }
            }

            function formattedDate(dateMoment) {
                return dateMoment.format('YYYY-MM-DD');
            }

            setLookupTable('occupationIndustries', LookUps.occupationIndustry);
            setLookupTable('occupationLevels', LookUps.occupationLevel);
            setLookupTable('employmentTypes', LookUps.employmentType);
            setLookupTable('unemploymentReasons', LookUps.unemploymentReason);

            //Extract to LevelOfEducation service then use setLookupsTable
            LookUps.levelOfEducation.promise().then(function (response) {
                $scope.allLevelsOfEducation = response;
                $scope.levelsOfEducation = $scope.allLevelsOfEducation;
                $scope.studyTypes = _.reject(_.uniq(_.map(response, function (item) {
                    return item.category;
                })), function (item) {
                    return item === '';
                });

                var levelOfEducation = _.find($scope.levelsOfEducation, function (item) {
                    return item !== '' && item.code === $scope.customerInformationData.tertiaryQualificationCode;
                });
                $scope.studyType = _.isUndefined(levelOfEducation) ? "" : levelOfEducation.category;
                updateLevelsOfEducation($scope.studyType);
            });

            //If customer is not new to bank and therefore setup OTP preferences
            if (User.hasDashboards()) {
                $scope.serverErrorMessage = ApplicationParameters.popVariable('otpErrorMessage');
            }

            $scope.product = $routeParams.product;
            $scope.customerInformationData = CustomerInformationData.current();
            $scope.isFirstEmployment = false;
            $scope.unemploymentReason = {code: $scope.customerInformationData.unemploymentReason};
            $scope.isAdding = addStatus;
            $scope.isCustomerEmployed = $scope.customerInformationData.isEmployed();
            $scope.latestEmploymentStartDate = formattedDate(moment());
            $scope.cancelButtonText =
                new EmploymentValidation().validateSection($scope.customerInformationData) ? 'Cancel' : 'Back';

            if ($scope.isAdding) {
                $scope.isEmployed = $scope.isAdding;
            } else {
                if ($scope.customerInformationData.hasEmploymentDetails() ||
                    $scope.customerInformationData.unemploymentReason) {
                    $scope.isEmployed = $scope.isCustomerEmployed;
                } else {
                    $scope.isEmployed = undefined;
                }
            }

            var emptyEmployment = {
                endDate: '9999-12-31',
                employerName: '',
                occupationIndustryCode: '',
                occupationLevelCode: '',
                employmentStatusCode: ''
            };

            var emptyPreviousEmployment = {
                employerName: '',
                occupationIndustryCode: '',
                occupationLevelCode: '',
                employmentStatusCode: ''
            };

            var currentEmployment = $scope.customerInformationData.getCurrentEmploymentDetails();
            var previousEmployment = $scope.customerInformationData.getPreviousEmploymentDetails() ||
                emptyPreviousEmployment;

            $scope.currentEmployment = function () {
                if ($scope.isAdding) {
                    return emptyEmployment;
                }
                return currentEmployment ? currentEmployment : emptyEmployment;
            };

            $scope.previousEmployment = function () {
                if (!$scope.isAdding && $scope.isEmployed) {
                    return previousEmployment;
                }
                return currentEmployment ? currentEmployment : previousEmployment;
            };

            $scope.currentEmploymentIsLessThanAYear = function () {
                return !_.isEmpty($scope.currentEmployment().startDate) &&
                    moment().diff(moment($scope.currentEmployment().startDate), 'year') < 1;
            };

            $scope.addEmployment = function () {
                $scope.isEmployed = true;
                $scope.currentEmployment().endDate = '9999-12-31';
                $scope.unemploymentReason = {};
            };

            if (moment($scope.previousEmployment().endDate) > moment()) {
                delete $scope.previousEmployment().endDate;
            }

            //TODO: This hack needs to be removed after customer information big refactoring
            var originalCurrentEmployment = _.cloneDeep($scope.currentEmployment());

            $scope.removeEmployment = function () {
                $scope.isEmployed = false;
                _.each(['employerName', 'startDate', 'occupationIndustryCode', 'occupationLevelCode',
                        'employmentStatusCode'],
                    function (propertyName) {
                        $scope.currentEmployment()[propertyName] = originalCurrentEmployment[propertyName];
                    });
                delete $scope.currentEmployment().endDate;
            };

            $scope.getEarliestDateForCurrentEmployment = function () {
                if ($scope.customerInformationData.hasEmploymentDetails() && $scope.previousEmployment() &&
                    !_.isEmpty($scope.previousEmployment()) &&
                    !_.isEqual($scope.previousEmployment(), emptyPreviousEmployment)) {
                    var startDate = $scope.previousEmployment().startDate;
                    var dayAfterStartDate = formattedDate(moment(startDate).add(1, 'days'));
                    var endDate = $scope.previousEmployment().endDate || '9999-12-31';
                    var endDateMoment = moment(endDate, 'YYYY-MM-DD');

                    return endDateMoment > moment() || endDateMoment.isSame(startDate) ? dayAfterStartDate : endDate;
                }
                return '1900-01-01';
            };

            $scope.getLatestDateForPreviousEmployment = function () {
                if ($scope.isAdding) {
                    var yesterday = moment($scope.latestEmploymentStartDate).subtract(1, 'days');
                    return _.isEmpty($scope.currentEmployment().startDate) ? formattedDate(yesterday) :
                        $scope.currentEmployment().startDate;
                }
                return $scope.latestEmploymentStartDate;
            };

            $scope.updateLevelOfEducation = updateLevelsOfEducation;

            $scope.needPreviousEmployment = function () {
                return needPreviousEmploymentForAdd() || needPreviousEmploymentForModify();
            };

            $scope.canBeWithoutPreviousEmployment = function () {
                return $scope.currentEmploymentIsLessThanAYear() &&
                    !$scope.customerInformationData.hasEmploymentDetails();
            };

            $scope.toggleFirstEmployment = function () {
                $scope.isFirstEmployment = !$scope.isFirstEmployment;
                if ($scope.isFirstEmployment) {
                    resetPreviousEmployment();
                }
            };

            $scope.cleanPreviousEmployment = function () {
                if (!$scope.customerInformationData.hasEmploymentDetails() &&
                    !$scope.currentEmploymentIsLessThanAYear()) {
                    $scope.isFirstEmployment = false;
                    resetPreviousEmployment();
                }
            };

            $scope.canToggleEmploymentStatus = function () {
                return $scope.isCustomerEmployed || $scope.customerInformationData.hasNoEmploymentStatus();
            };

            $scope.getValidationNotification = function () {
                return CustomerInfoValidation.getValidationNotificationForSection('employment');
            };

            $scope.getLabelFor = function (text) {
                return $scope.customerInformationData.hasPreviousEmployment() ? text : text + ' *';
            };

            $scope.canSave = function () {
                if (_.isUndefined($scope.isEmployed)) {
                    return false;
                }
                return $scope.isEmployed || customerManagementV4Feature ||
                    !_.isEmpty($scope.customerInformationData.tertiaryQualificationCode);
            };

            $scope.next = function () {
                CancelConfirmationService.cancelEdit(function () {
                    $location.url('/apply/' + $scope.product + '/income');
                });
            };

            $scope.save = function () {
                if ($scope.isEmployed) {
                    $scope.customerInformationData.addEmployment($scope.previousEmployment());
                    $scope.customerInformationData.addEmployment($scope.currentEmployment());
                    delete $scope.customerInformationData.unemploymentReason;
                } else {
                    $scope.customerInformationData.unemploymentReason = $scope.unemploymentReason.code;
                }

                if (!CustomerInformationData.hasEditedEmploymentDetails()) {
                    $scope.cancel();
                    return;
                }

                var customer = _.cloneDeep($scope.customerInformationData);

                CustomerService.updateEmployment(customer).then(function () {
                    $location.path('/apply/' + $scope.product + '/employment').replace();
                }).catch(function (error) {
                    $scope.serverErrorMessage = error.message;
                    if (User.hasDashboards()) {
                        ApplicationParameters.pushVariable('otpErrorMessage', error.message);
                    }
                });
            };

            $scope.cancel = function () {
                CancelConfirmationService.cancelEdit(function () {
                    $window.history.go(-1);
                });
            };

            var unemploymentAnalyticsPrefix = $location.path() + '/';
            if (!User.hasDashboards()) {
                unemploymentAnalyticsPrefix += "New";
            }
            else if ($scope.isCustomerEmployed) {
                unemploymentAnalyticsPrefix += "Employed";
            } else {
                unemploymentAnalyticsPrefix += "Unemployed";
            }

            $scope.unemploymentAnalyticsPrefix = unemploymentAnalyticsPrefix;
        });

})();

