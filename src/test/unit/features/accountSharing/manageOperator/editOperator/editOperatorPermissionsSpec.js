describe('Account Sharing Edit Operator Permissions', function () {
    'use strict';

    beforeEach(module('refresh.accountSharing.editUserDetails'));

    var editOperatorPermissions,
        operatorServiceGetOperatorSpy,
        operatorServiceUpdateOperatorPermissionsSpy,
        mock,
        resolvePromises;

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

    var id = 2;

    beforeEach(inject(function ($rootScope, EditOperatorPermissions, OperatorService, _mock_) {
        mock = _mock_;
        editOperatorPermissions = EditOperatorPermissions;

        operatorServiceGetOperatorSpy = spyOn(OperatorService, 'getOperator');
        operatorServiceGetOperatorSpy.and.returnValue(mock.resolve(getOperatorResponse));

        operatorServiceUpdateOperatorPermissionsSpy = spyOn(OperatorService, 'updateOperatorPermissions');
        operatorServiceUpdateOperatorPermissionsSpy.and.returnValue(mock.resolve({}));

        resolvePromises = function () {
            $rootScope.$digest();
        };
    }));

    describe('editOperatorPermissions', function () {
        var editOperatorPermissionsResult;

        beforeEach(function () {

            editOperatorPermissionsResult = editOperatorPermissions.editOperatorPermissions(id);
        });

        it('should call operator service.getOperator passing in the id param', function () {
            expect(operatorServiceGetOperatorSpy).toHaveBeenCalledWith(id);
        });

        it('should resolve with the operator returned by the operator service', function () {
            expect(editOperatorPermissionsResult).toBeResolvedWith(getOperatorResponse);
        });
    });

    describe('current', function () {
        it('should return undefined by default', function () {
            expect(editOperatorPermissions.current()).not.toBeDefined();
        });

        it('after edit has been called it should return the user currently being edited', function () {
            editOperatorPermissions.editOperatorPermissions(id);
            resolvePromises();

            expect(editOperatorPermissions.current()).toEqual(getOperatorResponse);
        });
    });

    describe('updateOperatorPermissions', function () {
        beforeEach(function () {
            editOperatorPermissions.editOperatorPermissions(id);
            editOperatorPermissions.updateOperatorPermissions();
        });

        it('should call update operator permissions on the operator service passing in the current operator', function () {
            expect(operatorServiceUpdateOperatorPermissionsSpy).toHaveBeenCalledWith(editOperatorPermissions.current());
        });
    });
});
