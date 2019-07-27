describe('CustomerInfoValidation', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInfoValidation', 'refresh.accountOrigination.domain.customer'));

    var customerInfoValidation, CustomerInformationData;

    beforeEach(inject(function (CustomerInfoValidation, _CustomerInformationData_) {
        customerInfoValidation = CustomerInfoValidation;
        CustomerInformationData = _CustomerInformationData_;
    }));

    describe('Validation Service', function () {
        it('should return a list of customer info sections that are invalid', function () {
            var expectedInvalidSections =
                [{
                    name: 'Basic Information',
                    route: 'profile',
                    validationMessage: 'Please enter all the additional required information to complete your profile'
                },
                {   name: 'Address',
                    route: 'address',
                    validationMessage: 'Please enter your address details'},
                {
                    name: 'Employment',
                    route: 'employment',
                    validationMessage: 'Please enter your employment details'
                },
                {
                    name: 'Income and expenses',
                    route: 'income',
                    validationMessage: 'Please enter your income and expense details'
                }
                ];
            var customerData = CustomerInformationData.initialize({});
            var invalidSections = customerInfoValidation.getInvalidSections(customerData);

            expect(invalidSections.length).toEqual(4);
            expect(invalidSections).toEqual(expectedInvalidSections);
        });

        it('should not return customer info sections that are valid', function () {
            var customerData = CustomerInformationData.initialize({
                employmentDetails: [{
                    startDate: '2014-12-17T00:00:00.000+0000',
                    endDate: '9999-12-30T22:00:00.000+0000',
                    employerName: 'ZYX Restaurant',
                    employmentStatusCode: 1
                }]
            });

            var invalidSections = customerInfoValidation.getInvalidSections(customerData);

            expect(invalidSections.length).toEqual(3);
            expect(invalidSections).not.toContain(jasmine.objectContaining({
                name: 'Employment', route: 'employment',
                validationMessage: 'Please enter your employment details'
            }));
        });

        describe('getValidationNotificationForSection()', function(){
            describe('with validation', function(){
                var invalidSections;

                beforeEach(function(){
                    var customerData = CustomerInformationData.initialize({
                        employmentDetails: [{
                            startDate: '2014-12-17T00:00:00.000+0000',
                            endDate: '9999-12-30T22:00:00.000+0000',
                            employerName: 'ZYX Restaurant',
                            employmentStatusCode: 1
                        }]
                    });
                    invalidSections = customerInfoValidation.getInvalidSections(customerData);
                });

                it('should not provide notification for valid sections', function(){
                    var notification = customerInfoValidation.getValidationNotificationForSection('employment');
                    expect(notification).toEqual(undefined);
                });

                it('should provide validation notification for an invalid section', function () {
                    var notification = customerInfoValidation.getValidationNotificationForSection('income');
                    expect(notification).toEqual('Please enter your income and expense details');
                });
            });

            it('should not provide validation notification when validation has not been performed', function () {
                var notification = customerInfoValidation.getValidationNotificationForSection('employment');
                expect(notification).toBe(undefined);
            });
        });
    });
});