(function () {
    'use strict';

    var module = angular.module('refresh.internationalPaymentReasonController',
        [
            'refresh.internationalPaymentService',
            'refresh.internationalPayment.domain.internationalPaymentCustomer',
            'refresh.internationalPayment.domain.internationalPaymentBeneficiary',
            'refresh.internationalPayment.domain.reasonForPaymentSearch',
            'refresh.flow',
            'ngAnimate'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/international-payment/reason', {
            controller: 'InternationalPaymentReasonController',
            templateUrl: 'features/internationalPayment/partials/internationalPaymentReason.html'
        });
    });

    module.controller('InternationalPaymentReasonController', function ($scope, $location, $sce, Flow, InternationalPaymentService, InternationalPaymentCustomer, InternationalPaymentBeneficiary, ReasonForPaymentSearch) {
        $scope.back = function () {
            Flow.previous();
            $location.path('/international-payment/beneficiary/preferences');
        };

        $scope.next = function() {
            Flow.next();
            $location.path('/international-payment/pay');
        };

        $scope.beneficiary = InternationalPaymentBeneficiary.current();
        $scope.search = ReasonForPaymentSearch.get();
        $scope.pageProperties = {
            bopDeclarationIsVisible : false
        };

        $scope.filteredItems = [];

        var activeTabs = [];

        $scope.filterItems = function() {
            var mappedSubCategories = _.map($scope.bopGroups, function(item) {
               return item.bopCategories;
            });

            var subCategories = _.flatten(mappedSubCategories);

            var filteredItems = _.filter(subCategories, function(subCategory) {
                var searchWords = $scope.search.searchText.toLowerCase().split(' ');
                var subCategoryDescriptionWords = [subCategory.bopCode.toString() + '-' + subCategory.bopSubCategoryCode].concat(subCategory.categoryDescription.toLowerCase().split(' '));

                function isMatchWithWordThatContains(descriptionWordList, searchWordList) {
                    if (descriptionWordList.length === 0 && searchWordList.length > 0) {
                        return false;
                    } else if (searchWordList.length === 0) {
                        return true;
                    }

                    for(var i = 0; i < searchWordList.length; i++) {
                        if (descriptionWordList[0].indexOf(searchWordList[i]) > -1) {
                            searchWordList.splice(i, 1);
                        }
                    }

                    descriptionWordList.splice(0, 1);
                    return isMatchWithWordThatContains(descriptionWordList, searchWordList);
                }

                var searchWordsMatch = isMatchWithWordThatContains(subCategoryDescriptionWords, searchWords);
                return searchWordsMatch;
            });

            var uniqueItems = [];
            var itemAlreadyExists = function(filteredItem) {
                var existingItem = _.find(uniqueItems, function(item) {
                    return item.bopCode === filteredItem.bopCode && item.bopSubCategoryCode === filteredItem.bopSubCategoryCode;
                });

                return !!existingItem;
            };

            for(var i = 0; i < filteredItems.length; i++) {
                if (!itemAlreadyExists(filteredItems[i])) {
                    uniqueItems.push(filteredItems[i]);
                }
            }

            $scope.filteredItems = uniqueItems;
        };

        $scope.renderSearchItemHtml = function(bopCode, bopSubCategoryCode, itemText) {
            var searchWords = $scope.search.searchText.toLowerCase().split(' ');
            var subCategoryDescriptionWords = [bopCode + '-' + bopSubCategoryCode].concat(itemText.split(' '));

            function renderItemText(descriptionWordList, searchWordList, finalWordList) {
                if (descriptionWordList.length === 0) {
                    return finalWordList;
                } else if (searchWordList.length === 0) {
                    return finalWordList.concat(descriptionWordList);
                }

                var wordHasMatch = false;
                for (var i = 0; i < searchWordList.length; i++){
                    var indexOfMatch = descriptionWordList[0].toLowerCase().indexOf(searchWordList[i].toLowerCase());
                    if (indexOfMatch > -1) {
                        var lengthOfMatch = searchWordList[i].length;
                        var boldWord = [
                            descriptionWordList[0].substring(0, indexOfMatch),
                            '<strong>',
                            descriptionWordList[0].substring(indexOfMatch, lengthOfMatch + indexOfMatch),
                            '</strong>',
                            descriptionWordList[0].substring(indexOfMatch +  lengthOfMatch)
                        ].join('');

                        //var boldWord = '<strong>' + descriptionWordList[0].substring(0, searchWordList[i].length) + '</strong>' + descriptionWordList[0].substring(searchWordList[i].length);
                        finalWordList.push(boldWord);
                        searchWordList.splice(i, 1);
                        wordHasMatch = true;
                    }
                }

                if (!wordHasMatch) {
                    finalWordList.push(descriptionWordList[0]);
                }

                descriptionWordList.splice(0, 1);
                return renderItemText(descriptionWordList, searchWordList, finalWordList);
            }

            var fullWordArray = renderItemText(subCategoryDescriptionWords, searchWords, []);
            return $sce.trustAsHtml(fullWordArray[0] + ' - ' + fullWordArray.splice(1).join(' '));

        };

        $scope.selectSearchItem = function(selectedItem) {
            $scope.selectItem(selectedItem);
        };

        $scope.clearSearch = function() {
            $scope.search.searchText = '';
        };

        $scope.isOpenTab = function (group) {
            return $scope.currentGroup && $scope.currentGroup.groupName === group.groupName;
        };

        $scope.openTab = function (group) {
            $scope.currentGroup = group;
            $scope.pageProperties.hiddenBopGroupsVisible = false;
        };

        $scope.selectItem = function(item) {
            $scope.beneficiary.reasonForPayment = item;
            $scope.showBopDeclaration();
        };

        $scope.isItemSelected = function(item) {
            return angular.equals(item, $scope.beneficiary.reasonForPayment);
        };

        $scope.isSelectedItemInGroup = function(subItems) {

            var counter;
            for (counter = 0; counter < subItems.length; counter ++) {
                if (angular.equals(subItems[counter], $scope.beneficiary.reasonForPayment)) {
                    return true;
                }
            }

            return false;
        };

        $scope.canProceed = function() {
            return $scope.beneficiary.reasonForPayment.bopCode;
        };

        $scope.showBopDeclaration = function() {
            $scope.pageProperties.bopDeclarationIsVisible = true;
        };

        $scope.closeBopDeclaration = function() {
            $scope.pageProperties.bopDeclarationIsVisible = false;
        };

        $scope.visibleBopGroups = function() {
            return $scope.bopGroups.slice(0, 3);
        };

        $scope.hiddenBopGroups = function() {
            return $scope.bopGroups.slice(3, $scope.bopGroups.length);
        };

        $scope.showMoreGroups = function() {
            $scope.pageProperties.hiddenBopGroupsVisible = !!!$scope.pageProperties.hiddenBopGroupsVisible;
        };

        $scope.isOpenGroupHidden = function () {
            return _.findIndex($scope.hiddenBopGroups(), function(group) {
                return $scope.isOpenTab(group);
            }) > -1;
        };

        var openSelectedGroup = function() {
            var groupCounter;
            for (groupCounter = 0; groupCounter < $scope.bopGroups.length; groupCounter ++) {
                if ($scope.isSelectedItemInGroup($scope.bopGroups[groupCounter].bopCategories)) {
                    $scope.openTab($scope.bopGroups[groupCounter]);
                    break;
                }
            }
        };

        InternationalPaymentService.getBopGroups(InternationalPaymentCustomer.customer().isResident(), "ZA").then(function (bopGroups) {
            var groupCodes = {
                100: 'Imports',
                200: 'Services',
                300: 'Rent and Compensation',
                400: 'Transfers',
                500: 'Capital',
                600: 'Investments',
                700: 'Derivatives'
            };

            var filteredBopGroups = _.filter(bopGroups, function(bopGroup) {
                return bopGroup.bopCategories && bopGroup.bopCategories.length > 0;
            });

            $scope.bopGroups = _.map(filteredBopGroups, function (bopGroup) {
                bopGroup.label = groupCodes[bopGroup.groupCode];
                return bopGroup;
            });

            if ($scope.search.searchText.length > 0) {
                $scope.filterItems();
            }

            if ($scope.beneficiary.reasonForPayment.bopCode) {
                openSelectedGroup();
            } else {
                $scope.openTab($scope.bopGroups[0]);
            }
        });
    });
})();
