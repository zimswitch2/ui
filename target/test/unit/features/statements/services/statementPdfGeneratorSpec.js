describe('statement pdf generator', function () {
    /*global pdfMake:true */

    beforeEach(module('refresh.statements.pdfGenerator'));
    var statementPdfGenerator, createPdfResult, oldPdfMake;

    var location;
    beforeEach(function () {
        location = jasmine.createSpyObj('$location', ['absUrl']);
        module(function ($provide) {
            $provide.value('$location', location);
        });
    });

    beforeEach(inject(function (StatementPdfGenerator) {
        oldPdfMake = pdfMake;
        statementPdfGenerator = StatementPdfGenerator;
        spyOn(pdfMake, 'createPdf');
        createPdfResult = jasmine.createSpyObj('createPdfResult', ['download']);
        pdfMake.createPdf.and.returnValue(createPdfResult);
    }));

    afterEach(function () {
        pdfMake = oldPdfMake;
    });

    describe('lazy loading', function () {
        var urlTests = [
            {
                description: 'really complex URL',
                url: 'https://server.bank.com:8080/sub/index.html?argument#/angular/route',
                pdfMake: 'https://server.bank.com:8080/sub/bower_components/pdfmake/build/pdfmake.min.js',
                vfsFonts: 'https://server.bank.com:8080/sub/bower_components/pdfmake/build/vfs_fonts.js'
            },
            {
                description: 'simple url',
                url: 'http://server.bank.com/index.html',
                pdfMake: 'http://server.bank.com/bower_components/pdfmake/build/pdfmake.min.js',
                vfsFonts: 'http://server.bank.com/bower_components/pdfmake/build/vfs_fonts.js'
            },
            {
                description: 'simple example with main',
                url: 'http://server.bank.com/main/index.html',
                pdfMake: 'http://server.bank.com/main/bower_components/pdfmake/build/pdfmake.min.js',
                vfsFonts: 'http://server.bank.com/main/bower_components/pdfmake/build/vfs_fonts.js'
            }
        ];

        using(urlTests, function(current){
            it('should use the current URL to create download URLs with ' + current.description, function () {
                var ajaxSpy = spyOn($, 'ajax');

                ajaxSpy.and.callFake(function () {
                    pdfMake = oldPdfMake;
                    return $.Deferred().resolve();
                });

                pdfMake = undefined;

                location.absUrl.and.returnValue(current.url);

                statementPdfGenerator.downloadPdf();

                expect(ajaxSpy).toHaveBeenCalledWith({
                    url: current.pdfMake,
                    dataType: 'script',
                    cache: true
                });
                expect(ajaxSpy).toHaveBeenCalledWith({
                    url: current.vfsFonts,
                    dataType: 'script',
                    cache: true
                });
            });
        });

        it('should use existing pdfMaker if defined', function () {
            var ajaxSpy = spyOn($, 'ajax');
            statementPdfGenerator.downloadPdf();

            expect(ajaxSpy).not.toHaveBeenCalled();
        });
    });

    it('should download the pdf created using pdfMake', function () {
        statementPdfGenerator.downloadPdf();
        expect(createPdfResult.download).toHaveBeenCalled();
    });

    describe('the standard bank logo', function () {
        it('should be added', function () {
            statementPdfGenerator.downloadPdf();

            var documentDefinition = pdfMake.createPdf.calls.argsFor(0)[0];
            expect(documentDefinition.content[0].columns[0].image).toEqual('data:image/jpeg;base64,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');
        });

        it('should have the correct size', function () {
            statementPdfGenerator.downloadPdf();

            var documentDefinition = pdfMake.createPdf.calls.argsFor(0)[0];
            expect(documentDefinition.content[0].columns[0].fit).toEqual([180, 90]);
        });
    });

    describe('contact information', function () {
        it('should include customer care information', function () {
            statementPdfGenerator.downloadPdf();

            var contactInfo = pdfMake.createPdf.calls.argsFor(0)[0].content[0].columns[1];
            expect(contactInfo[0]).toEqual({
                text: 'Customer Care: 0860 123 000',
                style: 'contactInfo'
            });
        });

        it('should include the website', function () {
            statementPdfGenerator.downloadPdf();

            var contactInfo = pdfMake.createPdf.calls.argsFor(0)[0].content[0].columns[1];
            expect(contactInfo[1]).toEqual({
                text: [
                    {text: 'Website: ', bold: true},
                    'www.standardbank.co.za'
                ],
                style: 'contactInfo'
            });
        });

        it("should include today's date", function () {
            var now = moment('2014-11-22');
            var clock = sinon.useFakeTimers(now.toDate().getTime());

            statementPdfGenerator.downloadPdf();

            var contactInfo = pdfMake.createPdf.calls.argsFor(0)[0].content[0].columns[1];
            expect(contactInfo[2]).toEqual({
                text: '22 November 2014',
                style: 'contactInfo'
            });

            clock.restore();
        });


    });

    it('should have a transaction history heading', function () {
        statementPdfGenerator.downloadPdf();

        var transactionHeader = pdfMake.createPdf.calls.argsFor(0)[0].content[1];
        expect(transactionHeader).toEqual({
            text: 'Transaction History',
            fontSize: 16,
            margin: [0, 10]
        });
    });

    describe('statement details', function () {
        var statementBody, statementsTable, statementLayout;

        beforeEach(function () {
            statementBody = [{
                transactionDate: '22 December 2014',
                narrative: 'narrative',
                amount: {amount: 12},
                runningBalance: {amount: 2345}
            }];
        });
        describe('headings', function () {
            it('should include the account holder name heading', function () {
                statementPdfGenerator.downloadPdf();

                var statementDetailsHeadings = pdfMake.createPdf.calls.argsFor(0)[0].content[2].columns[0].stack;
                expect(statementDetailsHeadings[0]).toEqual({
                    text: 'Name of account holder:',
                    style: 'statementInfoRow'
                });
            });

            it('should include the account heading', function () {
                statementPdfGenerator.downloadPdf();

                var statementDetailsHeadings = pdfMake.createPdf.calls.argsFor(0)[0].content[2].columns[0].stack;
                expect(statementDetailsHeadings[1]).toEqual({
                    text: 'Account:',
                    style: 'statementInfoRow'
                });
            });

            it('should include the statement date range heading', function () {
                statementPdfGenerator.downloadPdf();

                var statementDetailsHeadings = pdfMake.createPdf.calls.argsFor(0)[0].content[2].columns[0].stack;
                expect(statementDetailsHeadings[2]).toEqual({
                    text: 'Statement date range:',
                    style: 'statementInfoRow'
                });
            });

            it('should have a columnGap', function () {

                statementPdfGenerator.downloadPdf();

                var columnGap = pdfMake.createPdf.calls.argsFor(0)[0].content[2].columnGap;
                expect(columnGap).toEqual(20);
            });
        });
        describe('values', function () {
            it('should include the account holder name', function () {
                statementPdfGenerator.downloadPdf('farmer brown');

                var statementDetailsValues = pdfMake.createPdf.calls.argsFor(0)[0].content[2].columns[1];
                expect(statementDetailsValues[0]).toEqual({
                    text: 'farmer brown',
                    style: 'statementDetailRow'
                });
            });

            it('should include the account in uppercase', function () {
                statementPdfGenerator.downloadPdf('', 'some account');

                var statementDetailsValues = pdfMake.createPdf.calls.argsFor(0)[0].content[2].columns[1];
                expect(statementDetailsValues[1]).toEqual({
                    text: 'SOME ACCOUNT',
                    style: 'statementDetailRow'
                });
            });

            it('should include the statement date range', function () {
                var now = moment('2014-11-22');
                var later = moment('2014-12-05');

                statementPdfGenerator.downloadPdf('', '', now, later);

                var statementDetailsValues = pdfMake.createPdf.calls.argsFor(0)[0].content[2].columns[1];
                expect(statementDetailsValues[2]).toEqual({
                    text: '22 November 2014 - 5 December 2014',
                    style: 'statementDetailRow'
                });
            });
        });

        describe('disclaimer note', function(){

            it('should display when filtering statements', function(){
                statementPdfGenerator.downloadPdf('', '', '', '','','','','query');

                var filteredOptions = pdfMake.createPdf.calls.argsFor(0)[0].content[3];
                expect(filteredOptions.text).toEqual('Note that these statement results are filtered and may not contain all transactions made in the selected period.');
                expect(filteredOptions.fontSize).toEqual(10);
                expect(filteredOptions.margin).toEqual([0, 3]);
            });

            it('should not display when not filtering', function(){
                statementPdfGenerator.downloadPdf();

                var filteredOptions = pdfMake.createPdf.calls.argsFor(0)[0].content[3];
                expect(filteredOptions.text).toEqual('');
                expect(filteredOptions.fontSize).toEqual(0);
                expect(filteredOptions.margin).toEqual([0, 0]);
            });

        });

        describe("styles", function () {
            it('should add statement info row style', function () {
                statementPdfGenerator.downloadPdf();

                var styles = pdfMake.createPdf.calls.argsFor(0)[0].styles;
                expect(styles.statementInfoRow).toEqual({
                    fontSize: 10,
                    margin: [0, 3]
                });
            });

            it('should add statement titles', function () {
                statementPdfGenerator.downloadPdf();

                var styles = pdfMake.createPdf.calls.argsFor(0)[0].styles;
                expect(styles.statementTitles).toEqual({
                    bold: true,
                    fillColor: '#EEEEEE',
                    fontSize: 9,
                    margin: [0, 5, 0, 5]
                });
            });


            it('should add amount titles', function () {
                statementPdfGenerator.downloadPdf();

                var styles = pdfMake.createPdf.calls.argsFor(0)[0].styles;
                expect(styles.amountTitles).toEqual({
                    bold: true,
                    fillColor: '#EEEEEE',
                    fontSize: 9,
                    margin: [10, 5, 0, 5]
                });
            });

            it('should add statement details row', function () {
                statementPdfGenerator.downloadPdf();

                var styles = pdfMake.createPdf.calls.argsFor(0)[0].styles;
                expect(styles.statementDetailRow).toEqual({
                    fontSize: 10,
                    margin: [-130, 3]
                });
            });

            it('should add contact info', function () {
                statementPdfGenerator.downloadPdf();

                var styles = pdfMake.createPdf.calls.argsFor(0)[0].styles;
                expect(styles.contactInfo).toEqual({
                    alignment: 'right',
                    fontSize: 10,
                    margin: [0, 0.5]
                });
            });

            it('should add statement values', function () {
                statementPdfGenerator.downloadPdf();

                var styles = pdfMake.createPdf.calls.argsFor(0)[0].styles;
                expect(styles.statementValues).toEqual({
                    fontSize: 9,
                    margin: [0, 5, 0, 5]
                });
            });

            it('should add amount values', function () {
                statementPdfGenerator.downloadPdf();

                var styles = pdfMake.createPdf.calls.argsFor(0)[0].styles;
                expect(styles.amountValues).toEqual({
                    fontSize: 9,
                    margin: [10, 5, 0, 5]
                });
            });
        });
        describe('transactions table', function () {
            describe('body', function () {
                it('should have bold column names on a gray background', function () {
                    statementPdfGenerator.downloadPdf('farmer brown', 'accountNumber', '22 December 2014', 'endDate', {amount:23}, statementBody, {amount:90}, null);
                    statementsTable = pdfMake.createPdf.calls.argsFor(0)[0].content[4].table;
                    expect(statementsTable.body).toEqual([[{
                        text: 'Transaction date',
                        style: 'statementTitles'
                    }, {text: 'Transaction description', style: 'statementTitles'}, {
                        text: 'Amount (R)',
                        style: 'amountTitles'
                    }, {text: 'Balance (R)', style: 'statementTitles'}], ['', {
                        text: 'Statement opening balance',
                        style: 'statementValues'
                    }, '', {text: '23.00', style: 'statementValues'}], [{
                        text: '22 December 2014',
                        style: 'statementValues'
                    }, {text: 'narrative', style: 'statementValues'}, {
                        text: '12.00',
                        style: 'amountValues'
                    }, {text: '2 345.00', style: 'statementValues'}], ['', {
                        text: 'Statement closing balance',
                        style: 'statementValues'
                    }, '', {text: '90.00', style: 'statementValues'}]]);
                });

                it('should have statement opening balance', function () {
                    statementPdfGenerator.downloadPdf('farmer brown', 'accountNumber', 'startDate', 'endDate', {amount:23}, statementBody, undefined, null);
                    statementsTable = pdfMake.createPdf.calls.argsFor(0)[0].content[4].table;
                    expect(statementsTable.body[1]).toEqual(['', {
                        text: 'Statement opening balance',
                        style: 'statementValues'
                    }, '', {text: '23.00', style: 'statementValues'}]);
                });

                it('should not have statement opening balance', function () {
                    statementPdfGenerator.downloadPdf('farmer brown', 'accountNumber', 'startDate', 'endDate', undefined, statementBody, undefined, '22 December 2014');
                    statementsTable = pdfMake.createPdf.calls.argsFor(0)[0].content[4].table;
                    expect(statementsTable.body[1]).toEqual([{
                        text: '22 December 2014',
                        style: 'statementValues'
                    }, {text: 'narrative', style: 'statementValues'}, {
                        text: '12.00',
                        style: 'amountValues'
                    }, {text: '2 345.00', style: 'statementValues'}]);
                });

                it('should have statement closing balance', function () {
                    statementPdfGenerator.downloadPdf('farmer brown', 'accountNumber', 'startDate', 'endDate', undefined, statementBody, {amount:90}, null);
                    statementsTable = pdfMake.createPdf.calls.argsFor(0)[0].content[4].table;
                    expect(statementsTable.body[2]).toEqual(['', {
                        text: 'Statement closing balance',
                        style: 'statementValues'
                    }, '', {text: '90.00', style: 'statementValues'}]);
                });

                it('should not have statement closing balance', function () {
                    statementPdfGenerator.downloadPdf('farmer brown', 'accountNumber', 'startDate', 'endDate', undefined, statementBody, undefined, null);
                    statementsTable = pdfMake.createPdf.calls.argsFor(0)[0].content[4].table;
                    expect(statementsTable.body[2]).toBeUndefined();
                });

                it('should have statement transactions', function () {
                    statementPdfGenerator.downloadPdf('farmer brown', 'accountNumber', '22 December 2014', 'endDate', undefined, statementBody, undefined, null);
                    statementsTable = pdfMake.createPdf.calls.argsFor(0)[0].content[4].table;
                    expect(statementsTable.body[1]).toEqual([{
                        text: '22 December 2014',
                        style: 'statementValues'
                    }, {text: 'narrative', style: 'statementValues'}, {
                        text: '12.00',
                        style: 'amountValues'
                    }, {text: '2 345.00', style: 'statementValues'}]);
                });
            });
        });
        describe('layout', function () {
            it('should have a layout for the table', function () {

                statementPdfGenerator.downloadPdf('farmer brown', 'accountNumber', '22 December 2014', 'endDate', 23, statementBody);
                var statementsNode = pdfMake.createPdf.calls.argsFor(0)[0].content[4].table.widths;

                statementLayout = pdfMake.createPdf.calls.argsFor(0)[0].content[4].layout;

                expect(statementLayout.hLineWidth()).toEqual(1);
                expect(statementLayout.vLineWidth(0, statementsNode)).toEqual(1);
                expect(statementLayout.hLineColor()).toEqual('#EEEEEE');
                expect(statementLayout.vLineColor()).toEqual('#EEEEEE');
            });

            it('should have a layout for the table with no columns', function () {

                statementPdfGenerator.downloadPdf('farmer brown', 'accountNumber', '22 December 2014', 'endDate', 23, statementBody);
                var statementsNode = pdfMake.createPdf.calls.argsFor(0)[0].content[4];
                statementLayout = pdfMake.createPdf.calls.argsFor(0)[0].content[4].layout;

                expect(statementLayout.vLineWidth(1, statementsNode)).toEqual(0);

            });
        });
        describe('footer', function () {
            it('should display footer details', function () {
                statementPdfGenerator.downloadPdf('farmer brown');

                var pageFooter = pdfMake.createPdf.calls.argsFor(0)[0].content[5];
                expect(pageFooter.text).toEqual('The Standard Bank of South Africa Limited (Reg. No.1962/000738/06. Authorised financial services provider. VAT Reg No.4100105461 Registered credit provider (NCRCP15). We subscribe to the Code of Banking Practice of the Banking Association South Africa and, for unresolved disputes, support resolution through the Ombudsman for Banking Services.');
            });

            it('should have font size', function () {
                statementPdfGenerator.downloadPdf('farmer brown');

                var pageFooter = pdfMake.createPdf.calls.argsFor(0)[0].content[5];
                expect(pageFooter.fontSize).toEqual(6);
            });
        });
    });
});
