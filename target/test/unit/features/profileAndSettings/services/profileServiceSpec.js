describe('Unit test for profile service', function () {
    'use strict';

    var ProfileService;
    var ServiceTest;

    beforeEach(module('refresh.profileAndSettings.profileService','refresh.test'));

    beforeEach(inject(function (_ProfileService_,_ServiceTest_) {
        ProfileService = _ProfileService_;
        ServiceTest = _ServiceTest_;
    }));

    describe('de linking a dashboard', function () {

        var deleteDashboardEndpoint;
        var dashboardIdToBeDeleted;
        var cardNumberToBeDelinked;
        var cardStatusToBeDelinked;
        var endpointSpy;
        var errorMessage;

        beforeEach(function () {
            deleteDashboardEndpoint = 'deleteDashboard';
            dashboardIdToBeDeleted = 'Some dashboard id to be deleted';
            cardNumberToBeDelinked = '1234567890123456';
            cardStatusToBeDelinked = '1234';
            endpointSpy = ServiceTest.spyOnEndpoint(deleteDashboardEndpoint);
            errorMessage = 'We are experiencing technical problems. Please try again later';
        });

        it('should call the service endpoint with an object containing the dashboard id passed',function(){
            ServiceTest.stubResponse(deleteDashboardEndpoint, 200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            var promise = ProfileService.deleteDashboard(dashboardIdToBeDeleted, cardNumberToBeDelinked, cardStatusToBeDelinked);

            expect(promise).toBeResolved();

            expect(endpointSpy).toHaveBeenCalledWith({profileId:dashboardIdToBeDeleted, cardNumber: cardNumberToBeDelinked, statusCode: cardStatusToBeDelinked});
            ServiceTest.resolvePromise();
        });

        it('should reject when header response has error', function () {
            ServiceTest.stubResponse(deleteDashboardEndpoint, 200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'ERROR'
            });

            var promise = ProfileService.deleteDashboard(dashboardIdToBeDeleted, cardNumberToBeDelinked, cardStatusToBeDelinked);

            expect(promise).toBeRejectedWith(errorMessage);
            ServiceTest.resolvePromise();
        });

        it('should reject when there is an error', function () {
            ServiceTest.stubResponse(deleteDashboardEndpoint, 404);

            var promise = ProfileService.deleteDashboard(dashboardIdToBeDeleted, cardNumberToBeDelinked, cardStatusToBeDelinked);

            expect(promise).toBeRejected();
            expect(promise).toBeRejectedWith(errorMessage);
            ServiceTest.resolvePromise();
        });
    });
});