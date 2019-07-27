(function (module) {
    module.factory('TemplateTest', function ($rootScope, _$compile_, Fixture, $templateCache, $sniffer) {

        function loadTemplateFile(templatePath) {
            return Fixture.load('base/main/' + templatePath);
        }

        return {
            scope: $rootScope.$new(),
            stubTemplate: function (templatePath, templateContent) {
                $templateCache.put(templatePath, templateContent || '');
            },
            allowTemplate: function (templatePath) {
                $templateCache.put(templatePath, loadTemplateFile(templatePath));
            },
            elementAt: function (index, elements) {
                return angular.element(elements[index]);
            },
            compileTemplate: function (html, runDigest) {
                var element = _$compile_(angular.element(html))(this.scope);
                if (runDigest !== false) {
                    this.scope.$digest();
                }
                return element;
            },
            compileTemplateInFile: function (templatePath) {
                return this.compileTemplate('<div>' + loadTemplateFile(templatePath) + '</div>');
            },
            changeInputValueTo: function (inputElement, value) {
                inputElement.val(value);
                var eventName = $sniffer.hasEvent('input') ? 'input' : 'change';
                inputElement.trigger(eventName);
            },
            clickCheckbox: function (inputElement, value) {
                if (value) {
                    inputElement.attr('checked', 'checked');
                } else {
                    inputElement.removeAttr('checked');
                }
                inputElement.triggerHandler('click');
            },
            addRootNodeToDocument: function (html) {
                return "<div>" + html + "</div>";
            },
            addToForm: function (html) {
               return "<form name='form'>" + html + "</form>";
            }
        };
    });
})(angular.module('refresh.test'));
