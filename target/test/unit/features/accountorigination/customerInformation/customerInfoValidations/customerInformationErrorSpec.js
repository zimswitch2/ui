describe('CustomerInformationErrors', function () {

    'use strict';
    beforeEach(module('refresh.accountOrigination.customerInformationErrors'));

    var customerInformationErrors;
    beforeEach(inject(function(CustomerInformationErrors){
        customerInformationErrors = CustomerInformationErrors;
    }));

    it('should return errors', function(){
        var errors = customerInformationErrors.errors();
        expect(errors).not.toBeUndefined();
    });

    describe('allDatesValid', function(){
        it('should return true if there are no errors for any of the date properties', function(){
            expect(customerInformationErrors.allDatesValid()).toEqual(true);
        });

        it('should return false if date of birth has errors', function(){
            var errors = customerInformationErrors.errors();
            errors.dateOfBirth = 'Date of birth not valid';
            expect(customerInformationErrors.allDatesValid()).toEqual(false);
        });

        it('should return false if passport expiry date has errors', function(){
            var errors = customerInformationErrors.errors();
            errors.passportExpiryDate = 'Passport expiry date not valid';
            expect(customerInformationErrors.allDatesValid()).toEqual(false);
        });

        it('should return false if permit expiry date has errors', function(){
            var errors = customerInformationErrors.errors();
            errors.permitExpiryDate = 'Permit expiry date not valid';
            expect(customerInformationErrors.allDatesValid()).toEqual(false);
        });
    });
});
