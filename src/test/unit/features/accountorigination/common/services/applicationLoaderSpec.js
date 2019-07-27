describe('ApplicationLoader', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.common.services.applicationLoader'));

    var scope, mock, ApplicationLoader, AccountsService, QuotationsService, ItemsForApprovalService, User, Card;

    beforeEach(inject(function ($rootScope, _mock_, _ApplicationLoader_,_User_, _AccountsService_, _QuotationsService_,
                                _ItemsForApprovalService_, _Card_) {
        scope = $rootScope;
        mock = _mock_;
        ApplicationLoader = _ApplicationLoader_;
        AccountsService = _AccountsService_;
        QuotationsService = _QuotationsService_;
        User = _User_;
        ItemsForApprovalService = _ItemsForApprovalService_;
        Card = _Card_;

        spyOn(AccountsService, 'list');
        spyOn(QuotationsService, 'list');
        spyOn(ItemsForApprovalService, 'list');
        spyOn(User, 'hasBasicCustomerInformation');
        spyOn(Card, 'current');
        spyOn(Card, 'anySelected');
    }));

    it('with user that has no customer information rcp and current should be NEW', function () {
        User.hasBasicCustomerInformation.and.returnValue(false);
        var expectedApplications = {rcp: {status: 'NEW'}, current: {status: 'NEW'}};
        expect(ApplicationLoader.loadAll()).toBeResolvedWith(expectedApplications);
        scope.$digest();
    });

    using([
        {type: 'rcp', accountType: 'RCP', productName: 'REVOLVING CREDIT PLAN'},
        {type: 'current', accountType: 'CURRENT', productName: 'ELITE'}
    ], function (example) {
        describe('should load application for ' + example.accountType, function () {

            beforeEach(function () {
                AccountsService.list.and.returnValue(mock.resolve({accounts: []}));
                ItemsForApprovalService.list.and.returnValue(mock.resolve({}));
                QuotationsService.list.and.returnValue(mock.resolve({}));
                User.hasBasicCustomerInformation.and.returnValue(true);
                Card.anySelected.and.returnValue(true);
            });

            it('with EXISTING status when account is present', function () {
                AccountsService.list.and.returnValue(mock.resolve({
                    accounts: [
                        {accountType: example.accountType, formattedNumber: '2245-34-567', productName: example.productName}
                    ]
                }));

                var expectedApplications = {};
                expectedApplications[example.type] = {status: 'EXISTING', reference: '2245-34-567', productName: example.productName};
                expect(ApplicationLoader.loadAll()).toBeResolvedWith(jasmine.objectContaining(expectedApplications));
                scope.$digest();
            });

            it('with EXISTING status when account and item for approval are present', function () {
                AccountsService.list.and.returnValue(mock.resolve({
                    accounts: [
                        {accountType: example.accountType, formattedNumber: '2245-34-567',  productName: example.productName}
                    ]
                }));

                var itemsForApproval = {};
                itemsForApproval[example.type] = {accountNumber: '123-456'};
                ItemsForApprovalService.list.and.returnValue(mock.resolve(itemsForApproval));

                var expectedApplications = {};
                expectedApplications[example.type] = {status: 'EXISTING', reference: '2245-34-567', productName: example.productName};
                expect(ApplicationLoader.loadAll()).toBeResolvedWith(jasmine.objectContaining(expectedApplications));
                scope.$digest();
            });

            it('with PENDING status when quotation is present', function () {
                var quotations = {};
                quotations[example.type] = {applicationNumber: '123', applicationDate: moment('2014-11-23'), aboutToExpire: true};
                QuotationsService.list.and.returnValue(mock.resolve(quotations));

                var expectedApplications = {};
                expectedApplications[example.type] = {
                    status: 'PENDING',
                    reference: '123',
                    date: moment('2014-11-23'),
                    aboutToExpire: true
                };
                expect(ApplicationLoader.loadAll()).toBeResolvedWith(jasmine.objectContaining(expectedApplications));
                scope.$digest();
            });

            it('with ACCEPTED status when item for approval and quotation are present', function () {
                var quotations = {};
                quotations[example.type] = {applicationNumber: '123', applicationDate: moment('2014-11-23')};
                QuotationsService.list.and.returnValue(mock.resolve(quotations));

                var itemsForApproval = {};
                itemsForApproval[example.type] = {accountNumber: '123-456', "acceptedDate": "2014-09-11",  productName: example.productName, limitAmount: 5000};
                ItemsForApprovalService.list.and.returnValue(mock.resolve(itemsForApproval));

                var expectedApplications = {};
                expectedApplications[example.type] = {status: 'ACCEPTED', reference: '123-456', date: "2014-09-11", productName: example.productName, limitAmount: 5000};
                expect(ApplicationLoader.loadAll()).toBeResolvedWith(jasmine.objectContaining(expectedApplications));
                scope.$digest();
            });

            it('with NEW status when no account or started application is present', function () {
                var expectedApplications = {};
                expectedApplications[example.type] = {status: 'NEW'};
                expect(ApplicationLoader.loadAll()).toBeResolvedWith(jasmine.objectContaining(expectedApplications));
                scope.$digest();
            });

            it ('should not load accounts for new customer', function () {
                Card.anySelected.and.returnValue(false);
                ApplicationLoader.loadAll();
                scope.$digest();

                expect(AccountsService.list).not.toHaveBeenCalled();
            });

            it ('should handle errors', function () {
                var error = { message: "ERROR" };

                AccountsService.list.and.returnValue(mock.reject(error));

                expect(ApplicationLoader.loadAll()).toBeRejectedWith(error);
                scope.$digest();
            });
        });
    });
});