describe('Trusteer crazy function on window', function () {

    it('should get undefined when not authenticated', function () {
        spyOn(angular, 'element');
        angular.element.and.returnValue({
            injector: function () {
                return {
                    get: function (name) {
                        if (name !== 'User') {
                            return { fail: true };
                        } else {
                            return undefined;
                        }
                    }
                };
            }
        });

        expect(window.xvbGGNadCs()).toEqual( { p: undefined } );
    });

    it('should get username from user profile when authenticated', function () {
        spyOn(angular, 'element');
        angular.element.and.returnValue({
            injector: function () {
                return {
                    get: function (name) {
                        if (name !== 'User') {
                            return { fail: true };
                        } else {
                            return {
                                userProfile: {
                                    username: 'jonny'
                                }
                            };
                        }
                    }
                };
            }
        });

        expect(window.xvbGGNadCs()).toEqual( { p: 'jonny' } );
    });
});