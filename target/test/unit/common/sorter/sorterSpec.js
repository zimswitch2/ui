describe('sorter', function () {
    'use strict';

    var scope, sortBy;

    beforeEach(module('refresh.sorter'));

    beforeEach(inject(function ($sorter) {
        sortBy = $sorter;
        scope = {};
    }));

    it('should set the sort criteria', function () {
        sortBy.call(scope, 'field');
        expect(scope.sort.criteria).toEqual('field');
    });

    it('should set the sort order as descending by default', function () {
        sortBy.call(scope, 'field');
        expect(scope.sort.descending).toEqual(true);
    });

    it('should toggle the sort order', function () {
        sortBy.call(scope, 'field');
        sortBy.call(scope, 'field');
        expect(scope.sort.descending).toEqual(false);
    });
});
