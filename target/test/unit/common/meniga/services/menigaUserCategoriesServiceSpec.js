describe('Meniga User Categories Service', function () {
    'use strict';

    var menigaUserCategoriesService, test, card;

    beforeEach(module('refresh.meniga.userCategoriesService'));

    beforeEach(inject(function (_MenigaUserCategoriesService_, _ServiceTest_) {
        menigaUserCategoriesService = _MenigaUserCategoriesService_;
        test = _ServiceTest_;
        test.spyOnEndpoint('getUserCategories');
        card = {number: '122332', personalFinanceManagementId: 9};
    }));

    describe('getUserCategories', function () {
        it('should hit endpoint Meniga/User.svc/GetUserCategories', function () {
            test.stubResponse('getUserCategories', 200);

            menigaUserCategoriesService.getUserCategories(card);
            test.resolvePromise();

            expect(test.endpoint('getUserCategories')).toHaveBeenCalled();
        });

        describe('successful response from gateway', function () {
            var stubResponse = {
                payload: [{
                    "BudgetGenerationType": 12,
                    "CategoryContextId": null,
                    "CategoryRank": 0,
                    "CategoryType": 0,
                    "Children": [],
                    "DisplayData": null,
                    "Id": 98,
                    "IsFixedExpenses": false,
                    "IsPublic": true,
                    "Name": "Accommodation",
                    "OrderId": 0,
                    "OtherCategoryName": null,
                    "ParentCategoryId": 96
                }, {
                    "BudgetGenerationType": 12,
                    "CategoryContextId": null,
                    "CategoryRank": 0,
                    "CategoryType": 0,
                    "Children": [],
                    "DisplayData": "e636",
                    "Id": 81,
                    "IsFixedExpenses": false,
                    "IsPublic": true,
                    "Name": "Alcohol",
                    "OrderId": 0,
                    "OtherCategoryName": null,
                    "ParentCategoryId": 116
                }, {
                    "BudgetGenerationType": 12,
                    "CategoryContextId": null,
                    "CategoryRank": 0,
                    "CategoryType": 0,
                    "Children": [],
                    "DisplayData": "e7ab",
                    "Id": 24,
                    "IsFixedExpenses": false,
                    "IsPublic": true,
                    "Name": "Art, flowers & minor items",
                    "OrderId": 0,
                    "OtherCategoryName": null,
                    "ParentCategoryId": 64
                }, {
                    "BudgetGenerationType": 12,
                    "CategoryContextId": null,
                    "CategoryRank": 0,
                    "CategoryType": 1,
                    "Children": [],
                    "DisplayData": null,
                    "Id": 377,
                    "IsFixedExpenses": false,
                    "IsPublic": true,
                    "Name": "Assurance",
                    "OrderId": 0,
                    "OtherCategoryName": null,
                    "ParentCategoryId": 1
                }, {
                    "BudgetGenerationType": 12,
                    "CategoryContextId": null,
                    "CategoryRank": 0,
                    "CategoryType": 0,
                    "Children": [],
                    "DisplayData": null,
                    "Id": 59,
                    "IsFixedExpenses": false,
                    "IsPublic": true,
                    "Name": "Bank fees & charges",
                    "OrderId": 0,
                    "OtherCategoryName": null,
                    "ParentCategoryId": 54
                }, {
                    "BudgetGenerationType": -12,
                    "CategoryContextId": null,
                    "CategoryRank": 0,
                    "CategoryType": 0,
                    "Children": [],
                    "DisplayData": null,
                    "Id": 27,
                    "IsFixedExpenses": true,
                    "IsPublic": true,
                    "Name": "Bond repayment",
                    "OrderId": 0,
                    "OtherCategoryName": null,
                    "ParentCategoryId": 13
                }, {
                    "BudgetGenerationType": 12,
                    "CategoryContextId": null,
                    "CategoryRank": 0,
                    "CategoryType": 0,
                    "Children": [],
                    "DisplayData": "e68f",
                    "Id": 32,
                    "IsFixedExpenses": false,
                    "IsPublic": true,
                    "Name": "Cars & Transportation",
                    "OrderId": 0,
                    "OtherCategoryName": null,
                    "ParentCategoryId": null
                }]
            };

            beforeEach(function () {
                test.stubResponse('getUserCategories', 200, stubResponse);
            });

            it('should return the payload that the gateway has responded with', function () {
                var userCategories = [];
                menigaUserCategoriesService.getUserCategories(card).then(function (categories) {
                    userCategories = categories;
                });

                test.resolvePromise();

                expect(userCategories).toEqual(stubResponse);
            });

            describe('caching of user categories', function() {
                it('should load data from the cache if we have it', function () {
                    menigaUserCategoriesService.getUserCategories(card);
                    test.resolvePromise();

                    expect(menigaUserCategoriesService.getUserCategories(card)).toBeResolvedWith(stubResponse);
                    test.resolvePromise();

                    expect(test.endpoint('getUserCategories').calls.count()).toEqual(1);
                });

                it('should load data from the meniga proxy if we have cleared the cache', function () {
                    test.stubResponse('getUserCategories', 200, stubResponse);

                    menigaUserCategoriesService.getUserCategories(card);
                    test.resolvePromise();

                    menigaUserCategoriesService.clear();
                    menigaUserCategoriesService.getUserCategories(card);
                    test.resolvePromise();

                    expect(test.endpoint('getUserCategories').calls.count()).toEqual(2);
                 });
            });
        });

        describe('unsuccessful response from gateway', function () {
            var stubResponseData = {
                payload: [{
                    "BudgetGenerationType": 12,
                    "CategoryContextId": null,
                    "CategoryRank": 0,
                    "CategoryType": 0,
                    "Children": [],
                    "DisplayData": null,
                    "Id": 98,
                    "IsFixedExpenses": false,
                    "IsPublic": true,
                    "Name": "Accommodation",
                    "OrderId": 0,
                    "OtherCategoryName": null,
                    "ParentCategoryId": 96
                }]};

            it('should not return a generic error upon 204 response with 999 header', function () {
                test.stubResponse('getUserCategories', 204, stubResponseData, {"x-sbg-response-type": "ERROR", "x-sbg-response-code": "9999", "x-sbg-response-message": "This error message came from the gateway"});

                var userCategories = [];
                menigaUserCategoriesService.getUserCategories(card).then(function (categories) {
                    userCategories = categories;
                });

                test.resolvePromise();

                expect(menigaUserCategoriesService.getUserCategories(card)).toBeRejectedWith({
                    'message': 'An error has occurred',
                    'model': card,
                    "code": undefined
                });
            });

            it('should return a generic rejection upon server failure', function () {
                test.stubResponse('getUserCategories', 500, stubResponseData, {"x-sbg-response-type": "ERROR", "x-sbg-response-code": "9999", "x-sbg-response-message": "This error message came from the gateway"});

                expect(menigaUserCategoriesService.getUserCategories(card)).toBeRejectedWith(jasmine.objectContaining({
                    'message': 'An error has occurred.'
                }));

                test.resolvePromise();
            });

            it('should return the server error message when response is 200 but the SBG response type header is ERROR and the SBG response code header is not 9999', function () {
                test.stubResponse('getUserCategories', 200, stubResponseData, {"x-sbg-response-type": "ERROR", "x-sbg-response-code": "1234", "x-sbg-response-message": "This error message came from the gateway"});

                expect(menigaUserCategoriesService.getUserCategories(card)).toBeRejectedWith(jasmine.objectContaining({
                    'message': 'This error message came from the gateway'
                }));

                test.resolvePromise();
            });
        });
    });
});
