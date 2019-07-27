describe('Payment', function () {

    'use strict';

    beforeEach(module('refresh.paymentFlowParametersService', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture', 'refresh.metadata', 'refresh.parameters'));

    describe('services', function () {
        describe('PaymentFlowParameters', function () {
            var paymentFlowParameters;

            beforeEach(inject(function (PaymentFlowParametersService) {
                paymentFlowParameters = PaymentFlowParametersService;
            }));

            it('should have a global key when one is pushed', function () {
                paymentFlowParameters.setPaymentFlowParameter('beneficiaryName', 'Name1');
                expect(paymentFlowParameters.getPaymentFlowParameter('beneficiaryName')).toEqual('Name1');
            });

            it('should know how to get the second key when two variables have been pushed', function () {
                paymentFlowParameters.setPaymentFlowParameter('variable1', 'Variable 1');
                paymentFlowParameters.setPaymentFlowParameter('variable2', 'Variable 2');

                expect(paymentFlowParameters.getPaymentFlowParameter('variable1')).toEqual('Variable 1');
                expect(paymentFlowParameters.getPaymentFlowParameter('variable2')).toEqual('Variable 2');
            });
        });
    });
});
