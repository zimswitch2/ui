describe('DebitOrderSwitchingService', function () {
    beforeEach(function () {
        module('refresh.accountOrigination.currentAccount.services.debitOrderSwitchingService');
        inject(function(_ServiceTest_, _DebitOrderSwitchingService_, User){
            this.test = _ServiceTest_;
            this.DebitOrderSwitchingService = _DebitOrderSwitchingService_;
            this.systemPrincipal = {
                systemPrincipalIdentifier: {
                    systemPrincipalId: '1',
                    systemPrincipalKey: 'SBSA_BANKING'
                }
            };
            spyOn(User, 'principal').and.returnValue(this.systemPrincipal);
        });
    });

    describe('acceptDebitOrderSwitching', function(){
        var accountNumber ="1234567890";
        beforeEach(function(){
            this.test.spyOnEndpoint('acceptDebitOrderSwitching');
        });


        describe('success', function(){
            it('should call the debit order switching endpoint',function(){
                this.test.stubResponse('acceptDebitOrderSwitching', 200, 'SUCCESS', {'x-sbg-response-type': 'SUCCESS'});
                this.DebitOrderSwitchingService.acceptDebitOrderSwitching(accountNumber);
                expect(this.test.endpoint('acceptDebitOrderSwitching')).toHaveBeenCalled();
                this.test.resolvePromise();
            });
        });

        describe('failure', function(){
            it('should reject if call fails', function(){
                this.test.stubResponse('acceptDebitOrderSwitching', 500, {});
                expect(this.DebitOrderSwitchingService.acceptDebitOrderSwitching()).toBeRejected();
                this.test.resolvePromise();
            });

            it('should reject if call does not return SUCCESS', function(){
                this.test.stubResponse('acceptDebitOrderSwitching', 200, 'NOT SUCCESS', {'x-sbg-response-type': 'SUCCESS'});
                expect(this.DebitOrderSwitchingService.acceptDebitOrderSwitching()).toBeRejected();
            });

            it('should reject if call returns error headers', function(){
                this.test.stubResponse('acceptDebitOrderSwitching', 200, {}, {'x-sbg-response-type': 'ERROR'});
                expect(this.DebitOrderSwitchingService.acceptDebitOrderSwitching()).toBeRejected();
                this.test.resolvePromise();
            });
        });

    });
});