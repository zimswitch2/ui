describe('DigitalId', function () {
    var rootScope, digitalId, ipCookie;
    beforeEach(module('refresh.digitalId'));

    beforeEach(inject(function ($rootScope, DigitalId, _ipCookie_) {
        rootScope = $rootScope;
        digitalId = DigitalId;
        ipCookie = _ipCookie_;

        spyOn(rootScope, '$broadcast');
        spyOn(ipCookie, 'remove');
    }));

    describe('on authenticate', function () {
        it('should broadcast that user has been logged in', function () {
            digitalId.authenticate('dummy', 'dummy');
            expect(rootScope.$broadcast).toHaveBeenCalledWith('loggedIn');
        });

        it('should know that the user has authenticated', function () {
            digitalId.authenticate('dummy', 'dummy');
            expect(digitalId.isAuthenticated()).toBeTruthy();
        });

        it('should know the current digital ID', function () {
            digitalId.authenticate('dummy', 'Dummy');
            expect(digitalId.current()).toEqual({
                username: 'dummy',
                preferredName: 'Dummy'
            });
        });
    });

    describe('on remove', function () {
        it('should broadcast that user has been logged out', function () {
            digitalId.remove();
            expect(rootScope.$broadcast).toHaveBeenCalledWith('loggedOut');
        });

        it('should remove "x-sbg-token" from the cookies', function () {
            digitalId.remove();
            expect(ipCookie.remove).toHaveBeenCalledWith('x-sbg-token');
        });

        it('should know that the user has authenticated', function () {
            digitalId.remove();
            expect(digitalId.isAuthenticated()).toBeFalsy();
        });
    });

    describe('when getting new instance', function () {
        it('should return the correct digital ID object', function () {
            expect(digitalId.newInstance('dummy', 'password')).toEqual({
                digitalId: {
                    username: 'dummy',
                    password: 'password',
                    systemPrincipals: []
                }
            });
        });
    });
});
