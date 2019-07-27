(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.rcp.domain.rcpApplication', []);

    app.factory('RcpApplication', function () {
        var STATE = {
            New: 'New',
            Declined: 'Declined',
            Accepted: 'Accepted',
            InProgress: 'InProgress',
            Pending: 'Pending'
        };

        var _state, _offer, _offerConfirmationDetails, _selectedBranch, _selection, _debitOrder, _repaymentAmount, _preScreeningComplete;

        var start = function () {
            _state = STATE.New;
        };

        var _continue = function (offer){
            _offer = offer;
            _state = STATE.Pending;
            _preScreeningComplete = true;
        };

        var isNew = function () {
            return _state === STATE.New;
        };

        var isInProgress = function () {
            return _state === STATE.InProgress;
        };

        var isPending = function () {
            return _state === STATE.Pending;
        };

        var isDeclined = function () {
            return _state === STATE.Declined;
        };

        var offer = function (offer) {
            return _offer = offer || _offer;
        };

        var select = function (options) {
            _state = STATE.InProgress;

            _selectedBranch = options['selectedBranch'];
            _debitOrder = options['debitOrder'];
            _repaymentAmount = options['repaymentAmount'];
            var requestedLimit = options['requestedLimit'];

            _selection = {
                selectedBranch: _selectedBranch,
                debitOrder: _debitOrder,
                requestedLimit: requestedLimit
            };
        };

        var selection = function () {
            return _selection;
        };
        var confirm = function (offerConfirmationDetails) {
            _offerConfirmationDetails = offerConfirmationDetails;
        };

        var offerConfirmationDetails = function () {
            return _offerConfirmationDetails;
        };

        var decline = function (options) {
            _state = STATE.Declined;
            _offer = options['offer'];
        };

        var hasRcpAccount = function () {
            return _state === STATE.Accepted;
        };

        var isPreScreeningComplete = function () {
            return _preScreeningComplete;
        };

        var completePreScreening = function () {
            _preScreeningComplete = true;
        };

        return {
            start: start,
            select: select,
            confirm: confirm,
            isNew: isNew,
            continue : _continue,
            offer: offer,
            offerConfirmationDetails: offerConfirmationDetails,
            selection: selection,
            decline: decline,
            isDeclined: isDeclined,
            hasRcpAccount: hasRcpAccount,
            isInProgress: isInProgress,
            isPreScreeningComplete: isPreScreeningComplete,
            isPending: isPending,
            completePreScreening: completePreScreening
        };
    });
})();
