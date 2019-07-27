describe('Unit Test - Navigator', function () {
    beforeEach(module('clientSideFramework.navigator', function($provide){
        $provide.value('$window', {
            //TODO: Should remove addEventListener function when refactoring into a separate bower component,
            // only mocked out because of AuthenticationService.js being loaded in test scope.
            addEventListener : function () {

            },
            location :{}
        });
    }));

    var url = 'www.google.com';
    describe('When Navigator.redirect('+ url + ') is called', function () {
        it(', it should set $window.location.href to ' + url, inject(function (Navigator, $window) {
            Navigator.redirect(url);
            expect($window.location.href).toBe(url);
        }));
    });
});