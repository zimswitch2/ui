describe('Principal', function() {
    var principal;

    beforeEach(module('refresh.principal'));

    beforeEach(inject(function(Principal) {
        principal = Principal;
    }));

    describe('newInstance', function() {
        it('should return principal with given id and key', function() {
            expect(principal.newInstance(1234567890, 'SBSA_BANKING')).toEqual({
                systemPrincipalIdentifier: {
                    systemPrincipalId: 1234567890,
                    systemPrincipalKey: 'SBSA_BANKING'
                }
            });
        });
    });
});