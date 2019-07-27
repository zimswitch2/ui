describe('AddressValidation', function(){
    'use strict';
    /*global AddressValidation:true */

    var navigateCallback = jasmine.createSpy('navigateCallback');
    var editCallback = jasmine.createSpy('editCallback');
    var addressValidation = new AddressValidation(navigateCallback, editCallback);

    var emptyCustomer = {};
    var customerWithResidentialAddress = {
        hasCurrentResidentialAddress: function(){
            return true;
        }
    };
    var customerWithOutResidentialAddress = {
        hasCurrentResidentialAddress: function(){
            return false;
        }
    };

    describe ('validateSection', function(){
        it('should return true if customerData is empty', function(){
            var customer = emptyCustomer;

            expect(addressValidation.validateSection(customer)).toBeTruthy();
        });

        it ('should fail validation if customer has no residential address', function(){
            var customer = customerWithOutResidentialAddress;

            expect(addressValidation.validateSection(customer)).toBeFalsy();
        });

        it ('should pass validation if customer has residential address', function(){
            var customer = customerWithResidentialAddress;

            expect(addressValidation.validateSection(customer)).toBeTruthy();
        });
    });

    describe ('getNotificationMessage', function(){

        it('should return message prompting for address when customer has no residential address', function(){
            var customer = customerWithOutResidentialAddress;
            var expectedMessage = 'Please enter your address details';

            expect(addressValidation.getNotificationMessage(customer)).toEqual(expectedMessage);

        });
    });

    describe('navigateToSection', function () {
       it('should have called nagivateCallback when navigateToSection is called', function(){
           addressValidation.navigateToSection();

           expect(navigateCallback).toHaveBeenCalled();
       });
    });

    describe('editSection', function () {
        it('should have called editCallback with address when customer has no address and editSection is called', function(){
            var customer = customerWithOutResidentialAddress;
            addressValidation.editSection(customer);

            expect(editCallback).toHaveBeenCalledWith('address');
        });
    });
});