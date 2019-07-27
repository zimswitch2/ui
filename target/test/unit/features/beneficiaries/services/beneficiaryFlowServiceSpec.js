describe('beneficiaries flow service', function () {
    beforeEach(module('refresh.beneficiaries.beneficiariesFlowService'));

    var service, card, location, mock, flow, beneficiariesState, parameterService, expectedSteps, beneficiaryFlowsService, listService;

    beforeEach(function () {
        listService = jasmine.createSpyObj('BeneficiariesListService', ['clear']);
        module(function ($provide) {
            $provide.value('BeneficiariesListService', listService);
        });
    });

    beforeEach(inject(function ($controller, _mock_, Flow, BeneficiariesState, ApplicationParameters, BeneficiaryFlowService, Card) {
        service = jasmine.createSpyObj('service', ['add']);
        beneficiariesState = BeneficiariesState;
        parameterService = ApplicationParameters;
        beneficiaryFlowsService = BeneficiaryFlowService;
        mock = _mock_;
        card = Card;
        location = jasmine.createSpyObj('location', ['path']);
        flow = Flow;

        expectedSteps = [
            {name: 'Enter details', complete: false, current: true},
            {name: 'Confirm details', complete: false, current: false},
            {name: 'Enter OTP', complete: false, current: false}
        ];

    }));

    var branches = [
        {
            "code": 20091600,
            "name": "DURBAN CENTRAL FOREX OPS"
        }
    ];

    describe('is initialized', function () {

        beforeEach(inject(function (Beneficiary) {
            card.setCurrent(12345, 9, 'SBSA_Banking');
            beneficiariesState.errorMessage = 'something bad';
            beneficiaryFlowsService.initialize(Beneficiary.newInstance(), 'Add Beneficiary');
        }));

        it('should initialize the beneficiary', inject(function (Beneficiary) {
            expect(beneficiariesState.modifiedBeneficiary).toEqual(Beneficiary.newInstance());
        }));

        it('should set the default mode to editing', function () {
            expect(beneficiariesState.editing).toBeTruthy();
        });

        it('should clear previous errors', function () {
            expect(beneficiariesState.errorMessage).toBeUndefined();
        });
        it('should have add beneficiary header when passed', function () {
            expect(flow.get().headerName).toEqual("Add Beneficiary");
        });

        it('should have edit beneficiary header when passed', inject(function (Beneficiary) {
            beneficiaryFlowsService.initialize(Beneficiary.newInstance(), 'Edit Beneficiary');
            expect(flow.get().headerName).toEqual("Edit Beneficiary");
        }));

        it('should know the flow steps and state of the steps with the first step as current', function () {
            var steps = flow.get().steps;
            expect(steps).toEqual(expectedSteps);
        });

        it('should have the right card by default', function () {
            var card = {
                "countryCode": "ZA",
                "number": 12345,
                "personalFinanceManagementId": 9,
                "type": "0"
            };

            expect(beneficiariesState.card).toEqual(card);
        });

        it('should initialize the beneficiary using the last request', inject(function (LastRequest, Beneficiary) {
            var standardBank = {
                "name": "Standard Bank",
                "code": "051",
                "branch": branches[0]
            };
            LastRequest.lastRequest({
                data: {
                    beneficiaries: [
                        {foo: 'bar', bank: standardBank}
                    ]
                }
            });
            beneficiaryFlowsService.initialize(Beneficiary.newInstance(), 'Edit Beneficiary');

            var beneficiary = beneficiariesState.modifiedBeneficiary;
            expect(beneficiary).toEqual({foo: 'bar', bank: standardBank});
        }));

        it('should reset the bank into the beneficiary using the last request to please AngularJS if it is a private beneficiary', inject(function (LastRequest, Beneficiary) {
            var standardBank = {
                "name": "Standard Bank",
                "code": "051",
                "branch": branches[0]
            };
            LastRequest.lastRequest({
                data: {
                    beneficiaries: [
                        {foo: 'bar', bank: standardBank}
                    ]
                }
            });
            beneficiaryFlowsService.initialize(Beneficiary.newInstance(), 'Edit Beneficiary');

            var beneficiary = beneficiariesState.modifiedBeneficiary;
            expect(beneficiary.bank).toEqual(standardBank);
        }));

        it('should NOT reset the bank into the beneficiary if it is a listed one', inject(function (LastRequest, Beneficiary) {
            LastRequest.lastRequest({
                data: {
                    beneficiaries: [
                        {beneficiaryType: 'COMPANY', bank: null}
                    ]
                }
            });
            beneficiaryFlowsService.initialize(Beneficiary.newInstance(), 'Edit Beneficiary');

            var beneficiary = beneficiariesState.modifiedBeneficiary;
            expect(beneficiary.bank).toBeNull();
        }));
    });

    describe('when proceed is clicked', function () {
        beforeEach(function () {
            flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Add beneficiary');
            beneficiariesState.editing = true;
            beneficiaryFlowsService.proceed();
        });

        it('should set editing to false', function () {
            expect(beneficiariesState.editing).toBeFalsy();
        });

        it('should know the flow steps and state of the first step should be complete and state of second step should be current', function () {
            expectedSteps[0].current = false;
            expectedSteps[0].complete = true;

            expectedSteps[1].current = true;
            expectedSteps[1].complete = false;

            var steps = flow.get().steps;
            expect(steps).toEqual(expectedSteps);
        });
    });

    describe('when modify is clicked', function () {
        beforeEach(function () {
            flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Add beneficiary');
            flow.next();
            beneficiariesState.errorMessage = 'asd';
            beneficiariesState.editing = false;
            beneficiaryFlowsService.modify();
        });

        it('should set the editing mode as false', function () {
            expect(beneficiariesState.editing).toBeTruthy();
        });

        it('should remove any previous errors', function () {
            expect(beneficiariesState.errorMessage).toBeFalsy();
        });

        it('should know the flow steps and state of the steps with the first step as current', function () {
            var steps = flow.get().steps;
            expect(steps).toEqual(expectedSteps);
        });
    });

    describe('when confirm is clicked', function () {
        var response, beneficiary, card, mock, $httpBackend, url, location, windowSpy;

        beforeEach(inject(function (Fixture, _mock_, $injector, URL, $location, $window) {
            mock = _mock_;
            card = {number: 'number'};
            beneficiary = {recipientId: 7672};
            response = {beneficiaries: [beneficiary]};
            url = URL;
            location = $location;
            windowSpy = spyOn($window.history, 'go');
            flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Add beneficiary');
            flow.next();
            $httpBackend = $injector.get('$httpBackend');
        }));

        it('should add the beneficiary and clear last request data when no error occurred', inject(function (LastRequest) {
            $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {'x-sbg-response-code': "0000"});
            LastRequest.lastRequest({
                data: {
                    beneficiaries: [
                        {foo: 'bar'}
                    ]
                }
            });

            beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/add');
            $httpBackend.flush();

            expect(beneficiariesState.addBeneficiaryFlow).toBeTruthy();
            expect(beneficiariesState.latestBeneficiaryRecipientID).toEqual(beneficiary.recipientId);
            expect(beneficiariesState.errorMessage).toBeUndefined();
            expect(windowSpy).toHaveBeenCalledWith(-1);
            //expect(window).toEqual('/beneficiaries/list');
            expect(listService.clear).toHaveBeenCalled();
        }));

        it('should edit the beneficiary and clear last request data when no error occurred', inject(function (LastRequest) {
            $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {'x-sbg-response-code': "0000"});
            LastRequest.lastRequest({
                data: {
                    beneficiaries: [
                        {foo: 'bar'}
                    ]
                }
            });

            beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/edit');
            $httpBackend.flush();

            expect(beneficiariesState.addBeneficiaryFlow).toBeTruthy();
            expect(beneficiariesState.latestBeneficiaryRecipientID).toEqual(beneficiary.recipientId);
            expect(beneficiariesState.errorMessage).toBeUndefined();
            expect(windowSpy).toHaveBeenCalledWith(-1);
        }));

        it('should call the setBeneficiaryFlowParameter service with addBeneficiaryFlow and true in the global service', inject(function (LastRequest) {
            $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {'x-sbg-response-code': "0000"});

            LastRequest.lastRequest({
                data: {
                    beneficiaries: [
                        {foo: 'bar'}
                    ]
                }
            });

            beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/add');
            $httpBackend.flush();

            expect(beneficiariesState.addBeneficiaryFlow).toBeTruthy();
        }));


        it('should set the latestBeneficiaryRecipientID to currently added beneficiary recipient ID in the global service', inject(function (LastRequest) {
            $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {'x-sbg-response-code': "0000"});
            LastRequest.lastRequest({
                data: {
                    beneficiaries: [
                        {foo: 'bar'}
                    ]
                }
            });

            beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/add');
            $httpBackend.flush();

            expect(beneficiariesState.latestBeneficiaryRecipientID).toEqual(beneficiary.recipientId);
        }));

        it('should add the recipient ID of the latest beneficiary to the beneficiary flow parameters', function () {
            $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {'x-sbg-response-code': "0000"});
            beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/add');
            $httpBackend.flush();

            expect(beneficiariesState.latestBeneficiaryRecipientID).toEqual(beneficiary.recipientId);
        });

        describe('on confirm', function(){
            beforeEach(function(){
                $httpBackend.when('GET', 'features/otp/partials/verify.html').respond(200);
                $httpBackend.when('GET', 'features/security/partials/login.html').respond(200);
                $httpBackend.when('GET', 'features/beneficiaries/partials/add.html').respond(200);
            });

            it('should know the current step is the last step and the other two steps have been completed', function () {
                $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {
                    'x-sbg-response-code': "0000",
                    'x-sbg-response-type': "STEPUP"
                });


                expectedSteps[0].current = false;
                expectedSteps[0].complete = true;

                expectedSteps[1].current = false;
                expectedSteps[1].complete = true;

                expectedSteps[2].current = true;
                expectedSteps[2].complete = false;

                beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/add');
                $httpBackend.flush();

                expect(flow.get().steps).toEqual(expectedSteps);
            });

            it('should not add beneficiary when the account number is invalid', function () {
                $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {
                    'x-sbg-response-code': "2308",
                    'x-sbg-response-type': "ERROR"
                });
                beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/edit');
                $httpBackend.flush();

                expect(beneficiariesState.addBeneficiaryFlow).toBeFalsy();
                expect(beneficiariesState.errorMessage).toEqual('Please enter a valid account number');
                expect(location.path()).toEqual('/beneficiaries/edit');
            });

            it('should not add beneficiary when the bank, branch and account numbers are invalid', function () {
                $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {
                    'x-sbg-response-code': "2311",
                    'x-sbg-response-type': "ERROR"
                });
                beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/edit');
                $httpBackend.flush();

                expect(beneficiariesState.addBeneficiaryFlow).toBeFalsy();
                expect(beneficiariesState.errorMessage).toEqual('Please enter a valid account number');
                expect(location.path()).toEqual('/beneficiaries/edit');
            });

            it('should not allow beneficiary to be added as private if it is listed in the CDI', function () {
                $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {
                    'x-sbg-response-code': "2318",
                    'x-sbg-response-type': "ERROR"
                });
                beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/edit');
                $httpBackend.flush();

                expect(beneficiariesState.addBeneficiaryFlow).toBeFalsy();
                expect(beneficiariesState.errorMessage).toEqual('This beneficiary is already listed in our directory. To add this beneficiary, search for it below');
                expect(location.path()).toEqual('/beneficiaries/edit');
            });

            it('should not allow listed beneficiary to be added if the reference provided is invalid', function () {
                $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {
                    'x-sbg-response-code': "2202",
                    'x-sbg-response-type': "ERROR"
                });
                beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/edit');
                $httpBackend.flush();

                expect(beneficiariesState.addBeneficiaryFlow).toBeFalsy();
                expect(beneficiariesState.errorMessage).toEqual('Please enter a valid beneficiary reference');
                expect(location.path()).toEqual('/beneficiaries/edit');
            });

            it('should not allow listed beneficiary to be added if the notification email provided is invalid', function () {
                $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {
                    'x-sbg-response-code': "7545",
                    'x-sbg-response-type': "ERROR"
                });
                beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/edit');
                $httpBackend.flush();

                expect(beneficiariesState.addBeneficiaryFlow).toBeFalsy();
                expect(beneficiariesState.errorMessage).toEqual('Please enter a valid notification email address');
                expect(location.path()).toEqual('/beneficiaries/edit');
            });

            it('should not add beneficiary when an unspecified application error has occurred', function () {
                $httpBackend.when('PUT', url.beneficiaries).respond(200, response, {'x-sbg-response-type': "ERROR"});
                beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/edit');
                $httpBackend.flush();

                expect(beneficiariesState.addBeneficiaryFlow).toBeFalsy();
                expect(beneficiariesState.errorMessage).toEqual('An error has occurred');
            });

            it('should redirect to the first page in the flow when an unspecified error has occurred', function () {
                $httpBackend.when('PUT', url.beneficiaries).respond(500, mock.response({}));
                beneficiaryFlowsService.confirm(beneficiary, card, '/beneficiaries/edit');
                $httpBackend.flush();

                expect(beneficiariesState.addBeneficiaryFlow).toBeFalsy();
                expect(location.path()).toEqual('/beneficiaries/edit');
                expect(beneficiariesState.errorMessage).toEqual('An error has occurred');
            });
        });
    });
});