describe('Address', function () {
    'use strict';

    var address;
    beforeEach(function () {
        address = new Address({
            addressType: '01',
            unitNumber: '5th floor',
            building: 'Standard Bank',
            streetPOBox: '1 FOX ST',
            suburb: 'FERREIRASDORP',
            cityTown: 'JOHANNESBURG',
            postalCode: '2001',
            addressUsage: [
                {
                    usageCode: '04',
                    deleteIndicator: false,
                    validFrom: '2015-03-11T22:00:00.000+0000',
                    validTo: '9999-12-30T22:00:00.000+0000'
                },
                {
                    usageCode: '05',
                    deleteIndicator: false,
                    validFrom: '2013-03-09T22:00:00.000+0000',
                    validTo: '2015-03-09T22:00:00.000+0000'
                }
            ]
        });
    });

    it('should expose the address properties', function () {
        expect(address.unitNumber).toEqual('5th floor');
        expect(address.building).toEqual('Standard Bank');
        expect(address.streetPOBox).toEqual('1 FOX ST');
        expect(address.suburb).toEqual('FERREIRASDORP');
        expect(address.cityTown).toEqual('JOHANNESBURG');
        expect(address.postalCode).toEqual('2001');
    });

    it('should return the specific address usage', function () {
        address = new Address({
            addressType: '01',
            unitNumber: '5th floor',
            building: 'Standard Bank',
            streetPOBox: '1 FOX ST',
            suburb: 'FERREIRASDORP',
            cityTown: 'JOHANNESBURG',
            postalCode: '2001',
            addressUsage: [
                {
                    usageCode: '04',
                    deleteIndicator: false,
                    validFrom: '2015-03-11T22:00:00.000+0000',
                    validTo: '9999-12-30T22:00:00.000+0000'
                },
                {
                    usageCode: '05',
                    deleteIndicator: false,
                    validFrom: '2013-03-09T22:00:00.000+0000',
                    validTo: '2015-03-09T22:00:00.000+0000'
                }
            ]
        }, '05');

        expect(address.getUsage()).toEqual({
            usageCode: '05',
            deleteIndicator: false,
            validFrom: '2013-03-09T22:00:00.000+0000',
            validTo: '2015-03-09T22:00:00.000+0000'
        });
    });

});