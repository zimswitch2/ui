describe('EmploymentValidation', function () {
    'use strict';

    var navigateCallback = jasmine.createSpy('navigateCallback');
    var editCallback = jasmine.createSpy('editCallback');
    var employmentValidation = new EmploymentValidation(navigateCallback, editCallback);

    var emptyCustomer = {};
    var customerWithEmployment = {
        hasEmploymentDetails: function () {
            return true;
        }
    };
    var customerWithOutEmployment = {
        hasEmploymentDetails: function () {
            return false;
        }
    };

    describe('validateSection', function () {
        it('should return true if customerData is empty', function () {
            var customer = emptyCustomer;

            expect(employmentValidation.validateSection(customer)).toBeTruthy();
        });

        it('should pass validation if customer has employment details', function () {
            var customer = customerWithEmployment;

            expect(employmentValidation.validateSection(customer)).toBeTruthy();
        });

        describe('when customer has no employment details', function () {
            var customer;

            beforeEach(function () {
                customer = customerWithOutEmployment;
            });

            describe('if customer management V4 is toggled off', function () {
                beforeEach(function () {
                    customerManagementV4Feature = false;
                });

                afterEach(function(){
                    customerManagementV4Feature = true;
                });

                it('should pass validation if customer has tertiary qualification code', function () {
                    customer.tertiaryQualificationCode = '123';
                    expect(employmentValidation.validateSection(customer)).toBeTruthy();
                });

                it('should fail validation if customer has no tertiary qualification code', function () {
                    customer.tertiaryQualificationCode = '';

                    expect(employmentValidation.validateSection(customer)).toBeFalsy();
                });
            });

            describe('if customer management V4 is toggled on', function () {
                beforeEach(function () {
                    customerManagementV4Feature = true;
                });

                it('should fail validation', function () {
                    customer.tertiaryQualificationCode = '123';
                    expect(employmentValidation.validateSection(customer)).toBeFalsy();
                });
            });
        });
    });

    describe('getNotificationMessage', function () {

        it('should return message prompting for employment when customer has no employment', function () {
            var customer = customerWithOutEmployment;
            var expectedMessage = 'Please enter your employment details';

            expect(employmentValidation.getNotificationMessage(customer)).toEqual(expectedMessage);

        });
    });

    describe('navigateToSection', function () {
        it('should have called nagivateCallback when navigateToSection is called', function () {
            employmentValidation.navigateToSection();

            expect(navigateCallback).toHaveBeenCalled();
        });
    });

    describe('editSection', function () {
        it('should have called editCallback with add if customer has no employment', function () {
            var customer = customerWithOutEmployment;
            employmentValidation.editSection(customer);

            expect(editCallback).toHaveBeenCalledWith('add');
        });
    });
});