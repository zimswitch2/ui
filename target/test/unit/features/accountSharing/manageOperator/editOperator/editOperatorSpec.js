describe('Account Sharing Edit Operator', function () {
    'use strict';
    beforeEach(module('refresh.accountSharing.editUserDetails'));

    var editOperator,
        getOperatorSpy,
        updateOperatorSpy,
        mock,
        rootScope;

    var getOperatorResponse = {
        "id": 2,
        "status": "active",
        "userDetails": {
            "firstName": "Joanna",
            "surname": "Smith",
            "identificationType": "RSA_ID",
            "identification": "8001011967189",
            "cellphoneNumber": "27729745087",
            "cellPhone": {
                "cellPhoneNumber": "0831234567",
                "countryCode": "ZA",
                "internationalDialingCode": "27"
            }
        }
    };

    function resolvePromises() {
        rootScope.$digest();
    }

    beforeEach(inject(function (EditOperator, OperatorService, _mock_, $rootScope) {
        editOperator = EditOperator;
        mock = _mock_;
        rootScope = $rootScope;

        getOperatorSpy = spyOn(OperatorService, 'getOperator');
        updateOperatorSpy = spyOn(OperatorService, 'updateOperator');
    }));

    describe('edit operator for existing operator', function () {
        var result;

        beforeEach(function () {
            getOperatorSpy.and.returnValue(mock.resolve(getOperatorResponse));

            result = editOperator.edit(2);
        });


        it('should call get operator', function () {
            expect(getOperatorSpy).toHaveBeenCalledWith(2);
        });

        it('should return operator', function () {
            expect(result).toBeResolvedWith(getOperatorResponse);
            resolvePromises();
        });

        it('should set operator as current', function () {
            resolvePromises();
            expect(editOperator.currentOperator()).toEqual(getOperatorResponse);
        });
    });

    describe('edit operator for existing operator', function () {
        var result;

        beforeEach(function () {
            getOperatorSpy.and.returnValue(mock.resolve(undefined));

            result = editOperator.edit(2);
        });

        it('should reject promise', function () {
            expect(result).toBeRejectedWith('Operator not found');
            resolvePromises();
        });
    });

    describe('updateOperator', function () {
        beforeEach(function () {
            getOperatorSpy.and.returnValue(mock.resolve(getOperatorResponse));
            editOperator.edit(2);
            resolvePromises();

            editOperator.updateOperator();
        });

        it('should call the update operator endpoint', function () {
            expect(updateOperatorSpy).toHaveBeenCalledWith(editOperator.currentOperator());
        });
    });

    describe('currentOperator', function () {
        it('should be empty by default', function () {
            expect(editOperator.currentOperator()).toBeUndefined();
        });
    });
});
