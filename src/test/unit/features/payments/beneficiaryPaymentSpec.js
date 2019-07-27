describe('Beneficiary Payment', function () {
    beforeEach(module('refresh.payment'));

    var beneficiaryPayment, applicationParameters;
    beforeEach(inject(function (BeneficiaryPayment, ApplicationParameters) {
        beneficiaryPayment = BeneficiaryPayment;
        applicationParameters = ApplicationParameters;
    }));

    it('should set the error message', function () {
        beneficiaryPayment.setErrorMessage('Dough!');
        expect(beneficiaryPayment.getErrorMessage()).toEqual('Dough!');
    });

    describe('when starting a new beneficiary payment', function () {
        var beneficiary;

        beforeEach(function() {
            beneficiary = {
                paymentConfirmation: {
                    confirmationType: 'Fax'
                }
            };
        });

        it('should set the beneficiary of the payment', function () {
            beneficiaryPayment.start(beneficiary);

            expect(beneficiaryPayment.getBeneficiary()).toEqual({
                paymentConfirmation: {
                    confirmationType: 'Fax'
                }
            });
        });

        it('should have an undefined error message', function() {
            beneficiaryPayment.setErrorMessage('Bad bad bad');

            beneficiaryPayment.start(beneficiary);

            expect(beneficiaryPayment.getErrorMessage()).toBeUndefined();
        });

        it('should set payment confirmation to true if the beneficiary payment confirmation type is not none', function() {
            beneficiary.paymentConfirmation.confirmationType = 'Fax';

            beneficiaryPayment.start(beneficiary);

            expect(beneficiaryPayment.getPaymentConfirmation()).toEqual(true);
        });

        it('should set payment confirmation to false if the beneficiary payment confirmation type is none', function() {
            beneficiary.paymentConfirmation.confirmationType = 'None';

            beneficiaryPayment.start(beneficiary);

            expect(beneficiaryPayment.getPaymentConfirmation()).toEqual(false);
        });

        it ('should clear the amount', function() {
            beneficiaryPayment.start(beneficiary);
            beneficiaryPayment.getAmount().value = 322;

            beneficiaryPayment.start(beneficiary);

            expect(beneficiaryPayment.getAmount().value).toBeUndefined();
        });

        it('should set the current state to default', function() {
            beneficiaryPayment.setState('reviewing');

            beneficiaryPayment.start(beneficiary);

            expect(beneficiaryPayment.getState()).toBeUndefined();
        });

        describe('when creating the payment detail', function () {
            beforeEach(function () {
                applicationParameters.pushVariable('latestTimestampFromServer', moment('12 March 2014'));
            });

            it('should set the current date on the payment detail to the latest timestamp from the server', function () {
                beneficiaryPayment.start(beneficiary);

                expect(beneficiaryPayment.getPaymentDetail().currentDate).toEqual('12 March 2014');
            });

            it('should set the from date on the payment detail to the latest timestamp from the server', function () {
                beneficiaryPayment.start(beneficiary);

                expect(beneficiaryPayment.getPaymentDetail().fromDate).toEqual('12 March 2014');
            });

            it('should set the repeat interval of the payment detail to Single', function() {
                beneficiaryPayment.start(beneficiary);

                expect(beneficiaryPayment.getPaymentDetail().repeatInterval).toEqual('Single');
            });
        });
    });
});
