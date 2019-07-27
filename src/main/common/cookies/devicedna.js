(function (app) {
    'use strict';

    app.run(function (ipCookie, $base64) {
        try {
            var client = new ca.rm.Client();
            client.setProperty('baseurl', 'assets');
            client.setProperty('format', 'json');
            client.setProperty('noFlash', true);

            client.processDNA();
            ipCookie('DEVICE_SIGNATURE', $base64.encode(client.getDNA()), { path: '/', secure: true });
        } catch (e) {
            // handle error here
        }
    });
})(angular.module('refresh.devicedna', ['ipCookie', 'base64']));
