(function() {
    'use strict';

    angular
        .module('refresh.accountSharing.addUser')
        .service('CancelDialogService', function($q) {
            var serv = this;
            var show = false;
            var deferred;

            serv.shouldShow = function () {
                return show;
            };

            serv.hide = function() {
                show = false;
            };

            serv.createDialog = function() {
                deferred = $q.defer();
                show = true;
                return deferred.promise;
            };

            serv.confirm = function() {
                show = false;
                deferred.resolve();
            };

            serv.cancel = function() {
                show = false;
                deferred.reject();
            };
        });
})();
