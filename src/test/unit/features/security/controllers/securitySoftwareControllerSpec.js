describe('SecuritySoftwareController', function(){
   beforeEach(module('refresh.security-software.controller'));

    describe('download trusteer security software', function(){
        var scope;

        beforeEach(inject(function($rootScope, $controller){
            scope = $rootScope.$new();

            $controller('SecuritySoftwareController', {
                $scope: scope
            });
        }));

        it('should detect a mac user', function(){
            scope.platform = "Mac";
            var macDownloadLink = 'http://download.trusteer.com/Xybsry2Bk/leopard/Rapport.dmg';
            expect(scope.securityDownloadLink()).toEqual(macDownloadLink);
        });

        it('should detect a windows user', function(){
            scope.platform = "Win";
            var windowsDownloadLink = 'http://download.trusteer.com/Xybsry2Bk/RapportSetup.exe';
            expect(scope.securityDownloadLink()).toEqual(windowsDownloadLink);
        });

        it('should detect a non-windows/non-mac user', function(){
            scope.platform = "Linux";
            var defaultLink = '#';
            expect(scope.securityDownloadLink()).toEqual(defaultLink);
        });
    });
});