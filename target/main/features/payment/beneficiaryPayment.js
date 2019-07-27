(function() {

    function beneficiaryPayment(ApplicationParameters) {
        var _beneficiary, _paymentDetail, _amount, _errorMessage, _state;
        var getTimeNow = function () {
            return moment(ApplicationParameters.getVariable('latestTimestampFromServer')).format('DD MMMM YYYY');
        };

        function start(beneficiary) {
            _beneficiary = beneficiary;
            _paymentDetail = new PaymentDetail({
                fromDate: getTimeNow(),
                repeatInterval: 'Single',
                currentDate: getTimeNow()
            });
            _errorMessage = undefined;
            _amount = {
                value: undefined
            };
            _state = undefined;
        }
        
        function getBeneficiary() {
            return _beneficiary;
        }

        function getPaymentDetail() {
            return _paymentDetail;
        }

        function getPaymentConfirmation() {
            return _beneficiary.paymentConfirmation.confirmationType !== 'None';
        }

        function getAmount() {
            return _amount;
        }

        function getErrorMessage() {
            return _errorMessage;
        }

        function setErrorMessage(errorMessage) {
            _errorMessage = errorMessage;
        }

        function getState() {
            return _state;
        }

        function setState(flowState) {
            _state = flowState;
        }

        return {
            getBeneficiary: getBeneficiary,
            getPaymentDetail: getPaymentDetail,
            getPaymentConfirmation: getPaymentConfirmation,
            getAmount: getAmount,
            getState: getState,
            setState: setState,
            getErrorMessage: getErrorMessage,
            setErrorMessage: setErrorMessage,
            start: start
        };
    }

    angular.module('refresh.payment').factory('BeneficiaryPayment', beneficiaryPayment);
})();
