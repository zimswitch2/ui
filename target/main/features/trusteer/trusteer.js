window.xvbGGNadCs = function () {
    var user = angular.element(document).injector().get('User');
    return {
        "p" : (user ? user.userProfile.username : undefined)
    };
};

/* istanbul ignore next */
window.loadTrusteerScript = function (scriptUrlWithoutProtocol) {
    if (window.location.hostname.indexOf('standardbank.co.za') > 0) {
        var scriptProtocol = (window.location.protocol === "https:" ? "https://" : "http://");
        var scriptUrl = scriptProtocol + scriptUrlWithoutProtocol;
        var scriptElement = $('script[src="' + scriptUrl + '"]');
        if (scriptElement.length > 0) {
            scriptElement.remove();
        }
        var bt = "text/java", z = document, fh = z.getElementsByTagName('head')[0], k = 'script';
        var y = z.createElement(k);
        y.async = true;
        y.type = bt + k;
        y.src = scriptUrl;
        fh.appendChild(y);
    }
};
