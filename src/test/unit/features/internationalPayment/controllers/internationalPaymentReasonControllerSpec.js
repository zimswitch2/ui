describe('Unit Test - International Payment Reason Controller', function() {
    'use strict';

    beforeEach(module('refresh.internationalPaymentReasonController', 'refresh.test'));

    describe('routes', function() {
        var route, location;
        beforeEach(inject(function($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the international payment reason controller', function() {
            expect(route.routes['/international-payment/reason'].controller).toBe('InternationalPaymentReasonController');
        });

        it('should load the international payment reason template', function() {
            expect(route.routes['/international-payment/reason'].templateUrl).toBe('features/internationalPayment/partials/internationalPaymentReason.html');
        });
    });

    describe('controller', function() {
        var controller, scope, location, Flow, mock, internationalPaymentService, internationalPaymentCustomer, internationalPaymentBeneficiary, reasonForPaymentSearch;

        var bopGroups = [{
            "bopCategories": [{
                "bopCode": 101,
                "bopFields": [],
                "bopSubCategoryCode": "1",
                "categoryDescription": "Imports: Advance payments (not in terms of import undertaking)",
                "maximumAmount": 0,
                "residentOnly": true
            }, {
                "bopCode": 101,
                "bopFields": [{
                    "description": "Customs Client Number",
                    "fieldName": "CCN",
                    "mandatory": null
                }],
                "bopSubCategoryCode": "11",
                "categoryDescription": "Imports: Advance payment - goods imported via the South African Post Office",
                "maximumAmount": 0,
                "residentOnly": true
            }, {
                "bopCode": 103,
                "bopFields": [{
                    "description": "Customs Client Number",
                    "fieldName": "CCN",
                    "mandatory": null
                }],
                "bopSubCategoryCode": "11",
                "categoryDescription": "Import payment - goods imported via the South African Post Office",
                "maximumAmount": 0,
                "residentOnly": true
            }],
            "description": null,
            "groupCode": null,
            "groupName": "Most Used"
        }, {
            "bopCategories": [{
                "bopCode": 201,
                "bopFields": [],
                "bopSubCategoryCode": "0",
                "categoryDescription": "Rights obtained for licences to reproduce and/or distribute",
                "maximumAmount": 0,
                "residentOnly": true
            }],
            "description": null,
            "groupCode": null,
            "groupName": "Other Group"
        }, {
            "bopCategories": [{
                "bopCode": 201,
                "bopFields": [],
                "bopSubCategoryCode": "0",
                "categoryDescription": "Rights obtained for licences to reproduce and/or distribute",
                "maximumAmount": 0,
                "residentOnly": true
            }, {
                "bopCode": 202,
                "bopFields": [],
                "bopSubCategoryCode": "0",
                "categoryDescription": "Rights obtained for using patents and inventions (licensing)",
                "maximumAmount": 0,
                "residentOnly": true
            }, {
                "bopCode": 204,
                "bopFields": [],
                "bopSubCategoryCode": "0",
                "categoryDescription": "Rights obtained for using copyrights",
                "maximumAmount": 0,
                "residentOnly": true
            }],
            "description": null,
            "groupCode": null,
            "groupName": "Third group"
        }];

        function invokeController() {
            controller('InternationalPaymentReasonController', {
                $scope: scope,
                $location: location,
                Flow: Flow,
                InternationalPaymentService: internationalPaymentService,
                InternationalPaymentCustomer: internationalPaymentCustomer,
                InternationalPaymentBeneficiary: internationalPaymentBeneficiary
            });

            scope.$digest();
        }

        beforeEach(inject(function($controller, $rootScope, $location, _Flow_, _mock_, $q, InternationalPaymentCustomer, InternationalPaymentBeneficiary, ReasonForPaymentSearch) {
            controller = $controller;
            scope = $rootScope.$new();
            location = $location;
            Flow = _Flow_;
            mock = _mock_;

            internationalPaymentService = jasmine.createSpyObj('internationalPaymentService', ['getBopGroups']);
            internationalPaymentService.getBopGroups.and.returnValue($q.defer().promise);

            internationalPaymentCustomer = InternationalPaymentCustomer;
            internationalPaymentCustomer.initialize({});

            internationalPaymentBeneficiary = InternationalPaymentBeneficiary;
            internationalPaymentBeneficiary.initialize();

            reasonForPaymentSearch = ReasonForPaymentSearch;
        }));

        describe('initialize', function() {
            it('should load the bop groups', function() {
                internationalPaymentService.getBopGroups.and.returnValue(mock.resolve(bopGroups));
                invokeController();

                expect(scope.bopGroups).toEqual(bopGroups);
            });

            it('should set the first bop group as the active bop group', function() {
                internationalPaymentService.getBopGroups.and.returnValue(mock.resolve(bopGroups));
                invokeController();

                expect(scope.isOpenTab(bopGroups[0])).toBeTruthy();
            });

            it('should not include bop groups with no bop categories', function() {
                var exampleBopGroups = [{
                    "bopCategories": [{
                        "bopCode": 101,
                        "bopFields": [],
                        "bopSubCategoryCode": "1",
                        "categoryDescription": "Imports: Advance payments (not in terms of import undertaking)",
                        "maximumAmount": 0,
                        "residentOnly": true
                    }],
                    "description": null,
                    "groupCode": "100",
                    "groupName": "Merchandise"
                }, {
                    "bopCategories": [],
                    "description": null,
                    "groupCode": "200",
                    "groupName": "Intellectual property and other services"
                }];

                internationalPaymentService.getBopGroups.and.returnValue(mock.resolve(exampleBopGroups));
                invokeController();

                expect(scope.bopGroups).toEqual([exampleBopGroups[0]]);
            });

            it('should set the beneficiary on the scope', function() {
                invokeController();
                expect(scope.beneficiary).toEqual(internationalPaymentBeneficiary.current());
            });

            it('should create a new search object with empty text', function() {
                invokeController();
                expect(scope.search.searchText).toEqual('');
            });

            it('should create a new search filtered items array', function() {
                invokeController();
                expect(scope.filteredItems).toEqual([]);
            });

            it('should create a page properties object with bop declaration visible', function() {
                invokeController();
                expect(scope.pageProperties.bopDeclarationIsVisible).toBeDefined();
            });

            it('should perform a search if there is search text', function() {
                reasonForPaymentSearch.get().searchText = 'rights obtained for licences to reproduce and/or distribute';
                internationalPaymentService.getBopGroups.and.returnValue(mock.resolve(bopGroups));

                invokeController();
                expect(scope.filteredItems).toEqual([{
                    "bopCode": 201,
                    "bopFields": [],
                    "bopSubCategoryCode": "0",
                    "categoryDescription": "Rights obtained for licences to reproduce and/or distribute",
                    "maximumAmount": 0,
                    "residentOnly": true
                }]);
            });

            it('should not perform a search if there is no search text', function() {
                reasonForPaymentSearch.get().searchText = '';
                invokeController();
                expect(scope.filteredItems).toEqual([]);
            });
        });

        describe('next button', function() {
            beforeEach(function() {
                spyOn(Flow, 'next');
                invokeController();
            });

            it('should be disabled if there is no reason for payment code', function() {
                scope.beneficiary.reasonForPayment = {};
                expect(scope.canProceed()).toBeFalsy();
            });

            it('should be enabled if there is a reason for payment code', function() {
                scope.beneficiary.reasonForPayment = bopGroups[0].bopCategories[1];
                expect(scope.canProceed()).toBeTruthy();
            });

            it('should navigate to international payment pay', function() {
                scope.beneficiary.reasonForPayment = bopGroups[0].bopCategories[1];
                scope.next();
                expect(location.url()).toBe('/international-payment/pay');
            });

            it('should go back to the next step of flow', function() {
                scope.beneficiary.reasonForPayment = bopGroups[0].bopCategories[1];
                scope.next();
                expect(Flow.next).toHaveBeenCalled();
            });
        });


        describe("when back is clicked", function() {
            beforeEach(function() {
                spyOn(Flow, 'previous');
                invokeController();
                scope.back();
            });

            it('should navigate to international payment beneficiary preferences', function() {
                expect(location.url()).toBe('/international-payment/beneficiary/preferences');
            });

            it('should continue to the previous step of Flow', function() {
                expect(Flow.previous).toHaveBeenCalled();
            });
        });

        describe('search', function() {
            beforeEach(function() {
                internationalPaymentService.getBopGroups.and.returnValue(mock.resolve(bopGroups));
                invokeController();
            });

            it('should filter the search items and return the matching sub-categories', function() {
                scope.search.searchText = "rights obtained for licences to reproduce and/or distribute";

                scope.filterItems();

                expect(scope.filteredItems).toEqual([{
                    "bopCode": 201,
                    "bopFields": [],
                    "bopSubCategoryCode": "0",
                    "categoryDescription": "Rights obtained for licences to reproduce and/or distribute",
                    "maximumAmount": 0,
                    "residentOnly": true
                }]);
            });

            it('should filter the search items and return the matching sub-categories for words that contain', function() {
                scope.search.searchText = "igh obt icenc repr istrib";

                scope.filterItems();

                expect(scope.filteredItems).toEqual([{
                    "bopCode": 201,
                    "bopFields": [],
                    "bopSubCategoryCode": "0",
                    "categoryDescription": "Rights obtained for licences to reproduce and/or distribute",
                    "maximumAmount": 0,
                    "residentOnly": true
                }]);
            });

            it('should render the search result correctly for words starting with', function() {
                scope.search.searchText = "rig obt lic repr";

                var renderedHtml = scope.renderSearchItemHtml(100, '01', "Rights obtained for licences to reproduce and/or distribute");

                expect(renderedHtml.$$unwrapTrustedValue()).toEqual("100-01 - <strong>Rig</strong>hts <strong>obt</strong>ained for <strong>lic</strong>ences to <strong>repr</strong>oduce and/or distribute");
            });

            it('should render the search result correctly for words starting with in wrong order', function() {
                scope.search.searchText = "rig lic repr obt";

                var renderedHtml = scope.renderSearchItemHtml(100, '01', "Rights obtained for licences to reproduce and/or distribute");

                expect(renderedHtml.$$unwrapTrustedValue()).toEqual("100-01 - <strong>Rig</strong>hts <strong>obt</strong>ained for <strong>lic</strong>ences to <strong>repr</strong>oduce and/or distribute");
            });

            it('should render the search result correctly with a bold bop code if bop code is searched for', function() {
                scope.search.searchText = "100 ight obt cences repr distr";

                var renderedHtml = scope.renderSearchItemHtml(100, '01', "Rights obtained for licences to reproduce and/or distribute");

                expect(renderedHtml.$$unwrapTrustedValue()).toEqual("<strong>100</strong>-01 - R<strong>ight</strong>s <strong>obt</strong>ained for li<strong>cences</strong> to <strong>repr</strong>oduce and/or <strong>distr</strong>ibute");
            });

            it('should return search items and return the matching sub-categories for words starting with in the wrong order', function() {
                scope.search.searchText = "rig lic repr distr obt";

                scope.filterItems();

                expect(scope.filteredItems).toEqual([{
                    "bopCode": 201,
                    "bopFields": [],
                    "bopSubCategoryCode": "0",
                    "categoryDescription": "Rights obtained for licences to reproduce and/or distribute",
                    "maximumAmount": 0,
                    "residentOnly": true
                }]);
            });

            it('should search on bop code', function() {
                scope.search.searchText = '201';

                scope.filterItems();

                expect(scope.filteredItems).toEqual([{
                    "bopCode": 201,
                    "bopFields": [],
                    "bopSubCategoryCode": "0",
                    "categoryDescription": "Rights obtained for licences to reproduce and/or distribute",
                    "maximumAmount": 0,
                    "residentOnly": true
                }]);
            });

            it('should not duplicate items which are in multiple groups', function() {
                scope.search.searchText = 'Imports: Advance payments (not in terms of import undertaking)';

                scope.filterItems();

                expect(scope.filteredItems.length).toEqual(1);
            });

            it('should set the selected item when a search result is selected', function() {
                scope.selectSearchItem(bopGroups[1].bopCategories[0]);

                expect(scope.beneficiary.reasonForPayment).toEqual(bopGroups[1].bopCategories[0]);
            });

            it('should clear the search text when a search result is selected', function() {
                scope.search.searchText = 'long search text';
                scope.clearSearch();

                expect(scope.search.searchText).toEqual('');
            });
        });

        describe('bop categories selection', function() {
            beforeEach(function() {
                internationalPaymentService.getBopGroups.and.returnValue(mock.resolve(bopGroups));
                invokeController();
            });

            it('should state item as open when item is opened', function() {
                scope.openTab(bopGroups[0]);
                expect(scope.isOpenTab(bopGroups[0])).toBeTruthy();
            });

            it('should hide the hidden groups', function() {
                scope.pageProperties.hiddenBopsVisible = true;
                scope.openTab(bopGroups[0]);
                expect(scope.pageProperties.hiddenBopGroupsVisible).toBeFalsy();

            });

            describe('for resident', function() {
                beforeEach(function() {
                    internationalPaymentCustomer.initialize({
                        idNumber: '1234656789'
                    });
                });

                it('should clear the previous item when an item is selected', function() {
                    scope.openTab(bopGroups[0]);
                    scope.openTab(bopGroups[1]);
                    expect(scope.isOpenTab(bopGroups[0])).toBeFalsy();
                });

                it('should keep the item open if it is already selected', function() {
                    scope.openTab(bopGroups[0]);
                    scope.openTab(bopGroups[0]);
                    expect(scope.isOpenTab(bopGroups[0])).toBeTruthy();
                });
            });

            it('should set an item on the beneficiary when it is selected', function() {
                scope.selectItem({
                    key: 'value'
                });
                expect(scope.beneficiary.reasonForPayment).toEqual({
                    key: 'value'
                });
            });

            it('should return an item as selected if it has been selected', function() {
                scope.selectItem({
                    key: 'value'
                });
                expect(scope.isItemSelected({
                    key: 'value'
                })).toBeTruthy();
            });

            it('should return an item as not selected if it has not been selected', function() {
                scope.selectItem({
                    key: 'value'
                });
                expect(scope.isItemSelected({
                    key: 'value 2'
                })).toBeFalsy();
            });

            it('should show the bop declaration when an item is selected', function() {
                scope.selectItem({
                    key: 'value'
                });

                expect(scope.pageProperties.bopDeclarationIsVisible).toBeTruthy();
            });

            it('should open the first tab which has the selected item when the controller initializes', function() {
                internationalPaymentBeneficiary.current().reasonForPayment = bopGroups[2].bopCategories[0];

                invokeController();

                expect(scope.isOpenTab(bopGroups[1])).toBeTruthy();
            });
        });

        describe('modal popup', function() {
            beforeEach(function() {
                internationalPaymentService.getBopGroups.and.returnValue(mock.resolve(bopGroups));
                invokeController();
            });

            it('should set the modal popup to open when show is called', function() {
                scope.showBopDeclaration();
                expect(scope.pageProperties.bopDeclarationIsVisible).toBeTruthy();
            });

            it('should set the modal popup to closed when close is called', function() {
                scope.showBopDeclaration();
                scope.closeBopDeclaration();
                expect(scope.pageProperties.bopDeclarationIsVisible).toBeFalsy();
            });
        });

        describe('visible groups', function() {

            var bopGroupList = [{
                "bopCategories": [{
                    "bopCode": 101,
                    "bopFields": [],
                    "bopSubCategoryCode": "1",
                    "categoryDescription": "Imports: Advance payments (not in terms of import undertaking)",
                    "maximumAmount": 0,
                    "residentOnly": true
                }],
                "description": null,
                "groupCode": "100",
                "groupName": "Group 1"
            }, {
                "bopCategories": [{
                    "bopCode": 101,
                    "bopFields": [],
                    "bopSubCategoryCode": "1",
                    "categoryDescription": "Imports: Advance payments (not in terms of import undertaking)",
                    "maximumAmount": 0,
                    "residentOnly": true
                }],
                "description": null,
                "groupCode": "200",
                "groupName": "Group 2"
            }, {
                "bopCategories": [{
                    "bopCode": 101,
                    "bopFields": [],
                    "bopSubCategoryCode": "1",
                    "categoryDescription": "Imports: Advance payments (not in terms of import undertaking)",
                    "maximumAmount": 0,
                    "residentOnly": true
                }],
                "description": null,
                "groupCode": "200",
                "groupName": "Group 3"
            }, {
                "bopCategories": [{
                    "bopCode": 101,
                    "bopFields": [],
                    "bopSubCategoryCode": "1",
                    "categoryDescription": "Imports: Advance payments (not in terms of import undertaking)",
                    "maximumAmount": 0,
                    "residentOnly": true
                }],
                "description": null,
                "groupCode": "200",
                "groupName": "Group 4"
            }, {
                "bopCategories": [{
                    "bopCode": 101,
                    "bopFields": [],
                    "bopSubCategoryCode": "1",
                    "categoryDescription": "Imports: Advance payments (not in terms of import undertaking)",
                    "maximumAmount": 0,
                    "residentOnly": true
                }],
                "description": null,
                "groupCode": "200",
                "groupName": "Group 5"
            }];

            beforeEach(function() {
                internationalPaymentService.getBopGroups.and.returnValue(mock.resolve(bopGroupList));
                invokeController();
            });

            it('should show the first three groups as the visible groups', function() {
                expect(scope.visibleBopGroups()).toEqual([bopGroupList[0], bopGroupList[1], bopGroupList[2]]);
            });

            it('should show the remaining groups as the hidden groups', function() {
                expect(scope.hiddenBopGroups()).toEqual([bopGroupList[3], bopGroupList[4]]);
            });

            it('should show the hidden groups when showMoreGroups method is called', function() {
                scope.showMoreGroups();
                expect(scope.pageProperties.hiddenBopGroupsVisible).toBeTruthy();
            });

            it('should hide the hidden groups when showMoreGroups method is called for the second time', function() {
                scope.showMoreGroups();
                scope.showMoreGroups();
                expect(scope.pageProperties.hiddenBopGroupsVisible).toBeFalsy();
            });

            it('should state that open group is hidden of current group is hidden', function() {
                scope.openTab(bopGroupList[4]);
                expect(scope.isOpenGroupHidden()).toBeTruthy();
            });

            it('should state that open group is not hidden of current group is not hidden', function() {
                scope.openTab(bopGroupList[1]);
                expect(scope.isOpenGroupHidden()).toBeFalsy();
            });
        });
    });
});
