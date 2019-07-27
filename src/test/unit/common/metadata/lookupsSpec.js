describe('LookUps', function () {
    'use strict';

    var LookUps, test, lookUp, expectedValues, endpoint, serviceResponse;

    beforeEach(module('refresh.lookups'));

    beforeEach(inject(function (_LookUps_, ServiceTest) {
        LookUps = _LookUps_;
        test = ServiceTest;
    }));

    describe('boolean', function () {
        it('should return true as Yes and false as No', function () {
            expect(LookUps.boolean.values()).toEqual([
                {code: true, description: 'Yes'},
                {code: false, description: 'No'}
            ]);
        });
    });

    describe('branch', function () {
        beforeEach(function () {
            endpoint = 'walkInBranches';
            serviceResponse = {
                branches: [
                    {
                        code: '1',
                        name: 'Branch 1'
                    },
                    {
                        code: '2',
                        name: 'Branch 2'
                    }
                ]
            };
            lookUp = LookUps.branch;
            expectedValues = [
                {code: 1, description: 'Branch 1'},
                {code: 2, description: 'Branch 2'}
            ];
        });

        validateServiceLookUp();
    });

    describe('beneficiaryType', function () {
        it('should return static list of beneficiary types', function () {
            expect(LookUps.beneficiaryType.values()).toEqual([
                {code: "INDIVIDUAL", description: 'Person'},
                {code: "ENTITY", description: 'Entity'}
            ]);
        });
    });

    describe('beneficiaryAccountType', function () {
        it('should return static list of beneficiary account types', function () {
            expect(LookUps.beneficiaryAccountType.values()).toEqual([
                {code: "IBAN", description: 'IBAN'},
                {code: "accountNumber", description: 'Account number'}
            ]);
        });
    });

    describe('beneficiaryFee', function () {
        it('should return static list of beneficiary fees', function () {
            expect(LookUps.beneficiaryFee.values()).toEqual([
                {code: "OWN", description: 'You pay all the fees'},
                {code: "SHA", description: 'Split the fees'}
            ]);
        });
    });

    describe('language', function () {
        it('should return english and afrikaans', function () {
            expect(LookUps.language.values()).toEqual([
                {code: 'EN', description: 'English'},
                {code: 'AF', description: 'Afrikaans'}
            ]);
        });
    });

    describe('idType', function () {
        it('should return SA ID and passport', function () {
            expect(LookUps.idType.values()).toEqual([
                {code: '01', description: 'South African ID'},
                {code: '06', description: 'Passport'}
            ]);
        });
    });

    describe('productCategories', function () {
        it('should return RCP and Current', function () {
            expect(LookUps.productCategories.values()).toEqual([
                {code: 1, description: 'current'},
                {code: 4, description: 'rcp'}
            ]);
        });
    });

    function validateServiceLookUp() {
        beforeEach(function () {
            test.spyOnEndpoint(endpoint);
            test.stubResponse(endpoint, 200, serviceResponse);
        });

        it('should have undefined values if promise is not resolved', function () {
            expect(lookUp.values()).toBeUndefined();
        });

        it('should have mapped values if promise is resolved', function () {
            lookUp.values();
            test.resolvePromise();
            expect(lookUp.values()).toEqual(expectedValues);
        });

        it('should resolve promise with the mapped values', function () {
            expect(lookUp.promise()).toBeResolvedWith(expectedValues);
            test.resolvePromise();
        });

        it('should cache the service call', function () {
            lookUp.promise();
            test.resolvePromise();

            lookUp.promise();
            expect(test.endpoint(endpoint).calls.count()).toBe(1);
        });
    }

    describe('country', function () {
        beforeEach(function () {
            endpoint = 'getCountries';
            serviceResponse = {
                countries: [
                    {
                        cnrySwiftCode: 'AF',
                        cnryEngX: 'AFGHANISTAN'
                    },
                    {
                        cnrySwiftCode: 'AX',
                        cnryEngX: 'ALAND ISLAND'
                    }
                ]
            };
            lookUp = LookUps.country;
            expectedValues = [
                {code: 'AF', description: 'Afghanistan'},
                {code: 'AX', description: 'Aland island'}
            ];
        });

        validateServiceLookUp();
    });

    describe('dialling codes', function () {
        beforeEach(function () {
            endpoint = 'getCountries';
            serviceResponse = {
                countries: [
                    {
                        cnryIntnlDilngC: '27',
                        cnryEngX: 'South africa',
                        cnryCode: 'aa'
                    },
                    {
                        cnryIntnlDilngC: '93',
                        cnryEngX: 'Afghanistan',
                        cnryCode: 'aa'
                    }
                ]
            };
            lookUp = LookUps.dialingCodes;
            expectedValues = [
                {internationalDialingCode: '27', description: 'South africa', countryCode: 'aa'},
                {internationalDialingCode: '93', description: 'Afghanistan', countryCode: 'aa'}
            ];
        });

        validateServiceLookUp();
    });

    describe('employmentType', function () {
        beforeEach(function () {
            endpoint = 'getOccupationStatuses';
            serviceResponse = {
                occupStatus: [
                    {
                        ocusStatusC: '1',
                        ocusEngDescX: 'FULL TIME   '
                    },
                    {
                        ocusStatusC: '2',
                        ocusEngDescX: 'PART-TIME'
                    }
                ]
            };
            lookUp = LookUps.employmentType;
            expectedValues = [
                {code: '1', description: 'Full time'},
                {code: '2', description: 'Part-time'}
            ];
        });

        validateServiceLookUp();
    });

    describe('expenseType', function () {
        beforeEach(function () {
            endpoint = 'getIncomeAndExpenseTypes';
            serviceResponse = {
                inexTypes: [
                    {
                        inextC: 1,
                        inextIncomI: 'I',
                        inextEngX: 'SALARY'
                    },
                    {
                        inextC: 13,
                        inextIncomI: 'E',
                        inextEngX: 'ALIMONY/MAINTENANCE'
                    },
                    {
                        inextC: 14,
                        inextIncomI: 'E',
                        inextEngX: 'BUDGET AND SAVINGS'
                    }
                ]
            };
            lookUp = LookUps.expenseType;
            expectedValues = [
                {code: '13', description: 'Alimony/maintenance'},
                {code: '14', description: 'Budget and savings'}
            ];
        });

        validateServiceLookUp();
    });

    describe('incomeType', function () {
        beforeEach(function () {
            endpoint = 'getIncomeAndExpenseTypes';
            serviceResponse = {
                inexTypes: [
                    {
                        inextC: 1,
                        inextIncomI: 'I',
                        inextEngX: 'SALARY'
                    },
                    {
                        inextC: 2,
                        inextIncomI: 'I',
                        inextEngX: 'COMMISSION'
                    },
                    {
                        inextC: 14,
                        inextIncomI: 'E',
                        inextEngX: 'BUDGET AND SAVINGS'
                    }
                ]
            };
            lookUp = LookUps.incomeType;
            expectedValues = [
                {code: '01', description: 'Gross salary'},
                {code: '02', description: 'Commission'}
            ];
        });

        validateServiceLookUp();
    });

    describe('levelOfEducation', function () {
        beforeEach(function () {
            endpoint = 'getEducationQualifications';
            serviceResponse = {
                education: [
                    {
                        terqQlfcnCodeN: 101,
                        terqLevelN: 100,
                        terqDescEngX: 'BACHELOR OF BUSINESS SCIENCE                 ',
                        terqStudyTypeX: 'BACHELOR  '
                    },
                    {
                        terqQlfcnCodeN: 200,
                        terqLevelN: 0,
                        terqDescEngX: 'ARCHITECTURE                                 ',
                        terqStudyTypeX: 'DIPLOMA   '
                    },
                    {
                        terqQlfcnCodeN: 201,
                        terqLevelN: 200,
                        terqDescEngX: 'BACHELOR OF ARCHITECTURAL STUDIES            ',
                        terqStudyTypeX: 'BACHELOR  '
                    }
                ]
            };
            lookUp = LookUps.levelOfEducation;
            expectedValues = [
                {code: '101', description: 'Bachelor of business science', category: 'Bachelor'},
                {code: '201', description: 'Bachelor of architectural studies', category: 'Bachelor'}
            ];
        });

        validateServiceLookUp();
    });

    describe('maritalStatus', function () {
        beforeEach(function () {
            endpoint = 'getMaritalStatuses';
            serviceResponse = {
                maritalStatus: [
                    {
                        mrtalSttusC: '1',
                        mrtalEngDescX: 'SINGLE'
                    },
                    {
                        mrtalSttusC: '2',
                        mrtalEngDescX: 'MARRIED'
                    }
                ]
            };
            lookUp = LookUps.maritalStatus;
            expectedValues = [
                {code: '1', description: 'Single'},
                {code: '2', description: 'Married'}
            ];
        });

        validateServiceLookUp();
    });

    describe('maritalType', function () {
        it('should return static list of marital types', function () {
            expect(LookUps.maritalType.values()).toEqual([
                {code: "F", description: 'Foreign matrimonial systems'},
                {code: "S", description: 'Married in community of property'},
                {code: "T", description: 'Married out of community of property with accrual'},
                {code: "U", description: 'Married out of community of property without accrual'},
                {code: "W", description: 'Common law spouse'},
                {code: "Z", description: 'Traditional marriage'}
            ]);
        });
    });

    describe('occupationIndustry', function () {
        beforeEach(function () {
            endpoint = 'getOccupationIndustries';
            serviceResponse = {
                cccupIndustries: [
                    {
                        ocuiIndustyC: '01',
                        ocuiEngDescX: 'AGRICULTURE                                  '
                    },
                    {
                        ocuiIndustyC: '02',
                        ocuiEngDescX: 'CATERING AND ACCOMMODATION                   '
                    }
                ]
            };
            lookUp = LookUps.occupationIndustry;
            expectedValues = [
                {code: '01', description: 'Agriculture'},
                {code: '02', description: 'Catering and accommodation'}
            ];
        });

        validateServiceLookUp();
    });

    describe('occupationLevel', function () {
        beforeEach(function () {
            endpoint = 'getOccupationLevels';
            serviceResponse = {
                occupLevels: [
                    {
                        oculLevelC: '01',
                        oculEngDescX: 'DIRECTOR                                     '
                    },
                    {
                        oculLevelC: '02',
                        oculEngDescX: 'GENERAL MANAGER                              '
                    }
                ]
            };
            lookUp = LookUps.occupationLevel;
            expectedValues = [
                {code: '01', description: 'Director'},
                {code: '02', description: 'General manager'}
            ];
        });

        validateServiceLookUp();
    });

    describe('permitType', function () {
        it('should return static list of permit types', function () {
            expect(LookUps.permitType.values()).toEqual([
                {code: "03", description: 'General work visa'},
                {code: "04", description: 'Critical skills work visa'},
                {code: "05", description: 'Intra-company transfer work visa'},
                {code: "09", description: 'Business visa'},
                {code: "11", description: 'Quota work visa'}
            ]);
        });
    });

    describe('residentialStatus', function () {
        beforeEach(function () {
            endpoint = 'getAccommodationTypes';
            serviceResponse = {
                accommodationTypes: [
                    {acmdnTypeC: 1, acmdnEngX: 'OWNER'},
                    {acmdnTypeC: 2, acmdnEngX: 'TENANT'}
                ]
            };
            lookUp = LookUps.residentialStatus;
            expectedValues = [
                {code: '01', description: 'Owner'},
                {code: '02', description: 'Tenant'}
            ];
        });

        validateServiceLookUp();
    });

    describe('title', function () {
        beforeEach(function () {
            endpoint = 'getTitles';
            serviceResponse = {
                titles: [
                    {
                        title: '040',
                        engX: 'MS '
                    },
                    {
                        title: '041',
                        engX: 'MR '
                    }
                ]
            };
            lookUp = LookUps.title;
            expectedValues = [
                {code: '040', description: 'Ms'},
                {code: '041', description: 'Mr'}
            ];
        });

        validateServiceLookUp();
    });

    describe('unemploymentReason', function () {
        beforeEach(function () {
            endpoint = 'getUnemploymentReasons';
            serviceResponse = {
                occupUnempReasons: [
                    {
                        ocueReasnC: 'A',
                        ocueEngDescX: 'RETRENCHED                                   '
                    },
                    {
                        ocueReasnC: 'B',
                        ocueEngDescX: 'RETIRED                                      '
                    }
                ]
            };
            lookUp = LookUps.unemploymentReason;
            expectedValues = [
                {code: 'A', description: 'Retrenched'},
                {code: 'B', description: 'Retired'}
            ];
        });

        validateServiceLookUp();
    });

    describe('contactType', function () {
        beforeEach(function () {
            endpoint = 'getContactTypes';
            serviceResponse = {
                SapCommunicationType: [
                    {
                        typeCode: '01',
                        description: 'Telephone'
                    },
                    {
                        typeCode: '02',
                        description: 'Mobile'
                    }
                ]
            };
            lookUp = LookUps.contactType;
            expectedValues = [
                {code: '01', description: 'Telephone'},
                {code: '02', description: 'Mobile'}
            ];
        });

        validateServiceLookUp();
    });

    describe('consent', function () {
        it('should return all four marketing preferences', function () {
            expect(LookUps.consent.values()).toEqual([
                {
                    code: '03',
                    description: "Contact you about Standard Bank products, services and special offers.",
                    analytics_name: 'SB_products'
                },
                {
                    code: '01',
                    description: "Contact you about other companies' products, services and special offers. If you agree, you may be contacted by these companies.",
                    analytics_name: 'Other_companies'
                },
                {
                    code: '04',
                    description: "Share your personal information within the Group for marketing purposes.",
                    analytics_name: 'Marketing'
                },
                {
                    code: '02',
                    description: "Contact you for research purposes. Your personal information is confidential under a strict code of conduct.",
                    analytics_name: 'Research'
                }]
            );
        });
    });

    describe('communicationChannels', function(){
        it('should return all communication channels', function () {
            expect(LookUps.communicationChannel.values()).toEqual([
            {
                code: 'email',
                description: 'email\tR 0.70'
            },
            {
                code: 'sms',
                description: 'SMS\tR 0.80'
            },
            {
                code: 'none',
                description: 'Don\'t send'
            }]);
        });
    });
});
