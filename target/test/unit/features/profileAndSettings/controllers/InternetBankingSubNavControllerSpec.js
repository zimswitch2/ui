describe('InternetBankingSubNavController', function() {
    beforeEach(module('refresh.profileAndSettings', 'refresh.profileAndSettings.internetBankingSubNav'));

    var scope, serviceEndpoint, ServiceTest, viewOTPPreferenceService, route, _mock, profilesAndSettingsMenu,controller;

    var emailDeliveryMethod = {
        "deliveryMethod": "E",
        "emailAddr": "me@mail.co.za",
        "cellNum": null
    };

    var cellNumDeliveryMethod = {
        "deliveryMethod": "SMS",
        "emailAddr": null,
        "cellNum": "0612345678"
    };

    var emptyDeliveryMethod = {

    };

    function getOTPPreferenceMock(otpPreference) {
        viewOTPPreferenceService.getOTPPreference.and.returnValue(_mock.resolve(otpPreference));
    }

    function initializeController() {
        controller('InternetBankingSubNavController', {
            $scope: scope,
            ProfilesAndSettingsMenu: profilesAndSettingsMenu,
            ViewOTPPreferenceService: viewOTPPreferenceService});
        scope.$digest();
    }
    beforeEach(inject(function($rootScope, $controller, _ServiceTest_, mock, $route) {
        scope = $rootScope.$new();
        controller = $controller;
        _mock = mock;
        ServiceTest = _ServiceTest_;
        serviceEndpoint = ServiceTest.spyOnEndpoint('getOTPPreference');

        viewOTPPreferenceService = jasmine.createSpyObj('service', ['getOTPPreference']);
        getOTPPreferenceMock(emailDeliveryMethod);
        profilesAndSettingsMenu = jasmine.createSpyObj('ProfilesAndSettingsMenu', ['getMenu']);
        profilesAndSettingsMenu.getMenu.and.returnValue([
            {}
        ]);
        route = $route;
    }));


    describe('when landing on the security settings view', function () {
        it('should use the correct controller ', function () {
            expect(route.routes['/internet-banking'].controller).toEqual('InternetBankingSubNavController');
        });

        it('should use the correct template ', function () {
            expect(route.routes['/internet-banking'].templateUrl).toEqual('features/profileAndSettings/partials/internetBanking.html');
        });
    });

    describe('when loading menuItems', function () {
        it('should set the menuItems list ', function () {
            initializeController();
            expect(scope.menuItems.length> 0).toBeTruthy();
        });
    });

    describe('When loading view otp preference details', function() {
        var expectedResponse;
        beforeEach(function() {
            expectedResponse = {
                cellNum:"0612345678",
                emailAddr: null,
                deliveryMethod: "SMS"
            };

            var expectedHeaders = {
                "x-sbg-response-type": "SUCCESS",
                "x-sbg-response-code": "0000"
            };

            ServiceTest.stubResponse('getOTPPreference', 200, expectedResponse, expectedHeaders);
            ServiceTest.resolvePromise();
        });

        it('the values should be returned from ViewOTPPreferenceService', function() {

            initializeController();
            scope.deliveryMethod = "Email";
            scope.emailAddr = "me@mail.co.za";
            expect(scope.viewOTPPreference.deliveryMethod).toEqual(scope.deliveryMethod);
            expect(scope.viewOTPPreference.contact).toEqual(scope.emailAddr);
            expect(scope.showOTPPreference).toBeTruthy();
        });

        it('the values should be returned from ViewOTPPreferenceService', function() {

            getOTPPreferenceMock(cellNumDeliveryMethod);
            initializeController();
            scope.deliveryMethod = "SMS";
            scope.cellNum = "0612345678";
            expect(scope.viewOTPPreference.deliveryMethod).toEqual(scope.deliveryMethod);
            expect(scope.viewOTPPreference.contact).toEqual(scope.cellNum);
            expect(scope.showOTPPreference).toBeTruthy();
        });

        it('should not have opt preference', function () {
            getOTPPreferenceMock(emptyDeliveryMethod);
            initializeController();
            expect(scope.showOTPPreference).toBeFalsy();
        });

        it('should set error on scope if service has error', function () {
            viewOTPPreferenceService.getOTPPreference.and.returnValue(_mock.reject({message: 'this is an error'}));
            initializeController();
            expect(scope.errorMessage).toBeDefined();
        });

    });
});