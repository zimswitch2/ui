'use strict';

(function (app) {
    app.constant('CurrentAccountProductContent', (function () {
        var feeStructures = {
            payAsYouTransact: {
                name: 'Pay as you transact',
                description: 'Pay for each transaction, and a minimum monthly service fee'
            },
            fixed: {
                name: 'Fixed monthly fee',
                description: 'Pay a single monthly management fee for a fixed number of transactions and services'
            }
        };
        var content = {
            consolidator: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/consolidator.html',
                fee: 'No minimum monthly service fees',
                feeStructure: feeStructures.payAsYouTransact
            },
            consolidatorPlus: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/consolidatorPlus.html',
                fee: 'R 45 monthly fee',
                feeStructure: feeStructures.fixed
            },
            elite: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/elite.html',
                fee: 'R 55 minimum monthly fee',
                feeStructure: feeStructures.payAsYouTransact
            },
            elitePlus: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/elitePlus.html',
                fee: 'R 95 monthly fee',
                feeStructure: feeStructures.fixed
            },
            prestige: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/prestige.html',
                fee: 'R 94 minimum monthly fee',
                feeStructure: feeStructures.payAsYouTransact
            },
            prestigePlus: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/prestigePlus.html',
                fee: 'R 179 monthly fee',
                feeStructure: feeStructures.fixed
            },
            privatePlus: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/privatePlus.html',
                fee: 'R 325 monthly fee',
                feeStructure: feeStructures.fixed,
                productFamily: 'PRIVATE BANKING - 140'
            },
            staffConsolidator: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/consolidator.html',
                feeStructure: feeStructures.payAsYouTransact
            },
            staffConsolidatorPlus: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/consolidatorPlus.html',
                feeStructure: feeStructures.fixed
            },
            staffElite: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/elite.html',
                feeStructure: feeStructures.payAsYouTransact
            },
            staffElitePlus: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/elitePlus.html',
                feeStructure: feeStructures.fixed
            },
            staffPrestigePlus: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/prestigePlus.html',
                feeStructure: feeStructures.fixed
            },
            staffPrivatePlus: {
                partial: 'features/accountorigination/currentaccount/screens/highlights/privatePlus.html',
                feeStructure: feeStructures.fixed
            }
        };

        return {
            9143: content.consolidator,
            642: content.consolidatorPlus,
            2: content.elite,
            132: content.elite,
            9141: content.elite,
            641: content.elitePlus,
            643: content.elitePlus,
            645: content.elitePlus,
            9181: content.prestige,
            9144: content.prestigePlus,
            153: content.staffConsolidator,
            652: content.staffConsolidatorPlus,
            151: content.staffElite,
            157: content.staffElite,
            229: content.staffElite,
            647: content.staffElitePlus,
            650: content.staffElitePlus,
            651: content.staffElitePlus,
            155: content.staffPrestigePlus,
            644: content.privatePlus,
            648: content.staffPrivatePlus
        };
    })());

    app.factory('CurrentAccountProductFamilyContent', function () {
        var content = {
            PRESTIGE: {
                id: 'prestige',
                name: 'Prestige Banking',
                imageUrl: 'assets/images/Offer_Image.jpg',
                tagLine: 'A complete banking solution with personalised service',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/prestigeBanking.html'
            },
            ELITE: {
                id: 'elite',
                name: 'Elite Banking',
                imageUrl: 'assets/images/Offer_Image.jpg',
                tagLine: 'A streamlined, convenient current account that gives you control of your finances',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/eliteAccount.html'
            },
            CONSOLIDATOR: {
                id: 'consolidator',
                name: 'Consolidator Current Account',
                imageUrl: 'assets/images/Offer_Image.jpg',
                tagLine: 'Simple finance management for over-55s',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/consolidatorCurrentAccount.html'
            },
            GRADUATE: {
                id: 'graduate',
                name: 'Graduate and Professional Banking',
                tagLine: 'You studied hard for your profession. Now, get the exclusive financial solution you deserve',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/graduateBanking.html'
            },
            PRIVATE: {
                id: 'private',
                name: 'Private Banking',
                imageUrl: 'assets/images/Offer_Image.jpg',
                tagLine: 'Exclusive wealth management solutions, supported by your own private banker',
                partial: 'features/accountorigination/currentaccount/screens/products/partials/privateBanking.html'
            }
        };

        var productFamilies = {
            'PRESTIGE': content['PRESTIGE'],
            'STAFF PRESTIGE': content['PRESTIGE'],
            'CONSOLIDATOR': content['CONSOLIDATOR'],
            'STAFF CONSOLIDATOR': content['CONSOLIDATOR'],
            'ELITE': content['ELITE'],
            'STAFF ELITE': content['ELITE'],
            'ACHIEVER': content['ELITE'],
            'STAFF ACHIEVER': content['ELITE'],
            'CLASSIC': content['ELITE'],
            'STAFF CLASSIC': content['ELITE'],
            'PRIVATE BANKING - 140': content['PRIVATE'],
            'STAFF PRIVATE BANKING - 140': content['PRIVATE']
        };

        return {
            for: function (productFamily) {
                return productFamilies[productFamily];
            },
            all: function () {
                return [
                    content['CONSOLIDATOR'],
                    content['ELITE'],
                    content['PRESTIGE'],
                    content['PRIVATE']
                ];
            }
        };
    });

})(angular.module('refresh.accountOrigination.currentAccount.domain.currentAccountProductContent', []));


