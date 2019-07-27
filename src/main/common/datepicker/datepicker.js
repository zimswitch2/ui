(function (app) {
    'use strict';

    app.directive('viewDateFormat', function (dateFormatFilter) {
        return {
            require: '?ngModel',
            restrict: "A",
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$formatters.push(function (valueFromModel) {
                    return dateFormatFilter(valueFromModel);
                });
            }
        };
    });

    app.directive('sbDatepicker', function ($document, $compile, formTrackerService) {
        var clickedOutsideOfPickerOrInputBox = function (element, event) {
            var picker = element.find('.datepicker')[0];
            var input = element.find('input')[0];

            return !picker.contains(event.target) && !input.contains(event.target);
        };

        return {
            require: '?ngModel',
            templateUrl: 'common/datepicker/partials/datepicker.html',
            link: function (scope, element, attributes) {
                scope.dateFormat = attributes['dateFormat'];

                if (attributes['viewDefaultDateFormat']) {
                    var input = angular.element(element).find('input');
                    input.attr('view-date-format', 'view-date-format');
                    input.replaceWith($compile(input[0].outerHTML)(scope));
                }

                var clickingOutsideHandler = function (event) {
                    if (clickedOutsideOfPickerOrInputBox(element, event)) {
                        scope.hidePicker();
                        scope.$apply();
                    }
                };

                var pressTabKeyHander = function (event) {
                    if (event.which === 9) { // tab key
                        scope.hidePicker();
                        scope.$apply();
                    }
                };

                var clickedOnCalendar = function(element, event) {
                    return element.find('.dates')[0].contains(event.target);
                };

                element.bind('click', function(event) {
                    if(clickedOnCalendar(element, event)) {
                        formTrackerService.triggerChangeOn(element.find('input')[0]);
                    }
                });

                $document.on('click', clickingOutsideHandler);
                element.find('input').on('keydown', pressTabKeyHander);

                scope.$watch('ngDisabled', function () {
                    element.find('input').prop('disabled', scope.ngDisabled);
                });

                scope.$on('$destroy', function () {
                    $document.off('click', clickingOutsideHandler);
                    element.find('input').off('keydown', pressTabKeyHander);
                });
            },
            controller: 'DatepickerController',
            restrict: "E",
            scope: {
                ngModel: '=',
                ngDisabled: '=',
                onSelect: '&',
                earliestDate: '@',
                latestDate: '@',
                skipYear: '@',
                isDateOfBirth: '@',
                name: '@'
            }
        };
    });

    app.controller('DatepickerController', function ($scope) {
        var NUMBER_OF_DISPLAYED_DATES = 42;

        if ($scope.isDateOfBirth) {
            var currentYear = parseInt(moment().format('YYYY'));
            $scope.availableYears = [];
            for (var year = 1900; year <= currentYear; year++) {
                $scope.availableYears.push(year.toString());
            }
        }

        function getSelectedMonth(latestDate) {
            var latestDateMoment = moment(latestDate);
            var currentMoment = moment();
            if (latestDateMoment.isValid() && latestDateMoment <= currentMoment) {
                return latestDateMoment;
            }
            return currentMoment;
        }

        $scope.year = function () {
            return $scope.selectedMonth.format('YYYY');
        };

        $scope.month = function () {
            return $scope.selectedMonth.format('MMMM');
        };

        function addToAvailableYears() {
            var year = $scope.selectedMonth.year().toString();
            if ($scope.isDateOfBirth && $scope.availableYears.indexOf(year) < 0) {
                $scope.availableYears.push(year);
                $scope.availableYears.sort();
            }
        }

        if ($scope.skipYear) {
            $scope.nextYear = function () {
                $scope.selectedMonth = $scope.selectedMonth.add('year', 1).clone();
                addToAvailableYears();
            };

            $scope.previousYear = function () {
                $scope.selectedMonth = $scope.selectedMonth.subtract('year', 1).clone();
                addToAvailableYears();
            };
        }

        $scope.selectYear = function () {
            $scope.selectedMonth = $scope.selectedMonth.year(parseInt($scope.selectedYear)).clone();
        };

        $scope.nextMonth = function () {
            $scope.selectedMonth = $scope.selectedMonth.add('month', 1).clone();
            addToAvailableYears();
        };

        $scope.previousMonth = function () {
            $scope.selectedMonth = $scope.selectedMonth.subtract('month', 1).clone();
            addToAvailableYears();
        };

        $scope.selectDate = function (date) {
            if ($scope.isValid(date)) {
                $scope.ngModel = $scope.dateFormat ? date.format($scope.dateFormat) : date;
                $scope.hidePicker();
                $scope.onSelect({date: date});
            }
        };

        $scope.isWeekend = function (date) {
            return date.weekday() === 0 || date.weekday() === 6;
        };

        $scope.isValid = function (date) {
            if (!$scope.earliestDate && !$scope.latestDate) {
                return true;
            } else if (!$scope.earliestDate) {
                return !date.isAfter($scope.latestDate);
            } else if (!$scope.latestDate) {
                return !date.isBefore($scope.earliestDate);
            } else {
                return !date.isBefore($scope.earliestDate) && !date.isAfter($scope.latestDate);
            }
        };

        $scope.showPicker = function () {
            $scope.selecting = true;
        };

        $scope.hidePicker = function () {
            $scope.selecting = false;
        };

        $scope.dateClass = function (date) {
            if (!$scope.isValid(date)) {
                return 'invalid';
            }
            if (date.isSame($scope.ngModel)) {
                return 'selected';
            }
            if (date.month() !== $scope.selectedMonth.month()) {
                return 'different-month';
            }
            if ($scope.isWeekend(date)) {
                return 'weekend';
            }
            return '';
        };

        var _dates = [];

        $scope.dates = function () {
            return _dates;
        };

        $scope.$watch('latestDate', function (newLatestDate) {
            $scope.selectedMonth = getSelectedMonth(newLatestDate);
        });

        $scope.$watch('selectedMonth', function (newMonth) {
            $scope.selectedYear = $scope.selectedMonth.format('YYYY');
            var _month = newMonth.clone();
            while (_dates.length > 0) {
                _dates.pop();
            }
            var calendarDate = _month.date(1).subtract('days', _month.date(1).day());
            for (var i = 0; i < NUMBER_OF_DISPLAYED_DATES; i++) {
                _dates.push({moment: calendarDate.clone().startOf('day'), date: calendarDate.date()});
                calendarDate.add('days', 1);
            }
        });

        $scope.earliestDate = $scope.earliestDate ? moment($scope.earliestDate).startOf('day') : undefined;
        $scope.latestDate = $scope.latestDate ? moment($scope.latestDate).endOf('day') : undefined;
        $scope.selectedMonth = getSelectedMonth($scope.latestDate);
    });
})(angular.module('refresh.datepicker', ['refresh.filters', 'refresh.formtracker']));
