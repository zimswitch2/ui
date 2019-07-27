describe('international payment pay template', function () {
    'use strict';

    var scope, element;

    beforeEach(inject(function (TemplateTest, Fixture) {
        scope = TemplateTest.scope;
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/internationalPayment/partials/internationalPaymentUpdateDetails.html'));
        element = TemplateTest.compileTemplate(html);
    }));

    it('should show resident fields if the customer is a resident', function (){
        scope.isResident = true;

        scope.$digest();

        var listItems = element.find('li');
        expect(listItems.length).toEqual(2);
        expect(listItems[0].textContent).toEqual('Your ID book');
        expect(listItems[1].textContent).toEqual('Proof of address (no older than 3 months)');
    });

    it('should show non-resident list items if the customer is not a resident', function() {
        scope.isResident = false;

        scope.$digest();

        var listItems = element.find('li');
        expect(listItems.length).toEqual(4);
        expect(listItems[0].textContent).toEqual('Your Passport');
        expect(listItems[1].textContent).toEqual('Proof of identification');
        expect(listItems[2].textContent).toEqual('Valid permit/Visa');
        expect(listItems[3].textContent).toEqual('Proof of address (no older than 3 months)');
    });
});