describe('Unit Test - QueryParameterUtilitySpec', function () {
    beforeEach(module('clientSideFramework.urlUtilities.queryStringUtilitySpec'));

    var queryString1 = '?referer=monkey',
        queryString2 = '?car=monkey';

    beforeEach(module(function ($provide) {
        $provide.value('$window', {
            //TODO: Should remove addEventListener function when refactoring into a separate bower component,
            // only mocked out because of AuthenticationService.js being loaded in test scope.
            addEventListener: function () {
            },

            location: {}
        });
    }));


    describe('When getParameter() is called', function () {
        var QueryStringUtility, $window;

        beforeEach(inject(function (_QueryStringUtility_, _$window_) {
            QueryStringUtility = _QueryStringUtility_;
            $window = _$window_;
        }));

        describe('Given the queryString ' + queryString1, function () {
            it(', it should return the requested parameter', function () {
                $window.location.search = queryString1;
                expect(QueryStringUtility.getParameter('referer')).toBeTruthy();
            });
        });
        describe('Given the queryString ' + queryString2, function () {
            it(', it should return the requested parameter', function () {
                $window.location.search = queryString2;
                expect(QueryStringUtility.getParameter('referer')).toBeFalsy();
            });
        });
    });
});