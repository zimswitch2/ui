describe('CustomerInformationData', function () {
    /* global customerManagementV4Feature:true */
    'use strict';

    var customerInformationData, customer, clock;
    var customerData = {
        customerTitleCode: '108',
        customerInitials: 'A',
        customerFirstName: 'ABLE',
        customerSurname: 'TUNES',
        residenceCountryCode: 'ZA',
        citizenshipCountryCode: 'ZA',
        dateOfBirth: '1962-03-21T22:00:00.000+0000',
        gender: '1',
        maritalStatusCode: '1',
        preferredLanguageCode: 'EN',
        accommodationTypeCode: '01',
        communicationInformation: [
            {
                communicationTypeCode: '01',
                communicationDetails: '0119876000',
                deleteIndicator: false
            },
            {
                communicationTypeCode: '02',
                communicationDetails: '0725665887',
                deleteIndicator: false
            },
            {
                communicationTypeCode: '04',
                communicationDetails: 'ATUNES@LOONEY.COM',
                deleteIndicator: false
            }
        ],
        identityDocuments: [
            {
                identityTypeCode: '01',
                identityNumber: '6203225060080',
                countryCode: 'ZA'
            }
        ],
        addressDetails: [],
        incomeExpenseItems: [],
        consentClauses: [],
        employmentDetails: [
            {
                startDate: '2014-12-17T00:00:00.000+0000',
                endDate: '9999-12-30T22:00:00.000+0000',
                employerName: 'MY EMPLOYER',
                occupationIndustryCode: '08',
                occupationLevelCode: '05',
                employmentStatusCode: '1'
            }
        ]
    };

    beforeEach(module('refresh.accountOrigination.domain.customer'));

    beforeEach(inject(function (_CustomerInformationData_) {
        customerInformationData = _CustomerInformationData_;
        customer = customerInformationData.initialize(customerData);
        clock = sinon.useFakeTimers(moment('2015-03-13').valueOf());
        customerManagementV4Feature = true;
    }));

    afterEach(function () {
        clock.restore();
    });

    describe('initialize', function () {
        describe('with customer', function () {
            describe('initialize', function () {
                describe('when there are no properties', function () {
                    beforeEach(function () {
                        customer = customerInformationData.initialize({});
                    });

                    it('should set undefined employment details to an empty list', function () {
                        expect(customer.employmentDetails).toEqual([]);
                    });

                    it('should set undefined address details to an empty list', function () {
                        expect(customer.addressDetails).toEqual([]);
                    });

                    it('should set undefined income and expenses to an empty list', function () {
                        expect(customer.incomeExpenseItems).toEqual([]);
                    });

                    it('should set undefined consent clauses to an empty list', function () {
                        expect(customer.consentClauses).toEqual([]);
                    });

                    it('should allow the user to modify addresses', function () {
                        expect(customer.canModifyAddresses()).toBeTruthy();
                    });

                    it('should allow the user to modify contact information', function () {
                        expect(customer.canModifyContactInformation()).toBeTruthy();
                    });
                });

                it('should make any readonly sections, modifiable', function () {
                    customer.makeAddressesReadonly();
                    customer.makeContactInformationReadonly();
                    expect(customer.canModifyAddresses()).toBeFalsy();
                    expect(customer.canModifyContactInformation()).toBeFalsy();
                    customerInformationData.initialize();
                    expect(customer.canModifyAddresses()).toBeTruthy();
                    expect(customer.canModifyContactInformation()).toBeTruthy();
                });

                it('should split address with multiple usage into two different addresses', function () {
                    var customer = customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            streetPOBox: '5 SIMMONDS ST',
                            suburb: 'SELBY',
                            cityTown: 'JOHANNESBURG',
                            postalCode: '2001',
                            addressUsage: [{
                                usageCode: '05',
                                deleteIndicator: false,
                                validFrom: '2015-03-09T22:00:00.000+0000',
                                validTo: '9999-12-30T22:00:00.000+0000'
                            }, {
                                usageCode: '02',
                                deleteIndicator: false,
                                validFrom: '2015-03-09T22:00:00.000+0000',
                                validTo: '9999-12-30T22:00:00.000+0000'
                            }]
                        }]
                    });

                    expect(customer.addressDetails.length).toEqual(2);
                    expect(customer.addressDetails).not.toContain(jasmine.objectContaining({
                        addressType: '01',
                        streetPOBox: '5 SIMMONDS ST',
                        suburb: 'SELBY',
                        cityTown: 'JOHANNESBURG',
                        postalCode: '2001',
                        addressUsage: [{
                            usageCode: '05',
                            deleteIndicator: false,
                            validFrom: '2015-03-09T22:00:00.000+0000',
                            validTo: '9999-12-30T22:00:00.000+0000'
                        }, {
                            usageCode: '02',
                            deleteIndicator: false,
                            validFrom: '2015-03-09T22:00:00.000+0000',
                            validTo: '9999-12-30T22:00:00.000+0000'
                        }]
                    }));
                });

                describe('with permit details', function () {
                    describe('when customer management v4 is toggled on', function () {
                        it('should set permit details to an empty list if customer is a passport holder with no permit info', function () {
                            var customer = customerInformationData.initialize({
                                identityDocuments: [{
                                    identityTypeCode: '06',
                                    identityNumber: '6203225060080',
                                    issuedDate: '2011-01-01',
                                    expiryDate: '2017-03-01'
                                }]
                            });

                            expect(customer.permitDetails).toEqual([]);
                        });

                        it('should not set permit details to an empty list if customer is a passport holder with partial permit info', function () {
                            var customer = customerInformationData.initialize({
                                identityDocuments: [{
                                    identityTypeCode: '06',
                                    identityNumber: '6203225060080',
                                    issuedDate: '2011-01-01',
                                    expiryDate: '2017-03-01'
                                }],
                                permitDetails: [{
                                    identityNumber: 'PERMIT12131'
                                }]
                            });

                            expect(customer.permitDetails).toEqual([{
                                identityNumber: 'PERMIT12131'
                            }]);
                        });

                        it('should not set permit details to an empty list if customer already has complete permit info', function () {
                            var customer = customerInformationData.initialize({
                                identityDocuments: [{
                                    identityTypeCode: '06',
                                    identityNumber: '6203225060080',
                                    issuedDate: '2011-01-01',
                                    expiryDate: '2017-03-01'
                                }],
                                permitDetails: [{
                                    identityTypeCode: '03',
                                    identityNumber: 'permit1232',
                                    issuedDate: '2011-01-01',
                                    expiryDate: '2017-09-01'
                                }]
                            });

                            expect(customer.permitDetails).toEqual([{
                                identityTypeCode: '03',
                                identityNumber: 'permit1232',
                                issuedDate: '2011-01-01',
                                expiryDate: '2017-09-01'
                            }]);
                        });
                    });

                    describe('when customer management v4 is toggled off', function () {
                        afterEach(function () {
                            customerManagementV4Feature = true;
                        });

                        it('should get permit details from work expiry date', function () {
                            customerManagementV4Feature = false;

                            var customer = customerInformationData.initialize({
                                permitDetails: [{
                                    identityTypeCode: '05',
                                    identityNumber: '6203225060080',
                                    issuedDate: '2011-01-01',
                                    expiryDate: '2017-03-01'
                                }],
                                workPermitExpiryDate: '2015-09-09'
                            });
                            expect(customer.permitDetails).toEqual([{expiryDate: '2015-09-09'}]);
                        });
                    });

                });

                it('should expose the customers properties', function () {
                    customer = customerInformationData.initialize({
                        customerFirstName: 'ABLE',
                        customerSurname: 'TUNES',
                        customerTitleCode: '108'
                    });
                    expect(customer.customerFirstName).toEqual('ABLE');
                    expect(customer.customerSurname).toEqual('TUNES');
                    expect(customer.customerTitleCode).toEqual('108');
                });
            });

            describe('letter data', function () {
                var address;

                beforeEach(function () {
                    address = {
                        addressType: '01',
                        validFrom: '2013-03-09T22:00:00.000+0000',
                        unitNumber: '5th floor',
                        building: 'Standard Bank',
                        streetPOBox: '1 FOX ST',
                        suburb: 'FERREIRASDORP',
                        cityTown: 'JOHANNESBURG',
                        postalCode: '2001',
                        addressUsage: [
                            {
                                usageCode: '05',
                                deleteIndicator: false,
                                validFrom: '2013-03-09T22:00:00.000+0000'
                            }
                        ]
                    };

                    customerInformationData.initialize({
                        customerTitleCode: '040',
                        customerFirstName: 'Bob',
                        customerSurname: 'Marley',
                        addressDetails: [address]
                    });
                });

                it('should return data for letter header', inject(function ($rootScope, LookUps, mock) {
                    spyOn(LookUps.title, 'promise').and.returnValue(mock.resolve([{
                        code: '040',
                        description: 'Dr.'
                    }]));

                    expect(customerInformationData.current().letterData()).toBeResolvedWith({
                        residentialAddress: jasmine.objectContaining(address),
                        displayName: 'Dr. Marley',
                        fullName: 'Bob Marley'
                    });

                    $rootScope.$digest();
                }));

                it('should return data for letter header with no title if not mapped', inject(function ($rootScope, LookUps, mock) {
                    spyOn(LookUps.title, 'promise').and.returnValue(mock.resolve([{
                        code: '555',
                        description: 'Dr.'
                    }]));

                    expect(customerInformationData.current().letterData()).toBeResolvedWith({
                        residentialAddress: jasmine.objectContaining(address),
                        displayName: 'Marley',
                        fullName: 'Bob Marley'
                    });

                    $rootScope.$digest();
                }));
            });

            describe('income and expenses', function () {
                beforeEach(function () {
                    customer = customerInformationData.initialize({
                        incomeExpenseItems: [{
                            itemExpenditureIndicator: 'I',
                            itemAmount: 50000.0,
                            itemTypeCode: '01'
                        },
                            {
                                itemExpenditureIndicator: 'I',
                                itemAmount: 40000.0,
                                itemTypeCode: '13'
                            },
                            {
                                itemExpenditureIndicator: 'E',
                                itemAmount: 300.0,
                                itemTypeCode: '21'
                            }
                        ]
                    });
                });

                describe('with incomes', function () {
                    it('should return customers income items', function () {
                        var expectedIncomes = [
                            {
                                itemAmount: 50000.0,
                                itemTypeCode: '01',
                                itemExpenditureIndicator: 'I'
                            },
                            {
                                itemAmount: 40000.0,
                                itemTypeCode: '13',
                                itemExpenditureIndicator: 'I'
                            }
                        ];
                        expect(customer.getIncomes()).toEqual(expectedIncomes);
                    });

                    it('should return customers gross income', function () {
                        expect(customer.getGrossIncome()).toEqual(90000.0);
                    });

                    it('should know if customer has income items', function () {
                        expect(customer.hasAnyIncome()).toBeTruthy();
                    });

                    it('should know if customer does not have income items', function () {
                        customer.incomeExpenseItems = [
                            {
                                itemAmount: '50000.0',
                                itemTypeCode: '01',
                                itemExpenditureIndicator: 'E'
                            }
                        ];
                        expect(customer.hasAnyIncome()).toBeFalsy();
                    });

                    it('should add incomes numerically', function () {
                        customer.incomeExpenseItems = [
                            {
                                itemAmount: '50000.0',
                                itemTypeCode: '01',
                                itemExpenditureIndicator: 'I'
                            },
                            {
                                itemAmount: '40000.0',
                                itemTypeCode: '13',
                                itemExpenditureIndicator: 'I'
                            }
                        ];

                        expect(customer.getGrossIncome()).toEqual(90000.0);
                    });

                    it('should return zero if income has not itemAmount', function () {
                        customer.incomeExpenseItems = [
                            {
                                itemTypeCode: '01',
                                itemExpenditureIndicator: 'I'
                            }
                        ];

                        expect(customer.getGrossIncome()).toEqual(0);
                    });
                });

                describe('with expenses', function () {
                    it('should return zero if customer has no total expense item', function () {
                        expect(customer.getTotalExpenses()).toEqual(0);
                    });

                    it('should return zero if customer total expense item has no amount defined', function () {
                        customer.incomeExpenseItems = [
                            {
                                itemTypeCode: '99',
                                itemExpenditureIndicator: 'E'
                            }
                        ];

                        expect(customer.getTotalExpenses()).toEqual(0);
                    });

                    it('should get total expense item amount', function () {
                        customer.incomeExpenseItems = [
                            {
                                itemAmount: '50000.0',
                                itemTypeCode: '01',
                                itemExpenditureIndicator: 'E'
                            },
                            {
                                itemAmount: '40000.0',
                                itemTypeCode: '13',
                                itemExpenditureIndicator: 'I'
                            },
                            {
                                itemAmount: '8000.0',
                                itemTypeCode: '99',
                                itemExpenditureIndicator: 'E'
                            }
                        ];

                        expect(customer.getTotalExpenses()).toEqual(8000.0);
                    });

                    it('should get total expense item', function () {
                        customer.incomeExpenseItems = [
                            {
                                itemAmount: '50000.0',
                                itemTypeCode: '01',
                                itemExpenditureIndicator: 'E'
                            },
                            {
                                itemAmount: '40000.0',
                                itemTypeCode: '13',
                                itemExpenditureIndicator: 'I'
                            },
                            {
                                itemAmount: '8000.0',
                                itemTypeCode: '99',
                                itemExpenditureIndicator: 'E'
                            }
                        ];

                        expect(customer.getTotalExpenseItem()).toEqual({
                            itemAmount: '8000.0',
                            itemTypeCode: '99',
                            itemExpenditureIndicator: 'E'
                        });
                    });

                    it('should know if customer does not have total expense item', function () {
                        expect(customer.hasOnlyTotalExpense()).toBeFalsy();
                    });

                    it('should know if customer does have total expense item', function () {
                        customer.incomeExpenseItems = [
                            {
                                itemAmount: '50000.0',
                                itemTypeCode: '99',
                                itemExpenditureIndicator: 'E'
                            }
                        ];
                        expect(customer.hasOnlyTotalExpense()).toBeTruthy();
                    });

                    describe('filter expense items', function () {
                        it('should filter out all expense items if more than one item', function () {
                            customer.incomeExpenseItems = [
                                {
                                    itemAmount: 50000.0,
                                    itemTypeCode: '01',
                                    itemExpenditureIndicator: 'E'
                                },
                                {
                                    itemAmount: 40000.0,
                                    itemTypeCode: '13',
                                    itemExpenditureIndicator: 'I'
                                },
                                {
                                    itemAmount: 8000.0,
                                    itemTypeCode: '99',
                                    itemExpenditureIndicator: 'E'
                                }
                            ];

                            customer.filterExpenses();
                            var filteredExpenses = [
                                {
                                    itemAmount: 40000.0,
                                    itemTypeCode: '13',
                                    itemExpenditureIndicator: 'I'
                                }
                            ];
                            expect(customer.incomeExpenseItems).toEqual(filteredExpenses);
                        });

                        it('should keep the total expense if it is the only expense item', function () {
                            var incomeExpenseItems = [
                                {
                                    itemAmount: 40000.0,
                                    itemTypeCode: '13',
                                    itemExpenditureIndicator: 'I'
                                },
                                {
                                    itemAmount: 99,
                                    itemTypeCode: '99',
                                    itemExpenditureIndicator: 'E'
                                }
                            ];
                            customer.incomeExpenseItems = incomeExpenseItems;

                            customer.filterExpenses();
                            expect(customer.incomeExpenseItems).toEqual(incomeExpenseItems);
                        });

                        it('should filter out zero amount total expense item', function () {
                            customer.incomeExpenseItems = [
                                {
                                    itemAmount: 0,
                                    itemTypeCode: '99',
                                    itemExpenditureIndicator: 'E'
                                }
                            ];

                            customer.filterExpenses();
                            expect(customer.incomeExpenseItems).toEqual([]);
                        });
                    });
                });
            });

            describe('with cellphone contact info', function () {
                it('should return true when customer has a cell phone number', function () {
                    expect(customer.hasCellphoneContact()).toBeTruthy();
                });

                it('should return false when customer has no cell phone number', function () {
                    customer = customerInformationData.initialize({
                        communicationInformation: [{
                            communicationTypeCode: '04',
                            communicationDetails: 'ATUNES@LOONEY.COM',
                            deleteIndicator: false
                        }]
                    });
                    expect(customer.hasCellphoneContact()).toBeFalsy();
                });
            });

            describe('employment information', function () {
                describe('isEmployed()', function () {
                    it('should return true when customer is employed', function () {
                        expect(customer.isEmployed()).toBeTruthy();
                    });

                    it('should return false when customer has no employment details', function () {
                        customer = customerInformationData.initialize({employmentDetails: []});
                        expect(customer.isEmployed()).toBeFalsy();
                    });

                    it('should return false when customer has old employment details', function () {
                        customer = customerInformationData.initialize({
                            employmentDetails: [{
                                startDate: '2014-12-16T22:00:00.000+0000',
                                endDate: '2015-01-23T22:00:00.000+0000'
                            }]
                        });

                        expect(customer.isEmployed()).toBeFalsy();
                    });
                });

                describe('isEmployedForLessThanAYear()', function () {
                    it('should return true when end date is either unset or in the future', function () {
                        expect(customer.isEmployedForLessThanAYear()).toBeTruthy();
                    });

                    it('should return false when customer has been employed for at least a year', function () {
                        customer = customerInformationData.initialize({
                            employmentDetails: [{
                                startDate: '2014-03-13',
                                endDate: '9999-01-23T22:00:00.000+0000'
                            }]
                        });

                        expect(customer.isEmployedForLessThanAYear()).toBeFalsy();
                    });

                    it('should return false when customer is no longer employed', function () {
                        customer = customerInformationData.initialize({
                            employmentDetails: [{
                                startDate: '2014-03-20',
                                endDate: '2014-12-31'
                            }]
                        });

                        expect(customer.isEmployedForLessThanAYear()).toBeFalsy();
                    });
                });

                describe('with current employment', function () {
                    it('should return current employment details', function () {
                        expect(customer.getCurrentEmploymentDetails()).toEqual({
                            startDate: '2014-12-17T00:00:00.000+0000',
                            endDate: '9999-12-30T22:00:00.000+0000',
                            employerName: 'MY EMPLOYER',
                            occupationIndustryCode: '08',
                            occupationLevelCode: '05',
                            employmentStatusCode: '1'
                        });
                    });

                    it('should return undefined when customer is not currently employed', function () {
                        customer = customerInformationData.initialize({});
                        expect(customer.getCurrentEmploymentDetails()).toBeUndefined();
                    });
                });

                it('should get the previous employment details', function () {
                    customer = customerInformationData.initialize({
                        employmentDetails: [{
                            startDate: '2014-12-17T00:00:00.000+0000',
                            endDate: '9999-12-30T22:00:00.000+0000',
                            employerName: 'MY EMPLOYER',
                            occupationIndustryCode: '08',
                            occupationLevelCode: '05',
                            employmentStatusCode: '1'
                        },
                            {
                                startDate: '2010-12-17T00:00:00.000+0000',
                                endDate: '2014-12-17T00:00:00.000+0000',
                                employerName: 'MY PREVIOUS EMPLOYER',
                                occupationIndustryCode: '08',
                                occupationLevelCode: '05',
                                employmentStatusCode: '1'
                            }]
                    });
                    expect(customer.getPreviousEmploymentDetails()).toEqual({
                        startDate: '2010-12-17T00:00:00.000+0000',
                        endDate: '2014-12-17T00:00:00.000+0000',
                        employerName: 'MY PREVIOUS EMPLOYER',
                        occupationIndustryCode: '08',
                        occupationLevelCode: '05',
                        employmentStatusCode: '1'
                    });
                });

                describe('addEmployment()', function () {
                    beforeEach(function () {
                        customer = customerInformationData.initialize({
                            employmentDetails: [
                                {
                                    startDate: '2014-12-17T00:00:00.000+0000',
                                    endDate: '9999-12-30T22:00:00.000+0000',
                                    employerName: 'MY EMPLOYER',
                                    occupationIndustryCode: '08',
                                    occupationLevelCode: '05',
                                    employmentStatusCode: '1'
                                }
                            ]
                        });
                    });

                    it('should add employment in customer employment details', function () {
                        customer.addEmployment({
                            startDate: '2010-01-01',
                            employerName: 'some employer'
                        });
                        expect(customer.employmentDetails).toContain(jasmine.objectContaining({
                            startDate: '2010-01-01',
                            employerName: 'some employer'
                        }));
                    });

                    describe('when employment is invalid', function () {
                        it('should not add employment with empty employer name', function () {
                            customer.addEmployment({
                                startDate: '2010-01-01'
                            });
                            expect(customer.employmentDetails).not.toContain(jasmine.objectContaining({
                                startDate: '2010-01-01'
                            }));
                        });

                        it('should not add employment without start date', function () {
                            customer.addEmployment({
                                employerName: 'some employer'
                            });
                            expect(customer.employmentDetails).not.toContain(jasmine.objectContaining({
                                employerName: 'some employer'
                            }));
                        });

                        it('should not add employment with invalid start date', function () {
                            customer.addEmployment({
                                startDate: 'invalid',
                                employerName: 'some employer'
                            });
                            expect(customer.employmentDetails).not.toContain(jasmine.objectContaining({
                                startDate: 'invalid',
                                employerName: 'some employer'
                            }));
                        });
                    });

                    it('should not add duplicate employments', function () {
                        customer = customerInformationData.initialize({employmentDetails: []});
                        var employment = {startDate: '2010-01-01', employerName: 'some employer'};
                        customer.addEmployment(employment);
                        customer.addEmployment(employment);
                        expect(customer.employmentDetails.length).toEqual(1);
                    });
                });

                describe('hasPreviousEmployment()', function () {
                    it('should know when customer has previous employment details', function () {
                        customer = customerInformationData.initialize({
                            employmentDetails: [{
                                startDate: '2010-03-12',
                                endDate: '2013-03-12'
                            }
                            ]
                        });
                        expect(customer.hasPreviousEmployment()).toBeTruthy();
                    });

                    it('should know when customer does not have previous employment details', function () {
                        customer = customerInformationData.initialize({employmentDetails: []});
                        expect(customer.hasPreviousEmployment()).toBeFalsy();
                    });
                });

                describe('hasEmploymentDetails()', function () {
                    it('should know when customer has employment details', function () {
                        customer = customerInformationData.initialize({
                            employmentDetails: [{
                                startDate: '2010-03-12',
                                endDate: '2013-03-12'
                            }]
                        });

                        expect(customer.hasEmploymentDetails()).toBeTruthy();
                    });

                    it('should know when customer does not have any employment details', function () {
                        customer = customerInformationData.initialize({employmentDetails: []});

                        expect(customer.hasEmploymentDetails()).toBeFalsy();
                    });

                    it('should know when customer has unemployment details', function () {
                        customer = customerInformationData.initialize({
                            unemploymentReason: 'U'
                        });

                        expect(customer.hasEmploymentDetails()).toBeTruthy();
                    });

                    it('should know when customer does not have any employment details', function () {
                        customer = customerInformationData.initialize({unemploymentReason: ''});

                        expect(customer.hasEmploymentDetails()).toBeFalsy();
                    });
                });

                describe('hasNoEmploymentStatus()', function () {
                    it('should return true when customer is missing employment details and unemployment reason', function () {
                        customer = customerInformationData.initialize({employmentDetails: []});

                        delete customer.unemploymentReason;

                        expect(customer.hasNoEmploymentStatus()).toBeTruthy();
                    });

                    it('should return false when customer has any employment details', function () {
                        customer = customerInformationData.initialize({
                            employmentDetails: [{
                                startDate: '2010-03-12',
                                endDate: '2013-03-12'
                            }]
                        });

                        expect(customer.hasNoEmploymentStatus()).toBeFalsy();
                    });

                    it('should return false when customer is no employment details but unemployment reason', function () {
                        customer = customerInformationData.initialize({employmentDetails: [], unemploymentReason: 'A'});
                        expect(customer.hasNoEmploymentStatus()).toBeFalsy();
                    });
                });
            });

            describe('address information', function () {
                describe('residential addresses', function () {
                    beforeEach(function () {
                        customer = customerInformationData.initialize({
                            addressDetails: [{
                                addressType: '01',
                                validFrom: '2013-03-09T22:00:00.000+0000',
                                unitNumber: '5th floor',
                                building: 'Standard Bank',
                                streetPOBox: '1 FOX ST',
                                suburb: 'FERREIRASDORP',
                                cityTown: 'JOHANNESBURG',
                                postalCode: '2001',
                                addressUsage: [
                                    {
                                        usageCode: '04',
                                        deleteIndicator: false,
                                        validFrom: '2013-03-09T22:00:00.000+0000'
                                    },
                                    {
                                        usageCode: '05',
                                        deleteIndicator: false,
                                        validFrom: '2013-03-09T22:00:00.000+0000'
                                    }
                                ]
                            },
                                {
                                    addressType: '01',
                                    validFrom: '2015-03-09T22:00:00.000+0000',
                                    streetPOBox: '5 SIMMONDS ST',
                                    suburb: 'SELBY',
                                    cityTown: 'JOHANNESBURG',
                                    postalCode: '2001',
                                    addressUsage: [
                                        {
                                            usageCode: '05',
                                            deleteIndicator: false,
                                            validFrom: '2015-03-09T22:00:00.000+0000'
                                        }
                                    ]
                                },
                                {
                                    addressType: '01',
                                    validFrom: '2015-03-09T22:00:00.000+0000',
                                    streetPOBox: '58 SIMMONDS ST',
                                    suburb: 'SELBY',
                                    cityTown: 'JOHANNESBURG',
                                    postalCode: '2001',
                                    addressUsage: [
                                        {
                                            usageCode: '02',
                                            deleteIndicator: false,
                                            validFrom: '2015-03-09T22:00:00.000+0000'
                                        }
                                    ]
                                }]
                        });
                    });

                    it('should know the current residential address', function () {
                        expect(customer.getCurrentResidentialAddress()).toEqual(jasmine.objectContaining({
                            addressType: '01',
                            validFrom: '2015-03-09T22:00:00.000+0000',
                            streetPOBox: '5 SIMMONDS ST',
                            suburb: 'SELBY',
                            cityTown: 'JOHANNESBURG',
                            postalCode: '2001',
                            addressUsage: [
                                {
                                    usageCode: '05',
                                    deleteIndicator: false,
                                    validFrom: '2015-03-09T22:00:00.000+0000'

                                }
                            ]
                        }));
                    });

                    it('should know the previous residential address', function () {
                        expect(customer.getPreviousResidentialAddress()).toEqual(jasmine.objectContaining({
                            addressType: '01',
                            validFrom: '2013-03-09T22:00:00.000+0000',
                            unitNumber: '5th floor',
                            building: 'Standard Bank',
                            streetPOBox: '1 FOX ST',
                            suburb: 'FERREIRASDORP',
                            cityTown: 'JOHANNESBURG',
                            postalCode: '2001',
                            addressUsage: [{
                                usageCode: '05',
                                deleteIndicator: false,
                                validFrom: '2013-03-09T22:00:00.000+0000'
                            }]
                        }));
                    });

                    it('should know when the current residential address is less than a year', function () {
                        customer = customerInformationData.initialize({
                            addressDetails: [{
                                addressType: '01',
                                addressUsage: [
                                    {
                                        usageCode: '05',
                                        validFrom: '2014-04-09T22:00:00.000+0000',
                                        validTo: '9999-12-30T22:00:00.000+0000'
                                    }
                                ]
                            }]
                        });

                        expect(customer.atResidentialAddressForLessThanAYear()).toBeTruthy();
                    });

                    it('should know when the current residential address is not less than a year', function () {
                        customer.addressDetails = [
                            {
                                addressType: '01',
                                addressUsage: [
                                    {
                                        usageCode: '05',
                                        validFrom: '2014-03-13',
                                        validTo: '9999-12-30T22:00:00.000+0000'
                                    }
                                ]
                            }
                        ];

                        customer = customerInformationData.initialize({
                            addressDetails: [{
                                addressType: '01',
                                addressUsage: [
                                    {
                                        usageCode: '05',
                                        validFrom: '2014-03-13',
                                        validTo: '9999-12-30T22:00:00.000+0000'
                                    }
                                ]
                            }]
                        });

                        expect(customer.atResidentialAddressForLessThanAYear()).toBeFalsy();
                    });

                    describe("hasCurrentResidentialAddress()", function () {
                        it("should know when customer has a current residential address", function () {
                            expect(customer.hasCurrentResidentialAddress()).toBeTruthy();
                        });

                        it("should know when customer does not have a current residential address", function () {
                            customer = customerInformationData.initialize({addressDetails: []});
                            expect(customer.hasCurrentResidentialAddress()).toBeFalsy();
                        });
                    });

                    describe("makeAddressesReadonly()", function () {
                        it("should make the home and postal addresses readonly", function () {
                            customer.makeAddressesReadonly();
                            expect(customer.canModifyAddresses()).toBeFalsy();
                        });
                    });

                    describe("makeContactInformationReadonly()", function () {
                        it("should make the contact information readonly", function () {
                            customer.makeContactInformationReadonly();
                            expect(customer.canModifyContactInformation()).toBeFalsy();
                        });
                    });
                });

                it('should know the current residential postal address', function () {
                    customer = customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            streetPOBox: '5 SIMMONDS ST',
                            suburb: 'SELBY',
                            cityTown: 'JOHANNESBURG',
                            postalCode: '2001',
                            addressUsage: [
                                {
                                    usageCode: '05',
                                    deleteIndicator: false,
                                    validFrom: '2015-03-09T22:00:00.000+0000',
                                    validTo: '9999-12-30T22:00:00.000+0000'
                                }
                            ]
                        },
                            {
                                addressType: '01',
                                streetPOBox: '58 SIMMONDS ST',
                                suburb: 'SELBY',
                                cityTown: 'JOHANNESBURG',
                                postalCode: '2001',
                                addressUsage: [
                                    {
                                        usageCode: '02',
                                        deleteIndicator: false,
                                        validFrom: '2015-03-09T22:00:00.000+0000',
                                        validTo: '9999-12-30T22:00:00.000+0000'
                                    }
                                ]
                            }]
                    });

                    expect(customer.getCurrentPostalAddress()).toEqual(jasmine.objectContaining({
                        addressType: '01',
                        streetPOBox: '58 SIMMONDS ST',
                        suburb: 'SELBY',
                        cityTown: 'JOHANNESBURG',
                        postalCode: '2001',
                        addressUsage: [
                            {
                                usageCode: '02',
                                deleteIndicator: false,
                                validFrom: '2015-03-09T22:00:00.000+0000',
                                validTo: '9999-12-30T22:00:00.000+0000'
                            }
                        ]
                    }));
                });

                it('should know the current po box postal address', function () {
                    customer = customerInformationData.initialize({
                        addressDetails: [{
                            addressType: '01',
                            streetPOBox: '5 SIMMONDS ST',
                            suburb: 'SELBY',
                            cityTown: 'JOHANNESBURG',
                            postalCode: '2001',
                            addressUsage: [
                                {
                                    usageCode: '05',
                                    deleteIndicator: false,
                                    validFrom: '2015-03-09T22:00:00.000+0000',
                                    validTo: '9999-12-30T22:00:00.000+0000'
                                }
                            ]
                        },
                            {
                                addressType: '02',
                                streetPOBox: '58 SIMMONDS ST',
                                suburb: 'SELBY',
                                cityTown: 'JOHANNESBURG',
                                postalCode: '2001',
                                addressUsage: [
                                    {
                                        usageCode: '02',
                                        deleteIndicator: false,
                                        validFrom: '2015-03-09T22:00:00.000+0000',
                                        validTo: '9999-12-30T22:00:00.000+0000'
                                    }
                                ]
                            }]
                    });

                    expect(customer.getCurrentPostalAddress()).toEqual(jasmine.objectContaining({
                        addressType: '02',
                        streetPOBox: '58 SIMMONDS ST',
                        suburb: 'SELBY',
                        cityTown: 'JOHANNESBURG',
                        postalCode: '2001',
                        addressUsage: [
                            {
                                usageCode: '02',
                                deleteIndicator: false,
                                validFrom: '2015-03-09T22:00:00.000+0000',
                                validTo: '9999-12-30T22:00:00.000+0000'
                            }
                        ]
                    }));
                });
            });

            describe('with identity documents', function () {
                it('should get the national id', function () {
                    expect(customer.getNationalId()).toEqual({
                        identityTypeCode: '01',
                        identityNumber: '6203225060080',
                        countryCode: 'ZA'
                    });
                });

                it('should get the passport', function () {
                    customer = customerInformationData.initialize({
                        identityDocuments: [{
                            identityTypeCode: '06',
                            identityNumber: '6203225060080',
                            countryCode: 'ZA'
                        }]
                    });

                    expect(customer.getPassport()).toEqual({
                        identityTypeCode: '06',
                        identityNumber: '6203225060080',
                        countryCode: 'ZA'
                    });
                });

                describe('when getting permit', function () {
                    beforeEach(function () {
                        customer = customerInformationData.initialize({
                            permitDetails: [{
                                identityTypeCode: '05',
                                identityNumber: '6203225060080',
                                issuedDate: '2011-01-01',
                                expiryDate: '2017-03-01'
                            }],
                            workPermitExpiryDate: '2015-09-09'
                        });
                    });

                    it('should get permit from permit details', function () {
                        expect(customer.getPermit()).toEqual({
                            identityTypeCode: '05',
                            identityNumber: '6203225060080',
                            issuedDate: '2011-01-01',
                            expiryDate: '2017-03-01'
                        });
                    });

                    it('should return true if customer is missing additional permit information', function(){
                        customer = customerInformationData.initialize({
                            citizenshipCountryCode: 'ZA',
                            nationalityCountryCode: 'ZA',
                            birthCountryCode: 'ZA',
                            residenceCountryCode: 'ZA',
                            identityDocuments: [{
                                identityTypeCode: '06',
                                identityNumber: '6203225060080',
                                countryCode: 'ZA'
                            }]
                        });
                        expect(customer.needAdditionalPermitInfo()).toBeTruthy();
                    });

                    it('should return true if customer is missing additional permit information', function(){
                        customer = customerInformationData.initialize({
                            citizenshipCountryCode: 'ZA',
                            nationalityCountryCode: 'ZA',
                            birthCountryCode: 'ZA',
                            residenceCountryCode: 'ZA',
                            identityDocuments: [{
                                identityTypeCode: '06',
                                identityNumber: '6203225060080',
                                countryCode: 'ZA'
                            }],
                            permitDetails: [{
                                identityTypeCode: '05',
                                identityNumber: '6203225060080',
                                issuedDate: '2011-01-01',
                                expiryDate: '2017-03-01'
                            }],
                            workPermitExpiryDate: '2015-09-09'
                        });
                        expect(customer.needAdditionalPermitInfo()).toBeFalsy();
                    });
                });


                describe('SA citizen', function () {
                    it('should know if the customer is a citizen', function () {
                        expect(customer.isSACitizen()).toBeTruthy();
                    });

                    describe('non SA citizen', function () {
                        it('should know that the customer is not a citizen if 11th digit is not 0', function () {
                            customer = customerInformationData.initialize({
                                identityDocuments: [{
                                    identityTypeCode: '01',
                                    identityNumber: '6203225060180',
                                    countryCode: 'ZA'
                                }]
                            });
                            expect(customer.isSACitizen()).toBeFalsy();
                        });

                        it('should know that the customer is not a citizen if there is no SA ID', function () {
                            customer = customerInformationData.initialize({
                                identityDocuments: [{
                                    identityTypeCode: '06',
                                    identityNumber: '6203225060080',
                                    countryCode: 'ZA'
                                }]
                            });
                            expect(customer.isSACitizen()).toBeFalsy();
                        });

                        it('should know that the customer is not a citizen if ID number is missing', function () {
                            customer = customerInformationData.initialize({
                                identityDocuments: [{
                                    identityTypeCode: '01',
                                    countryCode: 'ZA'
                                }]
                            });

                            expect(customer.isSACitizen()).toBeFalsy();
                        });
                    });
                });
            });

            describe('compliance', function () {
                it('should know if the customer is KYC compliant', function () {
                    customer = customerInformationData.initialize({
                        complianceItems: [{
                            complianceCode: 'Y',
                            complianceType: 'KYC'
                        }]
                    });

                    expect(customer.isKycCompliant()).toBeTruthy();
                });

                it('should know if the customer is not KYC compliant', function () {
                    customer = customerInformationData.initialize({
                        complianceItems: [
                            {
                                complianceCode: 'N',
                                complianceType: 'KYC'
                            }
                        ]
                    });

                    expect(customer.isKycCompliant()).toBeFalsy();
                });

                it('should know if the customer is not KYC compliant when it has no compliance items', function () {
                    expect(customer.isKycCompliant()).toBeFalsy();
                });
            });

            describe('consent', function () {
                it('should return consent that corresponds to a specific code', function () {
                    customer = customerInformationData.initialize({
                        consentClauses: [
                            {consentCode: '01', consentFlag: true}
                        ]
                    });
                    expect(customer.getConsent('01')).toEqual(jasmine.objectContaining({
                        consentCode: '01',
                        consentFlag: true
                    }));
                });

                describe('when checking if customer has consent', function () {
                    it('should return false when customer has no consent', function () {
                        expect(customer.hasMarketingConsent()).toBeFalsy();
                    });

                    it('should return true when customer has any marketing-related consent', function () {
                        customer = customerInformationData.initialize({
                            consentClauses: [
                                {consentCode: '01', consentFlag: true}
                            ]
                        });
                        expect(customer.hasMarketingConsent()).toBeTruthy();
                    });

                    it('should return when customer only has fraud consent', function () {
                        customer = customerInformationData.initialize({
                            consentClauses: [
                                {consentCode: '07', consentFlag: true}
                            ]
                        });
                        expect(customer.hasMarketingConsent()).toBeFalsy();
                    });
                });

                describe('when setting consent', function () {
                    it('should create a consent if it does not exist', function () {
                        customer.setConsent('04', false);
                        expect(customer.consentClauses).toContain(jasmine.objectContaining({
                            consentCode: '04',
                            consentFlag: false
                        }));
                    });

                    it('should update a consent it does exist', function () {
                        customer = customerInformationData.initialize({
                            consentClauses: [
                                {consentCode: '04', consentFlag: true}
                            ]
                        });
                        customer.setConsent('04', false);
                        expect(customer.consentClauses).toContain(jasmine.objectContaining({
                            consentCode: '04',
                            consentFlag: false
                        }));
                    });
                });
            });

            describe('with country related fields', function () {
                beforeEach(function(){
                    addBasicInformationAMLFeature = false;
                });
                using(['citizenship', 'nationality', 'country of birth'], function (data) {
                    it('should return true when customer is missing information on ' + data, function () {
                        customer = customerInformationData.initialize({});
                        expect(customer.needAdditionalBasicInfo()).toBeTruthy();
                    });
                });

                it('should return false when customer has given all necessary information', function () {
                    customer = customerInformationData.initialize({
                        citizenshipCountryCode: 'ZA',
                        nationalityCountryCode: 'ZA',
                        birthCountryCode: 'ZA',
                        residenceCountryCode: 'ZA'
                    });
                    expect(customer.needAdditionalBasicInfo('citizenshipCountryCode')).toBeFalsy();
                });
            });

            describe('with passport related fields', function () {
                beforeEach(function(){
                    addBasicInformationAMLFeature = false;
                });
                using(['permit type', 'permit number', 'permit issue date', 'permit expiry date'], function (data) {
                    it('should return true when customer is missing information on ' + data, function () {
                        customer = customerInformationData.initialize({
                            identityDocuments: [
                                {
                                    identityTypeCode: '06',
                                    identityNumber: '6203225060080',
                                    countryCode: 'ZA'
                                }
                            ],
                            citizenshipCountryCode: 'ZA',
                            nationalityCountryCode: 'ZA',
                            residenceCountryCode: 'ZA',
                            birthCountryCode: 'ZA'
                        });
                        expect(customer.needAdditionalBasicInfo()).toBeTruthy();
                    });
                });

                it('should return false when customer has given all necessary information', function () {
                    customer = customerInformationData.initialize({
                        identityDocuments: [{
                            identityTypeCode: '06',
                            identityNumber: '6203225060080',
                            countryCode: 'ZA'
                        }],
                        permitDetails: [{
                            identityTypeCode: '05',
                            identityNumber: 'PERMIT',
                            issuedDate: '2011-01-01',
                            expiryDate: '2017-03-01'
                        }],
                        citizenshipCountryCode: 'ZA',
                        nationalityCountryCode: 'ZA',
                        birthCountryCode: 'ZA',
                        residenceCountryCode: 'ZA'
                    });
                    expect(customer.needAdditionalBasicInfo()).toBeFalsy();
                });
            });
        });
    });

    describe('revert', function () {
        it('should revert current customer to the customer that was previously stashed', function () {
            var customer = customerInformationData.initialize(customerData);
            customerInformationData.stash();
            customer.customerSurname = 'MORETUNES';
            expect(customer.customerSurname).toEqual('MORETUNES');

            customerInformationData.revert();

            var revertedCustomer = customerInformationData.current();
            expect(revertedCustomer.customerSurname).toEqual('TUNES');
        });
    });

    describe('apply', function () {
        it('should reset the stashed customer', function () {
            var customer = customerInformationData.initialize(customerData);
            customerInformationData.stash();
            expect(customer.employmentDetails).not.toEqual([]);

            customerInformationData.apply();

            customerInformationData.revert();

            var currentCustomer = customerInformationData.current();
            expect(currentCustomer.employmentDetails).toEqual([]);
        });
    });

    describe('hasEditedEmploymentDetails', function () {
        it('should return false when customer has not been stashed', function () {
            customerInformationData.initialize(customerData);
            customerInformationData.apply();
            expect(customerInformationData.hasEditedEmploymentDetails()).toBeFalsy();
        });

        it('should return false when employment details have not been changed', function () {
            customerInformationData.initialize(customerData);
            customerInformationData.stash();
            expect(customerInformationData.hasEditedEmploymentDetails()).toBeFalsy();
        });

        it('should return true when employment details have been changed', function () {
            var customer = customerInformationData.initialize(customerData);
            customerInformationData.stash();
            customer.getCurrentEmploymentDetails().employerName = 'Edited Employer';
            expect(customerInformationData.hasEditedEmploymentDetails()).toBeTruthy();
        });

        it('should return true when unemployment reason has been changed', function () {
            var customer = customerInformationData.initialize(customerData);
            customerInformationData.stash();
            customer.unemploymentReason = 'U';

            expect(customerInformationData.hasEditedEmploymentDetails()).toBeTruthy();
        });

        it('should return true when qualification code has been changed', function () {
            var customer = customerInformationData.initialize(customerData);
            customerInformationData.stash();
            customer.tertiaryQualificationCode = '124';

            expect(customerInformationData.hasEditedEmploymentDetails()).toBeTruthy();
        });
    });

    describe('hasEditedConsentClauses', function () {
        it('should return false when customer has not been stashed', function () {
            customerInformationData.initialize(customerData);
            customerInformationData.apply();
            expect(customerInformationData.hasEditedConsentClauses()).toBeFalsy();
        });

        it('should return false when consent clauses have not been changed', function () {
            customerInformationData.initialize(customerData);
            customerInformationData.stash();

            expect(customerInformationData.hasEditedConsentClauses()).toBeFalsy();
        });

        it('should return true when consent clauses have been changed', function () {
            var customer = customerInformationData.initialize(customerData);
            customerInformationData.stash();
            customer.consentClauses.push({consentCode: '01', consentFlag: false});

            expect(customerInformationData.hasEditedConsentClauses()).toBeTruthy();
        });
    });
})
;