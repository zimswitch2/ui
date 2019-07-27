describe('TransferLimitsService', function () {
    beforeEach(module('refresh.transfers.limits'));
    var service;

    beforeEach(inject(function (TransferLimitsService) {
        service = new TransferLimitsService();
    }));

    var cardProfile = {dailyWithdrawalLimit: {amount: 10000}};

    var transactionAccount =     { availableBalance: {amount: 10000}, accountType: "CURRENT" };
    var notice32DayAccount =     { availableBalance: {amount: 10000}, accountType: "NOTICE" };
    var homeLoansAccount =       { availableBalance: {amount: 10000}, accountType: "HOME_LOAN" };
    var creditCardAccount =      { availableBalance: {amount: 10000}, accountType: "CREDIT_CARD" };
    var moneyMarketAccount =     { availableBalance: {amount: 10000}, accountType: "SAVINGS" };
    var revolvingCreditAccount = { availableBalance: {amount: 10000}, accountType: "RCP" };

    var allToAccounts = [transactionAccount, notice32DayAccount, homeLoansAccount, creditCardAccount, moneyMarketAccount, revolvingCreditAccount];
    var allToAccountsWithoutNotice = _.without(allToAccounts, notice32DayAccount);

    function getAccountType(account) {
        return account instanceof Array ? (account.length === 6 ? 'ALL accounts' : 'ALL accounts without NOTICE') : account.accountType;
    }

    describe('validate internal transfer amount', function() {
        function expectEnforce(example, expectedMessage) {
            var toAccountType = getAccountType(example.toAccount);
            var itDescription = expectedMessage.error ? 'should not' : 'should';
            itDescription = itDescription + ' allow R' + example.amount + ' from ' + example.fromAccount.accountType + ' to ' + toAccountType;
            it(itDescription, function () {
                var toAccounts = example.toAccount instanceof Array ? example.toAccount : [example.toAccount];
                for (var i = 0; i < toAccounts.length; i++) {
                    expect(service.enforce({ cardProfile: cardProfile, fromAccount: example.fromAccount, amount: example.amount, toAccount: toAccounts[i] })).toEqual(expectedMessage);
                }
            });
        }

        using([
            {fromAccount: transactionAccount, toAccount: allToAccountsWithoutNotice, amount: 0.01},
            {fromAccount: transactionAccount, toAccount: notice32DayAccount, amount: 250},
            {fromAccount: transactionAccount, toAccount: notice32DayAccount, amount: 250.01},

            {fromAccount: homeLoansAccount, toAccount: allToAccounts, amount: 1000},
            {fromAccount: homeLoansAccount, toAccount: allToAccounts, amount: 2000},

            {fromAccount: creditCardAccount, toAccount: allToAccountsWithoutNotice, amount: 0.01},
            {fromAccount: creditCardAccount, toAccount: notice32DayAccount, amount: 250},
            {fromAccount: creditCardAccount, toAccount: notice32DayAccount, amount: 250.01},

            {fromAccount: moneyMarketAccount, toAccount: allToAccountsWithoutNotice, amount: 100 },
            {fromAccount: moneyMarketAccount, toAccount: allToAccountsWithoutNotice, amount: 100.01 },
            {fromAccount: moneyMarketAccount, toAccount: notice32DayAccount, amount: 250},
            {fromAccount: moneyMarketAccount, toAccount: notice32DayAccount, amount: 250.01},

            {fromAccount: revolvingCreditAccount, toAccount: allToAccountsWithoutNotice, amount: 100},
            {fromAccount: revolvingCreditAccount, toAccount: allToAccountsWithoutNotice, amount: 200},
            {fromAccount: revolvingCreditAccount, toAccount: notice32DayAccount, amount: 300},
            {fromAccount: revolvingCreditAccount, toAccount: notice32DayAccount, amount: 400}
        ], function(example) {
            expectEnforce(example, {});
        });

        using([
            {fromAccount: transactionAccount, toAccount: notice32DayAccount, amount: 249.99},

            {fromAccount: homeLoansAccount, toAccount: allToAccounts, amount: 999.99},
            {fromAccount: homeLoansAccount, toAccount: allToAccounts, amount: 1000.01},

            {fromAccount: creditCardAccount, toAccount: notice32DayAccount, amount: 249.99},

            {fromAccount: moneyMarketAccount, toAccount: allToAccountsWithoutNotice, amount: 99.99},
            {fromAccount: moneyMarketAccount, toAccount: notice32DayAccount, amount: 249.99},

            {fromAccount: revolvingCreditAccount, toAccount: allToAccountsWithoutNotice, amount: 99.99 },
            {fromAccount: revolvingCreditAccount, toAccount: notice32DayAccount, amount: 200},
            {fromAccount: revolvingCreditAccount, toAccount: notice32DayAccount, amount: 299.99},
            {fromAccount: revolvingCreditAccount, toAccount: notice32DayAccount, amount: 300.01}
        ], function(example) {
            expectEnforce(example, {error: true, type: 'invalidTransferAmount', message: 'Please enter a valid amount as per guidelines below'});
        });
    });

    describe('validate hint', function() {
        using([
            {fromAccount: transactionAccount, toAccount: notice32DayAccount, infoMessage: 'Enter an amount of at least <span class="rand-amount">R 250</span>'},
            {fromAccount: transactionAccount, toAccount: allToAccountsWithoutNotice, infoMessage: undefined},

            {fromAccount: homeLoansAccount, toAccount: allToAccounts, infoMessage: 'Enter amount in denominations of <span class="rand-amount">R 1000</span>'},

            {fromAccount: creditCardAccount, toAccount: allToAccountsWithoutNotice, infoMessage: undefined},
            {fromAccount: creditCardAccount, toAccount: notice32DayAccount, infoMessage: 'Enter an amount of at least <span class="rand-amount">R 250</span>'},

            {fromAccount: moneyMarketAccount, toAccount: allToAccountsWithoutNotice, infoMessage: 'Enter an amount of at least <span class="rand-amount">R 100</span>'},
            {fromAccount: moneyMarketAccount, toAccount: notice32DayAccount, infoMessage: 'Enter an amount of at least <span class="rand-amount">R 250</span>'},

            {fromAccount: revolvingCreditAccount, toAccount: allToAccountsWithoutNotice, infoMessage: 'Enter amount in denominations of <span class="rand-amount">R 100</span>'},
            {fromAccount: revolvingCreditAccount, toAccount: notice32DayAccount, infoMessage: 'Enter an amount of at least <span class="rand-amount">R 300</span>, in denominations of <span class="rand-amount">R 100</span>'}
        ], function(example) {
            expectHint(example, example.infoMessage);
        });

        function expectHint(example, expectedInfoMessage) {
            var toAccountType = getAccountType(example.toAccount);
            var itDescription = expectedInfoMessage ? 'should' : 'should not';
            itDescription = itDescription + ' show hint if transfer from ' + example.fromAccount.accountType + ' to ' + toAccountType;
            it(itDescription, function () {
                var toAccounts = example.toAccount instanceof Array ? example.toAccount : [example.toAccount];
                for (var i = 0; i < toAccounts.length; i++) {
                    expect(service.hint(example.fromAccount, toAccounts[i])).toEqual(expectedInfoMessage);
                }
            });
        }
    });
});