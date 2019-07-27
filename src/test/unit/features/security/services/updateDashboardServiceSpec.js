describe('Unit Test - Update dashboard service', function () {
    'use strict';

    beforeEach(module('refresh.updateDashboard.service', 'refresh.test'));

    var updateDashboardService, test, _mock_, updateDashboardNameData;

    beforeEach(inject(function (ServiceTest, UpdateDashboardService, mock) {
        updateDashboardService = UpdateDashboardService;
        test = ServiceTest;
        _mock_ = mock;

        updateDashboardNameData = {
            "channelProfile": {
                "image": "",
                "profileId": "44532",
                "profileName": "new dashboard name",
                "profileStyle": "PERSONAL",
                "systemPrincipalIdentifiers": [
                    {
                        "systemPrincipalId": "246",
                        "systemPrincipalKey": "SBSA_BANKING"
                    }
                ],
                "tileViews": []
            }
        };

        test.spyOnEndpoint('updateDashboard');
    }));

    describe('update dashboard name', function () {

        it('should resolve with success and data from service endpoint', function () {
            test.stubResponse('updateDashboard', 200, updateDashboardNameData, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            expect(updateDashboardService.updateDashboardName(updateDashboardNameData)).toBeResolvedWith({
                success: true,
                data: updateDashboardNameData
            });
            expect(test.endpoint('updateDashboard')).toHaveBeenCalledWith(updateDashboardNameData);
            test.resolvePromise();
        });

        it('should resolve with error and message from service endpoint when theres an error in header', function () {
            test.stubResponse('updateDashboard', 200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something went wrong'
            });

            expect(updateDashboardService.updateDashboardName(updateDashboardNameData)).toBeResolvedWith({
                success: false,
                message: 'Something went wrong'
            });

            test.resolvePromise();
        });

        it('should reject with generic error message', function () {
            test.stubRejection('updateDashboard', 204, {}, {});

            expect(updateDashboardService.updateDashboardName(updateDashboardNameData)).toBeResolvedWith({
                success: false,
                message: 'Dashboard name could not be saved. Check your network connection.'
            });

            test.resolvePromise();
        });

    });
});