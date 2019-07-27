/*global moment:true */
describe('Datepicker', function () {
    var formTrackerServiceSpy;
                
    beforeEach(module('refresh.datepicker', 'refresh.fixture', 'refresh.test', 'refresh.formtracker', function($provide) {
        formTrackerServiceSpy = jasmine.createSpyObj('formTrackerServiceSpy', ['triggerChangeOn']);
        $provide.service('formTrackerService', function() {
            return formTrackerServiceSpy;
        });
    }));

    describe('directive', function () {
        var realMoment, test;
        beforeEach(inject(function (_TemplateTest_, $document) {
            test = _TemplateTest_;
            realMoment = moment;

            moment = function (date) {
                if (date) {
                    return realMoment(date);
                }
                return realMoment().year(2013).month(1).date(10);
            };

            moment.isMoment = realMoment.isMoment;

            _TemplateTest_.allowTemplate('common/datepicker/partials/datepicker.html');
            this.outerScope = _TemplateTest_.scope;

            this.documentOffSpy = spyOn($document, 'off');
        }));

        afterEach(function () {
            moment = realMoment;
        });

        describe('valid date range', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" earliest-date="2013-01-01" latest-date="2013-03-31"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('may have a start date', function () {
                expect(realMoment.isMoment(this.scope.earliestDate));
                expect(realMoment('2013-01-01').startOf('day').isSame(this.scope.earliestDate)).toBeTruthy();
            });

            it('may have an end date', function () {
                expect(realMoment.isMoment(this.scope.latestDate));
                expect(realMoment('2013-03-31').startOf('day').isSame(this.scope.latestDate)).toBeTruthy();
            });

            describe('view', function () {
                it('should not apply the invalid class to valid dates', function () {
                    expect(this.element.find('.dates li:nth(1)').is(':not(.invalid)')).toBeTruthy();
                });

                it('should apply the invalid class to invalid dates', function () {
                    this.element.find('.nextMonth').click();
                    this.element.find('.nextMonth').click();
                    expect(this.element.find('.dates li:nth(1)').is('.invalid')).toBeTruthy();
                });

                it('should not select invalid dates', function () {
                    this.element.find('.nextMonth').click();
                    this.element.find('.nextMonth').click();
                    this.element.find('.dates li:nth(9)').click();
                    expect(this.outerScope.chosenDate).toBeUndefined();
                });

                describe('when latest date', function () {
                    describe('is in the same month', function () {
                        it('should show the current month', function () {
                            this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" earliest-date="2013-01-01" latest-date="2013-02-01"></sb-datepicker>');
                            this.scope = this.element.isolateScope();
                            expect(this.scope.month()).toEqual('February');
                            expect(this.scope.year()).toEqual('2013');
                        });
                    });

                    describe('is invalid', function () {
                        it('should show current month', function () {
                            this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" earliest-date="2013-01-01" latest-date=""></sb-datepicker>');
                            this.scope = this.element.isolateScope();
                            this.scope.latestDate = 'invalid latest';
                            this.scope.$digest();
                            expect(this.scope.month()).toEqual('February');
                            expect(this.scope.year()).toEqual('2013');
                        });
                    });

                    describe('is later in the same year', function () {
                        it('should show the current month', function () {
                            this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" earliest-date="2012-01-01" latest-date="2013-04-01"></sb-datepicker>');
                            this.scope = this.element.isolateScope();
                            expect(this.scope.month()).toEqual('February');
                            expect(this.scope.year()).toEqual('2013');
                        });
                    });

                    describe('is some year in the future', function () {
                        it('should show the current year', function () {
                            this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" earliest-date="2012-01-01" latest-date="2015-02-01"></sb-datepicker>');
                            this.scope = this.element.isolateScope();
                            expect(this.scope.month()).toEqual('February');
                            expect(this.scope.year()).toEqual('2013');
                        });
                    });

                    describe('is earlier in the same year', function () {
                        it('should show the latest valid month', function () {
                            this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" earliest-date="2012-01-01" latest-date="2013-01-01"></sb-datepicker>');
                            this.scope = this.element.isolateScope();
                            expect(this.scope.month()).toEqual('January');
                            expect(this.scope.year()).toEqual('2013');
                        });
                    });

                    describe('is some year in the past' +
                    '', function () {
                        it('should show the latest valid year', function () {
                            this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" earliest-date="2012-01-01" latest-date="2012-02-01"></sb-datepicker>');
                            this.scope = this.element.isolateScope();
                            expect(this.scope.month()).toEqual('February');
                            expect(this.scope.year()).toEqual('2012');
                        });
                    });
                });
            });
        });

        describe('initialize', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should display 6 rows of dates', function () {
                expect(this.scope.dates().length).toEqual(42);
            });

            it('should set year to the current year', function () {
                expect(this.scope.year()).toEqual('2013');
            });

            it('should set selectedMonth to the current', function () {
                expect(this.scope.month()).toEqual('February');
            });

            it('should populate dates with the dates of the selectedMonth', function () {
                expect(this.scope.dates()[5].date).toEqual(1);
                expect(this.scope.dates()[32].date).toEqual(28);
            });

            it('should populate days before the 1st of the selectedMonth with the dates of the previous month', function () {
                expect(this.scope.dates()[0].date).toEqual(27);
                expect(this.scope.dates()[4].date).toEqual(31);
            });

            it('should populate dates after the end of the selectedMonth with the dates of the next month', function () {
                expect(this.scope.dates()[33].date).toEqual(1);
                expect(this.scope.dates()[34].date).toEqual(2);
            });

            it('should set the date format', function () {
                expect(this.scope.dateFormat).toEqual('YYYY-MM-DDTHH:mm:ss.SSSZZ');
            });
        });

        describe('#nextMonth', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should increment the selected month', function () {
                this.scope.nextMonth();
                this.scope.nextMonth();
                expect(this.scope.month()).toEqual('April');
            });

            it('should increment the selected year when the selected month is December', function () {
                this.scope.selectedMonth.month(11);
                this.scope.nextMonth();
                expect(this.scope.month()).toEqual('January');
                expect(this.scope.year()).toEqual('2014');
            });
        });

        describe('#previousMonth', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should decrement the selectedMonth', function () {
                this.scope.previousMonth();
                this.scope.previousMonth();
                expect(this.scope.month()).toEqual('December');
            });

            it('should decrement the selected year when the selected month is January', function () {
                this.scope.selectedMonth.month(0);
                this.scope.previousMonth();
                expect(this.scope.month()).toEqual('December');
                expect(this.scope.year()).toEqual('2012');
            });
        });

        describe("selectYear", function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it("should select year from dropdown", function () {
                this.scope.selectedYear = '2003';

                this.scope.selectYear();

                expect(this.scope.selectedMonth.year()).toEqual(2003);
                expect(this.scope.selectedMonth.month()).toEqual(1);
            });
        });

        describe('#month', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should return the text value of the selected month', function () {
                expect(this.scope.month()).toEqual('February');
            });
        });

        describe('#year', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" is-date-of-birth="true"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should return the selected year', function () {
                expect(this.scope.year()).toEqual('2013');
            });
        });

        describe('available years', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" skip-year="true" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" is-date-of-birth="true"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should show the years to select from', function () {
                expect(this.scope.availableYears).toContain('1900');
                expect(this.scope.availableYears).toContain('2013');
                expect(this.scope.availableYears).not.toContain('1899');
                expect(this.scope.availableYears).not.toContain('2014');
            });

            it('should add the year to select from on next year', function () {
                this.scope.nextYear();

                expect(this.scope.availableYears).toContain('1900');
                expect(this.scope.availableYears).toContain('2013');
                expect(this.scope.availableYears).not.toContain('1899');
                expect(this.scope.availableYears).toContain('2014');
            });

            it('should add the year to select from on previous year', function () {
                this.scope.selectedMonth.year(1900);
                this.scope.previousYear();

                expect(this.scope.availableYears).toContain('1900');
                expect(this.scope.availableYears).toContain('2013');
                expect(this.scope.availableYears).toContain('1899');
                expect(this.scope.availableYears).not.toContain('2014');
            });

            it('should add the year to select from on next month', function () {
                this.scope.selectedMonth.month(11);
                this.scope.nextMonth();

                expect(this.scope.availableYears).toContain('1900');
                expect(this.scope.availableYears).toContain('2013');
                expect(this.scope.availableYears).not.toContain('1899');
                expect(this.scope.availableYears).toContain('2014');
            });

            it('should add the year to select from on previous month', function () {
                this.scope.selectedMonth.year(1900);
                this.scope.previousMonth();
                this.scope.previousMonth();

                expect(this.scope.availableYears).toContain('1900');
                expect(this.scope.availableYears).toContain('2013');
                expect(this.scope.availableYears).toContain('1899');
                expect(this.scope.availableYears).not.toContain('2014');
            });
        });

        describe('#isWeekend', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should return true if date is a Saturday', function () {
                expect(this.scope.isWeekend(this.scope.dates()[6].moment)).toBeTruthy();
            });

            it('should return true if date is a Sunday', function () {
                expect(this.scope.isWeekend(this.scope.dates()[7].moment)).toBeTruthy();
            });

            it('should return false if date is not a Saturday or Sunday', function () {
                expect(this.scope.isWeekend(this.scope.dates()[1].moment)).toBeFalsy();
                expect(this.scope.isWeekend(this.scope.dates()[2].moment)).toBeFalsy();
                expect(this.scope.isWeekend(this.scope.dates()[3].moment)).toBeFalsy();
                expect(this.scope.isWeekend(this.scope.dates()[4].moment)).toBeFalsy();
                expect(this.scope.isWeekend(this.scope.dates()[5].moment)).toBeFalsy();
            });
        });

        describe('#isValid', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should invalidate dates outside of the valid date range', function () {
                this.scope.earliestDate = realMoment('2013-01-01');
                this.scope.latestDate = realMoment('2013-03-31');
                expect(this.scope.isValid(realMoment('2012-12-31'))).toBeFalsy();
                expect(this.scope.isValid(realMoment('2012-04-01'))).toBeFalsy();
            });

            it('should validate dates inside of the valid date range', function () {
                this.scope.earliestDate = realMoment('2013-01-01');
                this.scope.latestDate = realMoment('2013-03-31');
                expect(this.scope.isValid(realMoment('2012-01-01'))).toBeFalsy();
                expect(this.scope.isValid(realMoment('2012-03-31'))).toBeFalsy();
            });

            it('should validate all dates when there is neither earliest or latest date', function () {
                this.scope.earliestDate = undefined;
                this.scope.latestDate = undefined;
                expect(this.scope.isValid(realMoment('2012-01-01'))).toBeTruthy();
                expect(this.scope.isValid(realMoment('2012-03-31'))).toBeTruthy();
            });

            it('should validate all dates after earliest date when there is only an earliest date', function () {
                this.scope.earliestDate = realMoment('2013-01-01');
                this.scope.latestDate = undefined;
                expect(this.scope.isValid(realMoment('2012-12-31'))).toBeFalsy();
                expect(this.scope.isValid(realMoment('2013-01-01'))).toBeTruthy();
            });

            it('should validate all dates before latest date when there is only an latest date', function () {
                this.scope.earliestDate = undefined;
                this.scope.latestDate = realMoment('2013-03-31');
                expect(this.scope.isValid(realMoment('2013-03-31'))).toBeTruthy();
                expect(this.scope.isValid(realMoment('2013-04-01'))).toBeFalsy();
            });
        });

        describe('view', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should display the select month name', function () {
                expect(this.element.find('.month').text()).toEqual('February');
            });

            it('should display the selected year', function () {
                expect(this.element.find('.year').text()).toEqual('2013');
            });

            it('should display the dates in the selected month', function () {
                expect(this.element.find('.dates li:nth(5)').text()).toEqual('1');
                expect(this.scope.dates()[5].date).toEqual(1);
            });

            it('should display the dates in the previous month when next previous is clicked', function () {
                this.element.find('.previousMonth').click();
                expect(this.element.find('.month').text()).toEqual('January');
                expect(this.element.find('.dates li:nth(2)').text()).toEqual('1');
                expect(this.scope.dates()[2].date).toEqual(1);
            });

            it('should display the dates in the next month when next next is clicked', function () {
                this.element.find('.nextMonth').click();
                this.element.find('.nextMonth').click();
                expect(this.element.find('.month').text()).toEqual('April');
                expect(this.element.find('.dates li:nth(1)').text()).toEqual('1');
                expect(this.scope.dates()[1].date).toEqual(1);
            });

            it('should select the date as the moment when a date is clicked', function () {
                this.scope.dateFormat = undefined;
                this.element.find('.dates li:nth(9)').click();
                expect(realMoment('2013-02-05').isSame(this.outerScope.chosenDate)).toBeTruthy();
            });

            it('should select the date when a date is clicked', function () {
                this.element.find('.dates li:nth(5)').click();
                expect(this.outerScope.chosenDate).toEqual('2013-02-01T00:00:00.000+0200');
            });

            it('should call triggerChangeOn on the formtracker when a date is clicked', function () {
                this.element.find('.dates li:nth(5)').click();
                expect(formTrackerServiceSpy.triggerChangeOn).toHaveBeenCalled();
            });

            it('should select the date in a custom format when a date is clicked', function () {
                this.scope.dateFormat = 'DD MMMM YYYY';
                this.element.find('.dates li:nth(10)').click();
                expect(this.outerScope.chosenDate).toEqual('06 February 2013');
            });

            it('should call onSelect function when a date is clicked', function () {
                spyOn(this.scope, 'onSelect');
                this.element.find('.dates li:nth(10)').click();
                expect(this.scope.onSelect.calls.argsFor(0)[0].date.format('DD MMMM YYYY')).toEqual('06 February 2013');
            });

            it('should update the input when a date is selected', function () {
                this.scope.dateFormat = 'DD MMMM YYYY';
                this.element.find('.dates li:nth(10)').click();
                expect(this.element.find('input').val()).toEqual('06 February 2013');
            });

            it('should highlight the selected date', function () {
                this.scope.dateFormat = 'DD MMMM YYYY';
                this.element.find('.dates li:nth(10)').click();
                expect(this.element.find('.dates li:nth(10)').is('.selected')).toBeTruthy();
            });

            it('should apply weekend class to Saturdays', function () {
                expect(this.element.find('.dates li:nth(6)').is('.weekend')).toBeTruthy();
            });

            it('should apply weekend class to Sundays', function () {
                expect(this.element.find('.dates li:nth(7)').is('.weekend')).toBeTruthy();
            });

            it('should have disabled input', function () {
                expect(this.element.find('input').attr('readonly')).toBeTruthy();
            });

            it('should not display the datepicker initially', function () {
                expect(this.element.find('.datepicker').hasClass('ng-hide')).toBeTruthy();
            });

            it('should remove the click listener on destroy event', function () {
                this.scope.showPicker();
                this.scope.$broadcast('$destroy');
                expect(this.documentOffSpy).toHaveBeenCalled();
            });

            it('should mark days that are not in the month selected with the different-month class', function () {
                expect(this.element.find('.dates li:nth(0)').is('.different-month')).toBeTruthy();
                expect(this.element.find('.dates li:nth(34)').is('.different-month')).toBeTruthy();
            });

            it('should not mark invalid days that are not in the month selected with the different-month class', function () {
                this.scope.earliestDate = realMoment('2013-01-31');
                this.scope.latestDate = realMoment('2013-03-01');
                this.scope.$digest();

                expect(this.element.find('.dates li:nth(0)').is('.different-month')).toBeFalsy();
                expect(this.element.find('.dates li:nth(34)').is('.different-month')).toBeFalsy();
            });

            it('should not mark selected date with the different-month class', function () {
                this.element.find('.dates li:nth(0)').click();
                expect(this.element.find('.dates li:nth(0)').is('.different-month')).toBeFalsy();

                this.element.find('.dates li:nth(34)').click();
                expect(this.element.find('.dates li:nth(34)').is('.different-month')).toBeFalsy();
            });

            it('should not apply weekend class to days that are not Saturday or Sunday', function () {
                expect(this.element.find('.dates li:nth(1)').is(':not(.weekend)')).toBeTruthy();
                expect(this.element.find('.dates li:nth(2)').is(':not(.weekend)')).toBeTruthy();
                expect(this.element.find('.dates li:nth(3)').is(':not(.weekend)')).toBeTruthy();
                expect(this.element.find('.dates li:nth(4)').is(':not(.weekend)')).toBeTruthy();
                expect(this.element.find('.dates li:nth(5)').is(':not(.weekend)')).toBeTruthy();
            });
        });

        describe('viewDefaultDateFormat', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" view-default-date-format="true"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should display the date on a different format than the model', function () {
                this.element.find('.dates li:nth(14)').click();
                expect(this.element.find('input').val()).toEqual('10 February 2013');
                expect(this.scope.ngModel).toEqual('2013-02-10T00:00:00.000+0200');
            });
        });

        describe('click', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should hide the date picker when clicking outside', inject(function ($document) {
                $document.find('body').append(this.element);
                $document.click();
                this.scope.$digest();
                expect(this.scope.selecting).toBeFalsy();
            }));

            it('should leave the date picker when clicking inside', inject(function ($document) {
                $document.find('body').append(this.element);
                this.element.find('input')[0].click();
                this.scope.$digest();
                expect(this.scope.selecting).toBeTruthy();
            }));
        });

        describe('press key', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            it('should hide the date picker when pressing tab key on input field', inject(function ($document) {
                $document.find('body').append(this.element);
                this.element.find('input').trigger({type: 'keydown', which: 9, keyCode: 9});
                this.scope.$digest();
                expect(this.scope.selecting).toBeFalsy();
            }));

            it('should leave the date picker when pressing other key on input field', inject(function ($document) {
                $document.find('body').append(this.element);
                this.element.find('input')[0].click();
                this.element.find('input').trigger({type: 'keydown', which: 13, keyCode: 13});
                this.scope.$digest();
                expect(this.scope.selecting).toBeTruthy();
            }));
        });

        describe('skipping year', function () {
            beforeEach(function () {
                this.element = test.compileTemplate('<sb-datepicker ng-model="chosenDate" skip-year="true" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></sb-datepicker>');
                this.scope = this.element.isolateScope();
            });

            describe('#nextYear', function () {
                it('should increment the selected year', function () {
                    this.scope.nextYear();
                    expect(this.scope.year()).toEqual('2014');
                });
            });

            describe('#previousYear', function () {
                it('should decrement the selected year', function () {
                    this.scope.previousYear();
                    expect(this.scope.year()).toEqual('2012');
                });
            });
        });
    });
});
