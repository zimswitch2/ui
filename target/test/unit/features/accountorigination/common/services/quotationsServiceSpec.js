/*global sinon:false */

describe('QuotationsService', function () {

    beforeEach(module('refresh.accountOrigination.common.services.quotations'));

    var quotationsService, test;
    var systemPrincipal = {
        systemPrincipalIdentifier: {
            systemPrincipalId: '1',
            systemPrincipalKey: 'SBSA_BANKING'
        }
    };

    beforeEach(inject(function (_QuotationsService_, _ServiceTest_, User) {
        quotationsService = _QuotationsService_;
        test = _ServiceTest_;
        test.spyOnEndpoint('getQuotations');
        test.spyOnEndpoint('getRCPQuotationDetails');

        spyOn(User, 'principal').and.returnValue(systemPrincipal);
    }));

    describe('list', function () {

        var clock;

        beforeEach(function () {
            clock = sinon.useFakeTimers(moment('2015-12-31').toDate().getTime());
        });

        afterEach(function () {
            clock.restore();
        });

        it('should resolve with null rcp and current quotations when none are present', function () {
            test.stubResponse('getQuotations', 200, {
                quotations: []
            });

            expect(quotationsService.list()).toBeResolvedWith({
                rcp: null,
                current: null
            });
            test.resolvePromise();
        });

        it('should invoke getQuotations using the user principal', function () {
            test.stubResponse('getQuotations', 200, {quotations: []});
            quotationsService.list();

            expect(test.endpoint('getQuotations')).toHaveBeenCalledWith(systemPrincipal);
            test.resolvePromise();
        });

        it('should return latest rcp and current account quotations', function () {
            test.stubResponse('getQuotations', 200, {
                quotations: [
                    {
                        applicationNumber: 'SIB_USR 20141101110000000',
                        status: 'A',
                        productCategory: 1
                    },
                    {
                        applicationNumber: 'SATMSYST 20151110100000000',
                        status: 'A',
                        productCategory: 1
                    },
                    {
                        applicationNumber: 'SIB_USR 20151110100000000',
                        status: 'A',
                        productCategory: 1
                    },
                    {
                        applicationNumber: 'SATMSYST 20131110110000001',
                        status: 'A',
                        productCategory: 1
                    },
                    {
                        applicationNumber: 'SATMSYST 20141101110000000',
                        status: 'A',
                        productCategory: 4
                    },
                    {
                        applicationNumber: 'SATMSYST 20151110100000000',
                        status: 'A',
                        productCategory: 4
                    },
                    {
                        applicationNumber: 'SIB_USR 20151110100000000',
                        status: 'A',
                        productCategory: 4
                    },
                    {
                        applicationNumber: 'SIB_USR 20131110110000001',
                        status: 'A',
                        productCategory: 4
                    }
                ]
            });

            expect(quotationsService.list()).toBeResolvedWith({
                rcp: {
                    applicationNumber: 'SIB_USR 20151110100000000',
                    status: 'A',
                    productCategory: 4,
                    applicationDate: moment('20151110100000000', 'YYYYMMDDHHmmssSSS'),
                    aboutToExpire: true
                },
                current: {
                    applicationNumber: 'SIB_USR 20151110100000000',
                    status: 'A',
                    productCategory: 1,
                    applicationDate: moment('20151110100000000', 'YYYYMMDDHHmmssSSS'),
                    aboutToExpire: true
                }
            });
            test.resolvePromise();
        });

        it('should calculate expiry according to the current date', function () {
            test.stubResponse('getQuotations', 200, {
                quotations: [
                    {
                        applicationNumber: 'SIB_USR 20151210000000000',
                        status: 'A',
                        productCategory: 1
                    },
                    {
                        applicationNumber: 'SIB_USR 20151211000000000',
                        status: 'A',
                        productCategory: 4
                    },
                ]
            });

            expect(quotationsService.list()).toBeResolvedWith({
                rcp: {
                    applicationNumber: 'SIB_USR 20151211000000000',
                    status: 'A',
                    productCategory: 4,
                    applicationDate: moment('20151211000000000', 'YYYYMMDDHHmmssSSS'),
                    aboutToExpire: false
                },
                current: {
                    applicationNumber: 'SIB_USR 20151210000000000',
                    status: 'A',
                    productCategory: 1,
                    applicationDate: moment('20151210000000000', 'YYYYMMDDHHmmssSSS'),
                    aboutToExpire: true
                }
            });
            test.resolvePromise();
        });


        it('should ignore declined quotations ', function () {
            test.stubResponse('getQuotations', 200, {
                quotations: [
                    {
                        applicationNumber: 'SATMSYST 20141101110000000',
                        status: 'A',
                        productCategory: 1
                    },
                    {
                        applicationNumber: 'SIB_USR 20141101110000000',
                        status: 'A',
                        productCategory: 1
                    },
                    {
                        applicationNumber: 'SATMSYST 20141101110000000',
                        status: 'D',
                        productCategory: 4
                    }
                ]
            });

            expect(quotationsService.list()).toBeResolvedWith({
                rcp: null,
                current: {
                    applicationNumber: 'SIB_USR 20141101110000000',
                    status: 'A',
                    productCategory: 1,
                    applicationDate: moment('20141101110000000', 'YYYYMMDDHHmmssSSS'),
                    aboutToExpire: true
                }
            });
            test.resolvePromise();
        });


    });

    describe('getRcpQuotationDetails', function () {
        it('should return first rcp offer details object ', function () {
            test.stubResponse('getRCPQuotationDetails', 200, {
                applicationNumber: 'SATMSYST 20141101110000000',
                rcpOfferDetails: [
                    {
                        maximumLoanAmount: 5000
                    },
                    {
                        maximumLoanAmount:2000
                    }
                ]
            });

            expect(quotationsService.getRCPQuotationDetails()).toBeResolvedWith(jasmine.objectContaining({
                applicationNumber: 'SATMSYST 20141101110000000',
                rcpOfferDetails: {
                    maximumLoanAmount: 5000
                }
            }));

            test.resolvePromise();
        });
    });
});
