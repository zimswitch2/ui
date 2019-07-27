describe('CustomerInformationLoader', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.domain.customer', 
        'refresh.accountOrigination.customerService',
        'refresh.test',
        'refresh.accountOrigination.domain.customerInformationLoader',
        'refresh.notifications.service'));

    var CustomerService, CustomerInformationData, ServiceTest, mock, CustomerInformationLoader;

    beforeEach(inject(function(_CustomerService_, _CustomerInformationData_, _ServiceTest_, _mock_, _CustomerInformationLoader_){
        CustomerInformationLoader = _CustomerInformationLoader_;
        mock = _mock_;
        ServiceTest = _ServiceTest_;
        CustomerService = _CustomerService_;
        CustomerInformationData = _CustomerInformationData_;
    }));

    describe('When customerService returns a customer record', function(){

        var customerRecord = {};

        beforeEach(function () {
            spyOn(CustomerService, 'getCustomer').and.returnValue(mock.resolve(customerRecord));
            spyOn(CustomerInformationData, 'initialize');
            CustomerInformationLoader.load();
            ServiceTest.resolvePromise();
        });

        it('should initialize customer information data with customer record returned from the customer service', function(){
            expect(CustomerInformationData.initialize).toHaveBeenCalledWith(customerRecord);
        });
    });

    describe('When customerService throws an error', function(){
        var NotificationService;
        var loadResult;
        var rejectedResponse = {headers:{'x-sbg-response-type':'ERROR', 'x-sbg-response-code':'1234', 'x-sbg-response-message':'an error occurred!'}};

        beforeEach(inject(function(_NotificationService_){
            NotificationService = _NotificationService_;
            spyOn(NotificationService, 'displayGenericServiceError');
            spyOn(CustomerService, 'getCustomer').and.returnValue(mock.reject(rejectedResponse));
            loadResult = CustomerInformationLoader.load();
            ServiceTest.resolvePromise();
        }));

        it('should reject the promise returned by the service', function(){
            expect(loadResult).toBeRejectedWith(rejectedResponse);

            ServiceTest.resolvePromise();
        });
    });
});