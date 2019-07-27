describe('Beneficiaries', function () {
    beforeEach(module('refresh.beneficiaries.beneficiariesService','refresh.beneficiaries.beneficiariesListService','refresh.beneficiaries', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture', 'refresh.metadata', 'refresh.parameters'));

    describe('services', function () {
        var service, test, listService;

        describe('beneficiaries', function () {
            var beneficiary;

            beforeEach(function () {
                listService = jasmine.createSpyObj('BeneficiariesListService', ['clear']);
                module(function ($provide) {
                    $provide.value('BeneficiariesListService', listService);
                });
            });

            beforeEach(inject(function (_BeneficiariesService_, ServiceTest) {
                service = _BeneficiariesService_;
                test = ServiceTest;
                test.spyOnEndpoint('deleteBeneficiary');
                beneficiary = {};
            }));

            it('should invoke the delete beneficiaries service and respond with success message', function () {
                var beneficiary = { data: true };
                var card = { number: 'number'};
                var expectedRequest = { beneficiaries: [beneficiary], card: card };

                test.stubResponse('deleteBeneficiary', 200, {data: true}, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'});
                expect(service.deleteBeneficiary(beneficiary, card)).toBeResolvedWith({data: {data: true}, status: 200, headers: jasmine.any(Function)});
                test.resolvePromise();

                expect(test.endpoint('deleteBeneficiary')).toHaveBeenCalledWith(expectedRequest);
                expect(listService.clear).toHaveBeenCalled();
            });

            it('should invoke the delete beneficiaries service and respond with error message', function () {
                var beneficiary = { data: true };
                var card = { number: 'number'};
                var expectedRequest = { beneficiaries: [beneficiary], card: card };

                test.stubResponse('deleteBeneficiary', 200, {}, {'x-sbg-response-code': "1234", 'x-sbg-response-type': 'ERROR'});
                expect(service.deleteBeneficiary(beneficiary, card)).toBeRejected();
                test.resolvePromise();

                expect(test.endpoint('deleteBeneficiary')).toHaveBeenCalledWith(expectedRequest);
            });

            it('should invoke the delete beneficiaries service and respond with a generic server error message', function () {
                var beneficiary = { data: true };
                var card = { number: 'number'};
                var expectedRequest = { beneficiaries: [beneficiary], card: card };

                test.stubResponse('deleteBeneficiary', 500, {});
                expect(service.deleteBeneficiary(beneficiary, card)).toBeRejected();
                test.resolvePromise();

                expect(test.endpoint('deleteBeneficiary')).toHaveBeenCalledWith(expectedRequest);
            });
        });

    });
});
