describe('Branch Laze Loading Service', function () {
    beforeEach(module('refresh.branchLazyLoadingService', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));

    var service, bankService;
    beforeEach(function () {
        bankService = jasmine.createSpyObj('bankService', ['searchBranches']);
        module(function ($provide) {
            $provide.value('BankService', bankService);
        });
    });

    var branches = [
        {
            "code": 20091600,
            "name": "DURBAN CENTRAL FOREX OPS"
        }
    ];

    beforeEach(inject(function (BranchLazyLoadingService, _mock_) {
        service = BranchLazyLoadingService;
        bankService.searchBranches.and.returnValue(_mock_.resolve(branches));
    }));

    describe('watch beneficiary.bank', function () {
        var oldBank = {name: 'fnb', code: '123', branch: {}};
        var newBank = {name: 'sb', code: '051', branch: {}};

        it('should call the service with the bank name', function () {
            service.bankUpdate(branches, {}, newBank, oldBank);
            expect(bankService.searchBranches).toHaveBeenCalledWith('sb');
        });

        it('should not call the service as no bank name is passed', function () {
            service.bankUpdate(branches, {}, null, oldBank);
            expect(bankService.searchBranches).not.toHaveBeenCalled();
        });

        it('should set the branch label', inject(function ($timeout) {
            service.bankUpdate(branches, {}, newBank, oldBank);
            $timeout.flush();
            var branch = branches['051'][0];
            expect(branch.label()).toEqual(branch.code + ' - ' + branch.name);
        }));

        it('should set the branch to undefined if the new bank code is not equal to the old bank code', inject(function ($timeout) {
            var beneficiary = {bank: {name: '', branch: {}}};
            service.bankUpdate(branches, beneficiary, newBank, oldBank);
            expect(beneficiary.bank.branch).toBeUndefined();
        }));
    });
});
