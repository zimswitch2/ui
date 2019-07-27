'use strict';

describe('Change password route', function () {
    beforeEach(module('refresh.changePassword'));

    it('should set up the correct route and template url', inject(function ($route) {
        expect($route.routes['/change-password']).not.toBeUndefined();
        expect($route.routes['/change-password'].templateUrl).toBe('features/security/partials/changePassword.html');
    }));
});
