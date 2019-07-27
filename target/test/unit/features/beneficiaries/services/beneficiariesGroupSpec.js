describe('beneficiaries', function () {
    'use strict';

    beforeEach(module('refresh.beneficiaries', 'refresh.beneficiaries.beneficiariesListService', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture', 'refresh.metadata', 'refresh.parameters'));

    describe('services', function () {
        var service, analytics, test;

        describe('beneficiaries group', function () {
            var groups = [{'name': 'Test Group', 'oldName': null, 'orderIndex': 1}];

            beforeEach(inject(function (_GroupsService_, _DtmAnalyticsService_, ServiceTest) {
                service = _GroupsService_;
                spyOn(service, 'clear');
                analytics = _DtmAnalyticsService_;
                spyOn(analytics, 'sendError');
                test = ServiceTest;
                test.spyOnEndpoint('viewBeneficiaryGroup');
                test.spyOnEndpoint('addBeneficiaryGroup');
            }));

            it('should invoke the list group service', function () {
                var expectedResponse = {card: {number: 'number', type: null, countryCode: 'ZA'}};
                test.stubResponse('viewBeneficiaryGroup', 200, expectedResponse, {});
                expect(service.list({number: 'number'})).toBeResolvedWith({
                    data: expectedResponse,
                    status: 200,
                    headers: jasmine.any(Function)
                });

                test.resolvePromise();

                expect(test.endpoint('viewBeneficiaryGroup')).toHaveBeenCalledWith({card: {number: 'number'}});
            });

            it('should not invoke the list group service if card number is not supplied', function() {
                expect(service.list({})).toBeRejectedWith('Can not retrieve beneficiary groups because the card number is not specified');

                test.resolvePromise();

                expect(test.endpoint('viewBeneficiaryGroup')).not.toHaveBeenCalled();
            });

            it('should send an error to analytics if the card number is not supplied', function() {
                service.list({});

                test.resolvePromise();

                expect(analytics.sendError).toHaveBeenCalledWith('Can not retrieve beneficiary groups because the card number is not specified');
            });

            it('should invoke the add group service and respond with success message', function () {
                test.stubResponse('addBeneficiaryGroup', 200, {data: true}, {
                    'x-sbg-response-code': "0000",
                    'x-sbg-response-type': 'SUCCESS'
                });
                expect(service.add('Test Group')).toBeResolvedWith({
                    data: {data: true},
                    status: 200,
                    headers: jasmine.any(Function)
                });
                test.resolvePromise();

                expect(test.endpoint('addBeneficiaryGroup')).toHaveBeenCalledWith({card: undefined, groups: groups});
                expect(service.clear).toHaveBeenCalled();
            });

            it('should invoke the add group service and respond with an error message for a duplicate group', function () {
                test.stubResponse('addBeneficiaryGroup', 200, {}, {
                    'x-sbg-response-code': "2700",
                    'x-sbg-response-type': 'ERROR'
                });
                expect(service.add('Test Group')).toBeRejectedWith({message: 'You already have a beneficiary group with this name.'});
                test.resolvePromise();

                expect(test.endpoint('addBeneficiaryGroup')).toHaveBeenCalledWith({card: undefined, groups: groups});
            });

            it('should invoke the add group service and respond with an error message for exceeding maximum number of group', function () {
                test.stubResponse('addBeneficiaryGroup', 200, {}, {
                    'x-sbg-response-code': "2702",
                    'x-sbg-response-type': 'ERROR'
                });
                expect(service.add('Test Group')).toBeRejectedWith({message: 'Group cannot be added as you are already at your maximum number of 30 groups.'});
                test.resolvePromise();

                expect(test.endpoint('addBeneficiaryGroup')).toHaveBeenCalledWith({card: undefined, groups: groups});
            });

            it('should invoke the add group service and respond with the message from the service', function () {
                test.stubResponse('addBeneficiaryGroup', 200, {}, {
                    'x-sbg-response-code': "1234",
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'Something bad happened.'
                });
                expect(service.add('Test Group')).toBeRejectedWith({message: 'Something bad happened.'});
                test.resolvePromise();

                expect(test.endpoint('addBeneficiaryGroup')).toHaveBeenCalledWith({card: undefined, groups: groups});
            });

            it('should invoke the add group service and respond with a generic server error', function () {
                test.stubResponse('addBeneficiaryGroup', 500, {}, {});
                expect(service.add('Test Group')).toBeRejectedWith({message: 'An error has occurred'});
                test.resolvePromise();

                expect(test.endpoint('addBeneficiaryGroup')).toHaveBeenCalledWith({card: undefined, groups: groups});
            });
        });

        describe('list directive', function () {
            var element;
            beforeEach(inject(function (_TemplateTest_) {
                element = _TemplateTest_.compileTemplate('<beneficiaries-list />', false);
            }));

            it('should have a list', function () {
                expect(element.find("ul")).toBeDefined();
            });
        });
    });
});
