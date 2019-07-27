(function (app) {
    'use strict';

    app.directive('flow', function (Flow) {
        return {
            restrict: 'EA',
            templateUrl: 'common/flow/partials/flow.html',
            scope: {},
            link: function ($scope) {
                $scope.flow = Flow.instance();
            }
        };
    });

    app.factory('Flow', function ($location, DigitalId, QueryStringUtility, Navigator) {
        var _flow = {steps: []};

        return {
            instance: function () {
                return _flow;
            },
            get: function () {
                return _.cloneDeep(_flow);
            },
            steps: function () {
                return _.cloneDeep(_flow.steps);
            },
            currentStep: function () {
                return _.where(_.cloneDeep(_flow.steps), {current: true})[0];
            },
            getHeaderName: function () {
                return _flow.headerName;
            },
            next: function () {
                var step = _.find(_flow.steps, {current: true});
                step.current = false;
                step.complete = true;

                var nextStep = _.find(_flow.steps, {complete: false});
                if (nextStep) {
                    nextStep.current = true;
                } else {
                    step.current = true;
                }
            },
            modify: function (stepName, newStepName) {
                var currentStep = this.currentStep();
                var modifyStep = {};
                var currentIndex = 0;

                if(_.isEqual(currentStep.name, stepName)) {
                    modifyStep = currentStep;
                } else {
                    modifyStep = {
                        name: stepName,
                        complete: false,
                        current: false
                    };
                }
                _.each(_flow.steps, function (data, localIndex) {
                    if (_.isEqual({name: data.name, complete: data.complete, current: data.current }, modifyStep)) {
                        currentIndex = localIndex;
                        return;
                    }
                });

                var indexedStep =_flow.steps[currentIndex];

                if(_.isEqual({name: indexedStep.name, complete: indexedStep.complete, current: indexedStep.current}, modifyStep)) {
                    _flow.steps[currentIndex] = {name: newStepName, complete: modifyStep.complete, current: modifyStep.current};
                }
            },
            previous: function () {
                _flow.steps.reverse();
                var step = _.find(_flow.steps, {current: true}) || {};
                step.complete = false;
                step.current = false;

                var previousStep = _.find(_flow.steps, {complete: true});
                if (previousStep) {
                    previousStep.current = true;
                    previousStep.complete = false;
                } else {
                    step.current = true;
                }

                _flow.steps.reverse();
            },
            create: function (steps, headerName, cancelUrl, cancelable) {
                _flow.steps = _.map(steps, function (step) {
                    return {name: step, complete: false, current: false};
                });
                var step = _flow.steps[0];
                if (step) {
                    step.current = true;
                }

                _flow.headerName = headerName;

                if (DigitalId.isAuthenticated()) {
                    _flow.cancelUrl = cancelUrl || '/transaction/dashboard';
                }else{
                    _flow.cancelUrl = cancelUrl || '/login';
                }

                _flow.cancelable = cancelable === undefined ? true : cancelable;
                return this;
            },
            cancel: function () {
                var referrer = decodeURIComponent(QueryStringUtility.getParameter('referer'));

                if ((referrer !== 'undefined')) {
                    Navigator.redirect(referrer);
                } else {
                    $location.path(_flow.cancelUrl).replace();
                }
            },
            cancelable: function () {
                return _flow.cancelable;
            },
            destroy: function () {
                _.flow.headerName = undefined;
                _flow = {steps: []};
            }
        };
    });

    app.factory('ViewModel', function (ErrorMessages) {
        var _viewModel = {};
        var _error = null;
        var _modifying = false;

        return {
            error: function (serviceError) {
                _error = ErrorMessages.messageFor(serviceError);
            },
            current: function (viewModel) {
                if (viewModel) {
                    _viewModel = _.omit(_.cloneDeep(viewModel), 'error');
                } else {
                    return _viewModel;
                }
            },
            initial: function () {
                if (_error) {
                    var initialViewModel = _.cloneDeep(_viewModel);
                    initialViewModel.error = _error;
                    _error = null;
                    return initialViewModel;
                } else if (_modifying) {
                    _modifying = false;
                    return _viewModel;
                } else {
                    _viewModel = {};
                    return {};
                }
            },
            modifying: function () {
                _modifying = true;
            },
            isInitial: function () {
                return _.isEmpty(_viewModel);
            }
        };
    });

})(angular.module('refresh.flow', ['refresh.errorMessages', 'refresh.digitalId', 'clientSideFramework.navigator',
    'clientSideFramework.urlUtilities.queryStringUtilitySpec']));
