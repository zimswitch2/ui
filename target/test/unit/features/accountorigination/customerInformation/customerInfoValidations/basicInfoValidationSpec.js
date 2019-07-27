describe('BasicInfoValidation', function () {
    /* global customerManagementV4Feature:true */

    'use strict';

    var navigateCallback = jasmine.createSpy('navigateCallback');
    var editCallback = jasmine.createSpy('editCallback');
    var basicInfoValidation = new BasicInfoValidation(navigateCallback, editCallback);

    var customerWithCompleteBasicInfo = {
        needAdditionalBasicInfo: function () {
            return false;
        }
    };
    var customerWithIncompleteBasicInfo = {
        needAdditionalBasicInfo: function () {
            return true;
        }
    };

    afterEach(function () {
        customerManagementV4Feature = true;
    });

    describe('validateSection', function () {
        it('should return true if customerData is empty', function () {
            var emptyCustomer = {};
            expect(basicInfoValidation.validateSection(emptyCustomer)).toBeTruthy();
        });

        it('should return true if customerManagementV4 toggle is false', function () {
            customerManagementV4Feature = false;
            var customer = customerWithIncompleteBasicInfo;
            expect(basicInfoValidation.validateSection(customer)).toBeTruthy();
        });

        it('should fail validation if customer has incomplete basic info', function () {
            var customer = customerWithIncompleteBasicInfo;
            expect(basicInfoValidation.validateSection(customer)).toBeFalsy();
        });

        it('should pass validation if customer has complete basic info', function () {
            var customer = customerWithCompleteBasicInfo;
            expect(basicInfoValidation.validateSection(customer)).toBeTruthy();
        });
    });

    describe('getNotificationMessage', function () {

        it('should return message prompting for basic info when customer is missing some basic info', function () {
            var expectedMessage = 'Please enter all the additional required information to complete your profile';
            expect(basicInfoValidation.getNotificationMessage(customerWithIncompleteBasicInfo)).toEqual(expectedMessage);

        });
    });

    describe('navigateToSection', function () {
        it('should have called nagivateCallback when navigateToSection is called', function () {
            basicInfoValidation.navigateToSection();
            expect(navigateCallback).toHaveBeenCalled();
        });
    });

    describe('editSection', function () {
        it('should have called editCallback with additionalBasic when customer basic info is incomplete and editSection is called', function () {
            var customer = customerWithIncompleteBasicInfo;
            basicInfoValidation.editSection(customer);
            expect(editCallback).toHaveBeenCalledWith('additionalBasic');
        });
    });
});