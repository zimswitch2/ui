 describe('Inline Action directive', function () {
    'use strict';

    beforeEach(module('refresh.inlineAction', 'refresh.test', 'refresh.test.inlineAction'));

    var compiledElement, outerScope, isolateScope, controllerScope;
    var showWhen = true;

    angular.module('refresh.test.inlineAction', []).controller('DeleteTestOuterController', function ($scope, $q) {
        $scope.someDeleteFn = function () {
            var deferred = $q.defer();
            deferred.reject();
            return deferred.promise;
        };

        $scope.confirmDeleteMessage = function() {
            return 'Custom delete message <span>with html</span>';
        };

        $scope.track = function() {
            return 'tracker';
        };

        $scope.errorDeleteMessage = function() {
            return 'Custom error message';
        };
    });

    beforeEach(inject(function ($rootScope, $compile, _TemplateTest_, $controller) {
        controllerScope = $rootScope.$new();
        $controller('DeleteTestOuterController', {
            $scope: controllerScope
        });

        var markup = '<ul ng-controller="DeleteTestOuterController">' +
            '<li><div class="actions">' +
            '<div inline-action="delete" show-when="showWhen()" action-message="confirmDeleteMessage()" confirm-fn="someDeleteFn()" error-message="errorDeleteMessage()"></div></div></li></ul>';
        _TemplateTest_.stubTemplate('common/spinner/partials/inlineSpinner.html', '');
        _TemplateTest_.allowTemplate('common/inlineAction/partials/inlineAction.html');
        outerScope = _TemplateTest_.scope;
        outerScope.confirmFn = function () {
            return 'deleteFn called';
        };

        outerScope.showWhen = function(){
            return showWhen;
        };

        compiledElement = _TemplateTest_.compileTemplate(markup);
        isolateScope = compiledElement.find('div[inline-action]').isolateScope();
    }));

    describe('track click', function () {
        beforeEach(inject(function ($compile, _TemplateTest_) {
            var markup = '<ul ng-controller="DeleteTestOuterController">' +
                '<li><div class="actions">' +
                '<div inline-action="delete" button-track="track()" show-when="showWhen()" action-message="confirmDeleteMessage()" confirm-fn="someDeleteFn()" error-message="errorDeleteMessage()"></div></div></li></ul>';

            _TemplateTest_.stubTemplate('common/spinner/partials/inlineSpinner.html', '');
            _TemplateTest_.allowTemplate('common/inlineAction/partials/inlineAction.html');

            compiledElement = _TemplateTest_.compileTemplate(markup);
        }));

        it('should have a track click attribute when button track scope is set', function () {
            expect(compiledElement.find('.confirm').attr('track-click')).toEqual('tracker');
        });
    });

    describe('confirm button tagging', function () {
        beforeEach(inject(function ($compile, _TemplateTest_) {
            var markup = '<ul ng-controller="DeleteTestOuterController">' +
                '<li><div class="actions">' +
                '<div inline-action="delete" confirm-dtmid="a DTM id" confirm-dtmtext="a DTM string" show-when="showWhen()" action-message="confirmDeleteMessage()" confirm-fn="someDeleteFn()" error-message="errorDeleteMessage()"></div></div></li></ul>';

            _TemplateTest_.stubTemplate('common/spinner/partials/inlineSpinner.html', '');
            _TemplateTest_.allowTemplate('common/inlineAction/partials/inlineAction.html');

            compiledElement = _TemplateTest_.compileTemplate(markup);
        }));

        it('should have a dtmid attribute when confirm-dtmid scope is set', function () {
            expect(compiledElement.find('.confirm').attr('data-dtmid')).toEqual('a DTM id');
        });

        it('should have a dtmtext attribute when confirm-dtmid scope is set', function () {
            expect(compiledElement.find('.confirm').attr('data-dtmtext')).toEqual('a DTM string');
        });
    });

    describe('NO confirm and cancel button tagging', function () {
        beforeEach(inject(function ($compile, _TemplateTest_) {
            var markup = '<ul ng-controller="DeleteTestOuterController">' +
                '<li><div class="actions">' +
                '<div inline-action="delete" show-when="showWhen()" action-message="confirmDeleteMessage()" confirm-fn="someDeleteFn()" error-message="errorDeleteMessage()"></div></div></li></ul>';

            _TemplateTest_.stubTemplate('common/spinner/partials/inlineSpinner.html', '');
            _TemplateTest_.allowTemplate('common/inlineAction/partials/inlineAction.html');

            compiledElement = _TemplateTest_.compileTemplate(markup);
        }));

        it('should NOT have a dtmid attribute on confirm button when confirm-dtmid scope is not set', function () {
            expect(compiledElement.find('.confirm').attr('data-dtmid')).not.toBeDefined();
        });

        it('should NOT have a dtmtext attribute on confirm button when confirm-dtmid scope is not set', function () {
            expect(compiledElement.find('.confirm').attr('data-dtmtext')).not.toBeDefined();
        });

        it('should NOT have a dtmid attribute on cancel button when confirm-dtmid scope is not set', function () {
            expect(compiledElement.find('.cancel').attr('data-dtmid')).not.toBeDefined();
        });

        it('should NOT have a dtmtext attribute on cancel button when confirm-dtmid scope is not set', function () {
            expect(compiledElement.find('.cancel').attr('data-dtmtext')).not.toBeDefined();
        });
    });

    describe('cancel button tagging', function () {
        beforeEach(inject(function ($compile, _TemplateTest_) {
            var markup = '<ul ng-controller="DeleteTestOuterController">' +
                '<li><div class="actions">' +
                '<div inline-action="delete" cancel-dtmid="a DTM id" cancel-dtmtext="a DTM string" show-when="showWhen()" action-message="confirmDeleteMessage()" confirm-fn="someDeleteFn()" error-message="errorDeleteMessage()"></div></div></li></ul>';

            _TemplateTest_.stubTemplate('common/spinner/partials/inlineSpinner.html', '');
            _TemplateTest_.allowTemplate('common/inlineAction/partials/inlineAction.html');

            compiledElement = _TemplateTest_.compileTemplate(markup);
        }));

        it('should have a dtmid attribute when confirm-dtmid scope is set', function () {
            expect(compiledElement.find('.cancel').attr('data-dtmid')).toEqual('a DTM id');
        });

        it('should have a dtmtext attribute when confirm-dtmid scope is set', function () {
            expect(compiledElement.find('.cancel').attr('data-dtmtext')).toEqual('a DTM string');
        });
    });

    describe('no track click', function () {
        beforeEach(inject(function ($compile, _TemplateTest_) {
            var markup = '<ul ng-controller="DeleteTestOuterController">' +
                '<li><div class="actions">' +
                '<div inline-action="delete" show-when="showWhen()" action-message="confirmDeleteMessage()" confirm-fn="someDeleteFn()" error-message="errorDeleteMessage()"></div></div></li></ul>';

            _TemplateTest_.stubTemplate('common/spinner/partials/inlineSpinner.html', '');
            _TemplateTest_.allowTemplate('common/inlineAction/partials/inlineAction.html');

            compiledElement = _TemplateTest_.compileTemplate(markup);
        }));

        it('should have not a track click attribute when button track scope is not set', function () {
            expect(compiledElement.find('.confirm').attr('track-click')).toBeUndefined();

        });
    });

    it('should display a delete icon', function () {
        expect(compiledElement.find('.delete').length).toEqual(1);
        expect(compiledElement.find('.delete i').hasClass('icomoon-delete')).toBeTruthy();
    });

    it('should have danger-confirm class for Confirm button', function () {
        expect(compiledElement.find('.confirm-actions .confirm').hasClass('danger-confirm')).toBeTruthy();
    });

    it('should have danger class for action item div', function () {
        expect(compiledElement.find('.action-item div').hasClass('danger')).toBeTruthy();
    });

    it('should capitalize a title', function () {
        expect(compiledElement.find('.delete .title').text()).toEqual('Delete');
    });

    it('should clear the actionState when show state is false', function () {
        showWhen = false;
        outerScope.$digest();
        expect(isolateScope.actionState).toEqual('');
    });

    describe('clicking on delete icon', function () {
        beforeEach(function () {
            compiledElement.find('.delete').click();
        });

        it('should display the delete message when clicking on the delete icon', function () {
            expect(compiledElement.find('.action-doing').text()).toMatch('Custom delete message with html');
        });

        it('should display the delete icon again when clicking on cancel button', function () {
            expect(compiledElement.find('.delete:visible').length).toEqual(0);
            compiledElement.find('.cancel').click();
            expect(compiledElement.find('.delete').length).toEqual(1);
        });

        it('should call the deleteFn when clicking on the confirm button', function () {
            spyOn(isolateScope, 'confirmFn').and.callThrough();
            compiledElement.find('.confirm').click();
            expect(isolateScope.confirmFn).toHaveBeenCalled();
            expect(compiledElement.find('.action-failure').text()).toMatch('Custom error message');
        });
    });
});

describe('Delete Controller', function () {
    beforeEach(module('refresh.inlineAction', 'refresh.configuration', 'refresh.test'));

    var scope, q, mock;
    beforeEach(inject(function ($rootScope, $controller, $q, _mock_) {
        scope = $rootScope.$new();
        q = $q;
        mock = _mock_;

        $controller('InlineActionController', {
            $scope: scope
        });

    }));

    describe('when calling delete', function () {

        it('should return success when the delete promise resolves', function (done) {
            var deferred = q.defer();
            scope.confirmFn = function () {
                deferred.resolve();
                return deferred.promise;
            };
            scope.execAction();

            scope.$digest();

            expect(scope.actionState).toEqual('success');
            done();
        });

        it('should return error when the delete promise rejected', function (done) {
            var deferred = q.defer();
            scope.confirmFn = function () {
                deferred.reject();
                return deferred.promise;
            };
            scope.execAction();

            scope.$digest();

            expect(scope.actionState).toEqual('failed');
            done();
        });
     });
});