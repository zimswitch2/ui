describe('services', function () {
    beforeEach(module('refresh.beneficiaries.beneficiariesService'));
    var service, test, listService;
    describe('beneficiaries', function () {
        var beneficiary;

        beforeEach(function () {
            listService = jasmine.createSpyObj('BeneficiariesListService', ['clear']);
            module(function ($provide) {
                $provide.value('BeneficiariesListService', listService);
            });
        });

        beforeEach(inject(function (_BeneficiariesService_, _ServiceTest_) {
            service = _BeneficiariesService_;
            test = _ServiceTest_;
            test.spyOnEndpoint('changeBeneficiaryGroupMembership');
            test.spyOnEndpoint('addOrUpdateBeneficiary');
            beneficiary = {};
        }));

        describe('add', function () {
            var beneficiary, card, expectedRequest;
            beforeEach(function () {
                beneficiary = { data: true };
                card = { number: 'number'};
                expectedRequest = { beneficiaries: [beneficiary], card: card };
            });

            it('should invoke the add beneficiaries service and respond with a success message', function () {
                test.stubResponse('addOrUpdateBeneficiary', 200, { data: true }, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'});
                expect(service.addOrUpdate(beneficiary, card)).toBeResolvedWith({data: {data: true}, status: 200, headers: jasmine.any(Function)});
                test.resolvePromise();

                expect(test.endpoint('addOrUpdateBeneficiary')).toHaveBeenCalledWith(expectedRequest);
                expect(listService.clear).toHaveBeenCalled();
            });

            it('should invoke the add beneficiaries service and respond with an error message', function () {
                test.stubResponse('addOrUpdateBeneficiary', 200, {}, {'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "9999"});
                expect(service.addOrUpdate(beneficiary, card)).toBeRejectedWith({message: 'An error has occurred'});
                test.resolvePromise();

                expect(test.endpoint('addOrUpdateBeneficiary')).toHaveBeenCalledWith(expectedRequest);
            });

            it('should invoke the add beneficiaries service and respond with the correct error message for 2308', function () {
                test.stubResponse('addOrUpdateBeneficiary', 200, {}, {'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "2308"});
                expect(service.addOrUpdate(beneficiary, card)).toBeRejectedWith({message: 'Please enter a valid account number'});
                test.resolvePromise();

                expect(test.endpoint('addOrUpdateBeneficiary')).toHaveBeenCalledWith(expectedRequest);
            });

            it('should invoke the add beneficiaries service and respond with the correct error message for 2311', function () {
                test.stubResponse('addOrUpdateBeneficiary', 200, {}, {'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "2311"});
                expect(service.addOrUpdate(beneficiary, card)).toBeRejectedWith({message: 'Please enter a valid account number'});
                test.resolvePromise();

                expect(test.endpoint('addOrUpdateBeneficiary')).toHaveBeenCalledWith(expectedRequest);
            });

            it('should invoke the add beneficiaries service and respond with the correct error message for 2318', function () {
                test.stubResponse('addOrUpdateBeneficiary', 200, {}, {'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "2318"});
                expect(service.addOrUpdate(beneficiary, card)).toBeRejectedWith({message: 'This beneficiary is already listed in our directory. To add this beneficiary, search for it below'});
                test.resolvePromise();

                expect(test.endpoint('addOrUpdateBeneficiary')).toHaveBeenCalledWith(expectedRequest);
            });

            it('should invoke the add beneficiaries service and respond with the correct error message for 2202', function () {
                test.stubResponse('addOrUpdateBeneficiary', 200, {}, {'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "2202"});
                expect(service.addOrUpdate(beneficiary, card)).toBeRejectedWith({message: 'Please enter a valid beneficiary reference'});
                test.resolvePromise();

                expect(test.endpoint('addOrUpdateBeneficiary')).toHaveBeenCalledWith(expectedRequest);
            });

            it('should invoke the add beneficiaries service and respond with the correct error message for 7545', function () {
                test.stubResponse('addOrUpdateBeneficiary', 200, {}, {'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "7545"});
                expect(service.addOrUpdate(beneficiary, card)).toBeRejectedWith({message: 'Please enter a valid notification email address'});
                test.resolvePromise();

                expect(test.endpoint('addOrUpdateBeneficiary')).toHaveBeenCalledWith(expectedRequest);
            });

            it('should invoke the add beneficiaries service and respond with a generic server error message', function () {
                test.stubResponse('addOrUpdateBeneficiary', 500, {}, {});
                expect(service.addOrUpdate(beneficiary, card)).toBeRejectedWith({message: 'An error has occurred'});
                test.resolvePromise();

                expect(test.endpoint('addOrUpdateBeneficiary')).toHaveBeenCalledWith(expectedRequest);
            });
        });

        it('should invoke the add multiple beneficiaries service and respond with success message', function () {
            var beneficiaries = [
                { data: true }
            ];
            var card = { number: 'number'};
            var expectedRequest = { beneficiaries: beneficiaries, card: card };

            test.stubResponse('changeBeneficiaryGroupMembership', 200, {data: true}, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'});
            expect(service.changeBeneficiaryGroupMembership(beneficiaries, card)).toBeResolvedWith({data: {data: true}, status: 200, headers: jasmine.any(Function)});
            test.resolvePromise();

            expect(test.endpoint('changeBeneficiaryGroupMembership')).toHaveBeenCalledWith(expectedRequest);
            expect(listService.clear).toHaveBeenCalled();
        });

        it('should invoke the add multiple beneficiaries service and respond with error message', function () {
            var beneficiaries = [
                { data: true }
            ];
            var card = { number: 'number'};
            var expectedRequest = { beneficiaries: beneficiaries, card: card };

            test.stubResponse('changeBeneficiaryGroupMembership', 200, {}, {'x-sbg-response-code': "9999", 'x-sbg-response-type': 'ERROR'});
            expect(service.changeBeneficiaryGroupMembership(beneficiaries, card)).toBeRejectedWith({message: 'An error has occurred'});
            test.resolvePromise();

            expect(test.endpoint('changeBeneficiaryGroupMembership')).toHaveBeenCalledWith(expectedRequest);
        });

        it('should invoke the add multiple beneficiaries service and respond with a generic error message', function () {
            var beneficiaries = [
                { data: true }
            ];
            var card = { number: 'number'};
            var expectedRequest = { beneficiaries: beneficiaries, card: card };

            test.stubResponse('changeBeneficiaryGroupMembership', 200, {}, {'x-sbg-response-code': "1235", 'x-sbg-response-type': 'ERROR'});
            expect(service.changeBeneficiaryGroupMembership(beneficiaries, card)).toBeRejectedWith({message: 'An error has occurred'});
            test.resolvePromise();

            expect(test.endpoint('changeBeneficiaryGroupMembership')).toHaveBeenCalledWith(expectedRequest);
        });

        it('should invoke the add multiple beneficiaries service and respond with generic server error message', function () {
            var beneficiaries = [
                { data: true }
            ];
            var card = { number: 'number'};
            var expectedRequest = { beneficiaries: beneficiaries, card: card };

            test.stubResponse('changeBeneficiaryGroupMembership', 500, {});
            expect(service.changeBeneficiaryGroupMembership(beneficiaries, card)).toBeRejectedWith({message: 'An error has occurred'});
            test.resolvePromise();

            expect(test.endpoint('changeBeneficiaryGroupMembership')).toHaveBeenCalledWith(expectedRequest);
        });
    });
});
