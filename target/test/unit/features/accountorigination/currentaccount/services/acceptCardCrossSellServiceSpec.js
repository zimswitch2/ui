describe('AcceptCardCrossSellService', function () {
    'use strict';

    var test, service;

    beforeEach(module('refresh.accountOrigination.currentAccount.services.acceptCardCrossSellService'));

    beforeEach(inject(function (User, ServiceTest, AcceptCardCrossSellService) {
        spyOn(User, 'principal');
        User.principal.and.returnValue({
            systemPrincipalIdentifier: {
                systemPrincipalId: '1',
                systemPrincipalKey: 'SBSA_BANKING'
            }
        });

        test = ServiceTest;
        test.spyOnEndpoint('acceptCardCrossSell');
        service = AcceptCardCrossSellService;
    }));

    describe('acceptCardCrossSell', function () {

        describe('success', function () {
            beforeEach(function () {
                test.stubResponse('acceptCardCrossSell', 200, {
                    timestamp: '2014-08-13T09:08:40.424+02:00',
                    accountNumber: 0
                }, {
                    'x-sbg-response-type': 'SUCCESS',
                    'x-sbg-response-code': '0000'
                });
            });

            it('should call the endpoint', function () {
                service.accept('SATMSYST 20140820141510001', 123, 2508);
                expect(test.endpoint('acceptCardCrossSell')).toHaveBeenCalledWith({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '1',
                        systemPrincipalKey: 'SBSA_BANKING'
                    },
                    productNumber: 123,
                    selectedOffer: 1,
                    preferredBranch: 2508,
                    applicationNumber: 'SATMSYST 20140820141510001'
                });
            });

            it('should resolve with the service response', function () {
                expect(service.accept('SATMSYST 20140820141510001', 123, 2508)).toBeResolvedWith(jasmine.objectContaining({
                    timestamp: '2014-08-13T09:08:40.424+02:00',
                    accountNumber: 0
                }));
                test.resolvePromise();
            });
        });

        describe('failure', function () {
            beforeEach(function () {
                test.stubResponse('acceptCardCrossSell', 204, {}, {
                    'X-Sbg-Response-Type': 'ERROR'
                });
            });

            it('should resolve with the service response', function () {
                expect(service.accept('SATMSYST 20140820141510001', 123, 2508)).toBeRejected();
                test.resolvePromise();
            });
        });
    });
});