describe('International Payment Customer object', function () {
    'use strict';

    var internationalPaymentCustomer;

    beforeEach(module('refresh.internationalPayment.domain.internationalPaymentCustomer'));
    beforeEach(inject(function (InternationalPaymentCustomer) {
        internationalPaymentCustomer = InternationalPaymentCustomer;
    }));

    describe('when initializing', function () {
        it('should set the customer', function () {
            var customer = {
                firstName: "Sipho",
                lastName: "Smith"
            };
            internationalPaymentCustomer.initialize(customer);

            expect(internationalPaymentCustomer.customer()).toEqual(customer);
        });

        describe('incompleteFields', function () {
            var customer;

            beforeEach(function () {
                customer = internationalPaymentCustomer.initialize({
                        contact: '078 854 1141',
                        dateOfBirth: '04 January 1985',
                        firstName: 'Vaftest',
                        gender: 'Female',
                        idNumber: '850104 5570 09 9',
                        lastName: 'Sitone',
                        postalAddressOne: '52 Anderson St',
                        postalAddressTwo: '',
                        postalCity: 'Johannesburg',
                        postalCountry: 'ZA',
                        postalPostalCode: '2001',
                        postalProvince: 'Gauteng',
                        postalSuburb: 'Marshalltown',
                        residentialAddressOne: '5 Simmonds St',
                        residentialAddressTwo: '',
                        residentialCity: 'Johannesburg',
                        residentialCountry: 'ZA',
                        residentialPostalCode: '2001',
                        residentialProvince: 'Gauteng',
                        residentialSuburb: 'Marshalltown'
                    }
                );
            });

            it('should return false when customer has given all necessary information', function () {
                expect(customer.incompleteFields()).toBeFalsy();
            });

            it('should return true if a customer does not have an id number, passport number, work permit number and foreign id', function () {
                customer.idNumber = '';
                customer.foreignIdNumber = '';
                customer.passportNumber = '';
                customer.workPermitNumber = '';

                expect(customer.incompleteFields()).toBeTruthy();
            });

            it('should return false if a customer has an id number', function () {
                customer.idNumber = '1234';
                customer.foreignIdNumber = '';
                customer.passportNumber = '';
                customer.workPermitNumber = '';

                expect(customer.incompleteFields()).toBeFalsy();
            });

            it('should return false if a customer has a foreign id number', function () {
                customer.idNumber = '';
                customer.foreignIdNumber = '1234';
                customer.passportNumber = '';
                customer.workPermitNumber = '';

                expect(customer.incompleteFields()).toBeFalsy();
            });

            it('should return false if a customer has a  passport and work permit', function () {
                customer.idNumber = '';
                customer.foreignIdNumber = '';
                customer.passportNumber = '1234';
                customer.workPermitNumber = '5678';

                expect(customer.incompleteFields()).toBeFalsy();
            });

            it('should return true if a customer has a  passport without work permit', function () {
                customer.idNumber = '';
                customer.foreignIdNumber = '';
                customer.passportNumber = '1234';
                customer.workPermitNumber = '';

                expect(customer.incompleteFields()).toBeTruthy();
            });

            it('should return true if a customer has a  work permit without a passport', function () {
                customer.idNumber = '';
                customer.foreignIdNumber = '';
                customer.passportNumber = '';
                customer.workPermitNumber = '1234';

                expect(customer.incompleteFields()).toBeTruthy();
            });

            using(['firstName', 'lastName', 'gender', 'dateOfBirth', 'contact',
                'postalAddressOne', 'postalSuburb', 'postalCity', 'postalProvince', 'postalPostalCode',
                'residentialAddressOne', 'residentialSuburb', 'residentialCity', 'residentialProvince',
                'residentialPostalCode'], function (data) {
                it('should return true when customer is missing information on ' + data, function () {
                    delete customer[data];
                    expect(customer.incompleteFields()).toBeTruthy();
                });
            });
        });

        describe('isResident', function () {
            it('should return true if customer has no id number', function () {
                var customer = internationalPaymentCustomer.initialize({});

                expect(customer.isResident()).toBeFalsy();
            });

            it('should return false if customer has an id number', function () {
                var customer = internationalPaymentCustomer.initialize({idNumber: '850104 5570 09 9'});

                expect(customer.isResident()).toBeTruthy();
            });
        });

        describe('hasWorkPermit', function () {
            it('should return false if customer has no work permit', function () {
                var customer = internationalPaymentCustomer.initialize({});

                expect(customer.hasWorkPermit()).toBeFalsy();
            });

            it('should return true if customer has a work permitr', function () {
                var customer = internationalPaymentCustomer.initialize({workPermitNumber: '850104 5570 09 9'});

                expect(customer.hasWorkPermit()).toBeTruthy();
            });
        });


    });
});
