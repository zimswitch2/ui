describe('secure message results controller', function () {
    'use strict';

    beforeEach(module('refresh.secure.message.results'));

    var scope, viewModel, controller, route, applicationParameters;

    beforeEach(inject(function ($controller, $rootScope, $route, ViewModel) {
        controller = $controller;
        scope = $rootScope.$new();
        route = $route;
        viewModel = ViewModel;
        applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['getVariable']);
    }));

    var initializeController = function () {
        controller('SecureMessageResultsController', {
            $scope: scope,
            ViewModel: viewModel,
            ApplicationParameters: applicationParameters
        });
        scope.$digest();
    };

    it('should set secure message from view model', function () {
        viewModel.current({secureMessage: {key: 'value'}});
        initializeController();
        expect(scope.secureMessage).toEqual({key: 'value'});
    });

    it('should have a message to display and a boolean value for the css animation on notification directive', function () {
        initializeController();
        expect(scope.successMessage).toEqual('Secure message was successfully sent');
        expect(scope.isSuccessful).toBeTruthy();
    });

    it('should have hasInfo set to true', function () {
        initializeController();
        expect(scope.hasInfo).toBeTruthy();
    });

    it('should set current date with latest timestamp from server', function () {
        applicationParameters.getVariable.and.returnValue('some date');
        initializeController();
        expect(applicationParameters.getVariable).toHaveBeenCalledWith('latestTimestampFromServer');
        expect(scope.currentDate).toBe('some date');
    });

    describe('routing', function () {
        it('when secure message is present in the model should allow access', function () {
            viewModel.current({secureMessage: {}});
            var secureMessageRoute = route.routes['/secure-message/results'];
            expect(secureMessageRoute.controller).toEqual('SecureMessageResultsController');
            expect(secureMessageRoute.allowedFrom[0].condition(viewModel)).toBeTruthy();
        });

        it('when no secure message is present in the model should not allow access', function () {
            viewModel.current({});
            var secureMessageRoute = route.routes['/secure-message/results'];
            expect(secureMessageRoute.controller).toEqual('SecureMessageResultsController');
            expect(secureMessageRoute.allowedFrom[0].condition(viewModel)).toBeFalsy();
        });
    });
});
