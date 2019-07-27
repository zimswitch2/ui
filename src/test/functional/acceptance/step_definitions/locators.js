var customLocators = {
    button: function (buttonText) {
        return by.cssContainingText('button, .button, .primary, .secondary, .btn', buttonText);
    },
    title: function (titleText) {
        return by.cssContainingText('h1, h2, h3, h4, h5', titleText);
    }
};

for (var locator in customLocators) {
    by[locator] = customLocators[locator];
}

by.addLocator('sectionTitle', function(sectionTitle, parentElement) {
    var titleSelector = 'h1, h2, h3, h4, h5';
    var allTitles = (parentElement || document).querySelectorAll(titleSelector);
    var titlesMatchingText = Array.prototype.filter.call(allTitles, function(t) {
        return t.textContent.indexOf(sectionTitle) >= 0;
    });

    if (titlesMatchingText.length === 0) {
        throw new Error('Could not find title (' + titleSelector + ') matching ' + sectionTitle);
    }

    var sectionId = titlesMatchingText[0].getAttribute('title-for');

    if (sectionId === undefined || sectionId === '') {
        throw new Error('Attribute title-for must be present in title element');
    }

    return document.querySelector('#' + sectionId);
});

by.addLocator('inputLabel', function(labelText, parentElement) {
    var allLabels = (parentElement || document).querySelectorAll('label');
    var labelsMatchingText = Array.prototype.filter.call(allLabels, function(l) {
        return l.textContent.indexOf(labelText) >= 0;
    });

    if (labelsMatchingText.length === 0) {
        throw new Error('Could not find label with text ' + labelText);
    }

    var inputId = labelsMatchingText[0].getAttribute('for');

    if (inputId === undefined || inputId === '') {
        throw new Error('Attribute for must be present in label element');
    }

    return document.querySelector('#' + inputId);
});
