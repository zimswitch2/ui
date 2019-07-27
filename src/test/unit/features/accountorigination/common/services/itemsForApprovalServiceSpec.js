describe('Items for approval service', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.common.services.itemsForApprovalService'));

    describe('getItemsForApproval', function () {
        var service, test;

        var systemPrincipal = {
            systemPrincipalIdentifier: {
                systemPrincipalId: '1',
                systemPrincipalKey: 'SBSA_BANKING'
            }
        };

        var response = {
            itemsForApproval: [
                {
                    accountNumber: 5436543,
                    productCategory: 1,
                    acceptedDate: '2014-08-11',
                    productName: 'ELITE PLUS CURRENT ACCOUNT',
                    limitAmount: 2500
                },
                {
                    accountNumber: 40012311,
                    productCategory: 4,
                    acceptedDate: '2014-09-11',
                    productName: 'REVOLVING CREDIT PLAN',
                    limitAmount: 3200
                }
            ]
        };

        beforeEach(inject(function (ItemsForApprovalService, ServiceTest, User) {
            service = ItemsForApprovalService;
            test = ServiceTest;
            test.spyOnEndpoint('getItemsForApproval');
            spyOn(User, 'principal').and.returnValue(systemPrincipal);
            spyOn(User, 'hasDashboards').and.returnValue(true);
        }));

        describe('list', function () {
            it('response contains current and RCP account', function () {
                test.stubResponse('getItemsForApproval', 200, response);
                expect(service.list()).toBeResolvedWith({
                    current: response.itemsForApproval[0],
                    rcp: response.itemsForApproval[1]
                });
                test.resolvePromise();
            });

            it('response contains current account only', function () {
                test.stubResponse('getItemsForApproval', 200, {itemsForApproval: [response.itemsForApproval[0]]});
                expect(service.list()).toBeResolvedWith({
                    current: response.itemsForApproval[0]
                });
                test.resolvePromise();
            });

            it('response contains rcp account only', function () {
                test.stubResponse('getItemsForApproval', 200, {itemsForApproval: [response.itemsForApproval[1]]});
                expect(service.list()).toBeResolvedWith({
                    rcp: response.itemsForApproval[1]
                });
                test.resolvePromise();
            });
        });
    });
});
