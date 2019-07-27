describe("ng-pattern", function () {
    beforeEach(module('refresh.textValidation', 'refresh.sbForm', 'refresh.fixture', 'refresh.test'));
    var element, inputElement;

    beforeEach(inject(function (_TemplateTest_) {
        _TemplateTest_.allowTemplate('common/sbform/partials/sbTextInput.html');

        var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' text-validation pattern-message='Wrong pattern'></form>";
        element = _TemplateTest_.compileTemplate(form);
        inputElement = element.find('sb-input').find('input');
    }));

    it("should render the right regex in the ng-pattern attribute", function () {
        /* jshint ignore:start */
        expect(inputElement.attr('ng-pattern')).toEqual("[A-Za-z0-9\\:\\;\\/\\\\\\,\\-\\(\\)\\.\\&\\@\\*\\#\\?' ]*");
        /* jshint ignore:end */
    });

    it("should display a message when text is entered that doesn't match the regex pattern", function () {
        inputElement.val('!!!');
        inputElement.trigger('input');
        var error = element.find('sb-input').find('.form-error').not('.ng-hide');
        expect(error.text()).toEqual('Wrong pattern');
    });

    [
      ":",
      ";",
      "/",
      "\\",
      ",",
      "-",
      "(",
      ")",
      ".",
      "&",
      "@",
      "*",
      "#",
      "\'",
      "?"
    ].forEach(function(character){
      it("should allow " + character + " to be entered", function () {
          inputElement.val("asd" + character);
          inputElement.trigger('input');
          var input = element.find('sb-input input');
          expect(input.hasClass('ng-invalid')).toBeFalsy();
      });
    });
});
