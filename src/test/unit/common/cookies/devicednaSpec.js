var realDeviceDnaCA = ca;
describe('device dna', function () {
    'use strict';

    var ipCookie, client;
    beforeEach(function () {
        module('refresh.devicedna', function ($provide) {
            client = jasmine.createSpyObj('Client', ['setProperty', 'processDNA', 'getDNA']);
            client.getDNA.and.returnValue('dna');

            ca = {
                rm: {
                    Client: function () {
                        return client;
                    }
                }
            };

            ipCookie = function (name, value, options) {
                ipCookie.calledName = name;
                ipCookie.calledValue = value;
                ipCookie.calledOptions = options;
            };
            $provide.value('ipCookie', ipCookie);
        });
        inject();
    });

    afterEach(function () {
        ca = realDeviceDnaCA;
    });

    it('should set default properties on the client', function () {
        expect(client.setProperty).toHaveBeenCalledWith('baseurl', 'assets');
        expect(client.setProperty).toHaveBeenCalledWith('format', 'json');
        expect(client.setProperty).toHaveBeenCalledWith('noFlash', true);
    });

    it('should set the device DNA on the cookie', function () {
        expect(client.processDNA).toHaveBeenCalled();
        expect(ipCookie.calledName).toEqual('DEVICE_SIGNATURE');
        expect(ipCookie.calledValue).toEqual('ZG5h');
        expect(ipCookie.calledOptions).toEqual({path: '/', secure: true});
    });
});