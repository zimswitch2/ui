(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.currentAccount.domain.currentAccountApplication', []);

    app.factory('CurrentAccountApplication', function () {
        var STATE = {
            New: 'New',
            Declined: 'Declined',
            Pending: 'Pending',
            IsInProgress: 'IsInProgress',
            Accepted: 'Accepted'
        };

        var _state, _applicationNumber, _offer, _acceptOfferResponse, _chequeCardError, _preScreeningComplete, _selection;



        var start = function () {
            _state = STATE.New;
        };

        var _continue = function (options) {
            _applicationNumber = options['applicationNumber'];
            _offer = options['offer'];
            _state = STATE.Pending;
        };

        var isNew = function () {
            return _state === STATE.New;
        };

        var isPending = function () {
            return _state === STATE.Pending && _applicationNumber;
        };

        var isDeclined = function () {
            return _state === STATE.Declined;
        };

        var _preScreening = {
            debtReview: false,
            insolvent: false,
            sequestration: false,
            creditAndFraudCheckConsent: false
        };

        var isPreScreeningComplete = function () {
            return _preScreeningComplete;
        };

        var isInProgress = function(){
            return _state === STATE.IsInProgress;
        };

        var completePreScreening = function () {
            _preScreeningComplete = true;
        };

        var canApplyForOverdraft = function () {
            return !_preScreening.debtReview;
        };

        var offer = function (offer) {
            return _offer = offer || _offer;
        };

        var select = function (options) {
            _state = STATE.IsInProgress;
            _selection = {
                product: options['product'],
                branch: options['branch']
            };
        };

        var selection = function() {
            return _selection || {};
        };

        var decline = function (options) {
            _state = STATE.Declined;
            _offer = options['offer'];
        };

        var acceptOfferResponse = function (acceptOfferResponse) {
            return _acceptOfferResponse = acceptOfferResponse || _acceptOfferResponse;
        };

        var acceptChequeCard = function (card) {
            _selection.chequeCard = card;
        };

        var chequeCardError = function (error) {
            return _chequeCardError = error || _chequeCardError;
        };

        return {
            start: start,
            continue: _continue,
            isNew: isNew,
            preScreening: _preScreening,
            isPreScreeningComplete: isPreScreeningComplete,
            completePreScreening: completePreScreening,
            isInProgress: isInProgress,
            canApplyForOverdraft: canApplyForOverdraft,
            isPending: isPending,
            isDeclined: isDeclined,
            select: select,
            offer: offer,
            selection: selection,
            decline: decline,
            acceptOfferResponse: acceptOfferResponse,
            acceptChequeCard: acceptChequeCard,
            chequeCardError: chequeCardError
        };
    });
})();