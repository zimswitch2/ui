describe('given a modalMessage directive', function () {
    beforeEach(module('refresh.modalMessage'));

    var scope, directiveScope, directive, ModalMessage;
    var modalInstance = { title: "This is the title", message: "This is the content for the message", whenClosed: function() {} };

    beforeEach(inject(function (_TemplateTest_, _ModalMessage_) {
        scope = _TemplateTest_.scope;

        ModalMessage = _ModalMessage_;

        _TemplateTest_.allowTemplate('common/modalMessage/partials/modalMessage.html');
        directive = _TemplateTest_.compileTemplate('<modal-message></modal-message>');
        directiveScope = directive.isolateScope();
    }));

    it('Should have a modal message set to the scope', function(){
        expect(directiveScope.modal).toBeDefined();
    });

    describe('when modal instance isShown = false', function () {
        it('should hide the modal dialog box', function () {
            scope.$apply();

            expect(directiveScope.modal.isShown).toBeFalsy();
            expect(directive.find('.modal-overlay')).toBeHidden();
        });
    });

    describe('when modal instance isShown = true', function () {
        beforeEach(function () {
            ModalMessage.showModal(modalInstance);
            scope.$apply();
        });

        it('should show the modal dialog box', function () {
            expect(directive.find('.modal-overlay')).not.toBeHidden();
        });

        it('should set the title, the content and the closed callback of the modalInstance', function () {
            expect(ModalMessage.modalInstance().title).toBe(modalInstance.title);
            expect(ModalMessage.modalInstance().message).toBe(modalInstance.message);
            expect(ModalMessage.modalInstance().whenClosed).toBe(modalInstance.whenClosed);
        });
    });

    describe('when close is called', function(){
        it('should call hideModal on ModalMessage service', function(){
            spyOn(ModalMessage, 'hideModal');
            directiveScope.close();
            expect(ModalMessage.hideModal).toHaveBeenCalled();
        });
    });
});

describe('given ModalMessage service', function () {
    beforeEach(module('refresh.modalMessage'));

    var ModalMessage;

    beforeEach(inject(function (_ModalMessage_) {
        ModalMessage = _ModalMessage_;
    }));

    it('should have an instance of a modal object', function() {
        expect(ModalMessage.modalInstance()).toBeDefined();
    });

    it('should NOT show modal dialog box', function() {
        expect(ModalMessage.modalInstance().isShown).toBeFalsy();
    });

    describe('when showMessage is called', function () {
        var modalInstance = { title: "This is the title", message: "This is the content for the message" };
        beforeEach(function(){
            ModalMessage.showModal(modalInstance);
            var actualInsatnce = ModalMessage.modalInstance();
            actualInsatnce.whenClosed();
        });

        it('should show modal dialog box', function () {
            expect(ModalMessage.modalInstance().isShown).toBeTruthy();
        });

        it('should show modal dialog box with custom title', function () {
            expect(ModalMessage.modalInstance().title).toBe(modalInstance.title);
        });

        it('should show modal dialog box with custom message', function () {
            expect(ModalMessage.modalInstance().message).toBe(modalInstance.message);
        });
    });

    describe('when hideModal is called', function () {
        describe('and whenClosed is defined', function () {
            var modalInstance = {
                title: "This is the title",
                message: "This is the content for the message",
                whenClosed: function () {
                }
            };

            beforeEach(function () {
                spyOn(modalInstance, 'whenClosed');
                ModalMessage.showModal(modalInstance);
                ModalMessage.hideModal();
            });

            it('should hide modal dialog box', function () {
                expect(ModalMessage.modalInstance().isShown).toBeFalsy();
            });

            it('should call the closed callback on the modal instance', function () {
                expect(modalInstance.whenClosed).toHaveBeenCalled();
            });
        });
    });
});