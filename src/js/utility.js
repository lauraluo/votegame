var utilityJS;

(function () {

    var that = {};

    that.getDocumentHeight = function () {
        var body = document.body,
            html = document.documentElement;

        return Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
    }

    that.supportBrowserProperty = function () {
        return typeof (window) !== 'undefined';
    }

    that.supportsTransitions = function () {
        var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition';

        if (typeof s[p] == 'string') { return true; }

        // Tests for vendor specific prop
        var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
        p = p.charAt(0).toUpperCase() + p.substr(1);

        for (var i = 0; i < v.length; i++) {
            if (typeof s[v[i] + p] == 'string') { return true; }
        }

        return false;
    }

    that.supportTouch = function () {
        return 'ontouchstart' in document.documentElement;
    }

    that.getDropEvents = function () {

        var isSupportTouch = that.supportTouch();

        return new {
            start: isSupportTouch ? 'touchstart' : 'mousedown',
            end: isSupportTouch ? 'touchend' : 'mouseup',
            move: isSupportTouch ? 'touchmove' : 'mousemove'
        };
    }

    that.isMobile = function () {
        return (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    }

    that.isAppleDevice = function () {
        return (/iphone|ipad/gi).test(navigator.appVersion);
    };

    that.isIPhone = function () {
        return (/iphone/gi).test(navigator.appVersion);
    }

    that.isIPad = function () {
        return (/ipad/gi).test(navigator.appVersion);
    }

    that.iOSversion = function () {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        }
    }

    that.cancelBubble = function (event) {
        if (event.preventDefault) { event.preventDefault(); }

        event.cancelBubble = true;
        if (event.stopPropagation) { event.stopPropagation(); }
    }

    // set cookie
    that.cookie = function (name, value, options) {

        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }

            var path = options.path ? ';path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else {
            var cookieValue = null;
            if (document.cookie && document.cookie != '' && document.cookie.indexOf(name) > -1) {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };

    that.testLocalstorage = function (value) {
        try {
            localStorage.setItem(value, value);
            localStorage.removeItem(value);
            return true;
        } catch (e) {
            return false;
        }
    };

    that.numberToCurrency = function (num) {
        num = num.toString();
        var currencyString = num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        return currencyString;
    }

    that.parseQueryString = function (queryString) {
        
        var index = queryString.indexOf('?');
        var params = {}, quires, temp;

        queryString = queryString.substr(index);
        queries = queryString.replace(/\?/, '').split(/\&/);

        for (var i = 0; i < queries.length ; i++) {

            temp = queries[i].split(/\=/);

            params[temp[0]] = temp[1];

        }

        return params;

    }

    that.extend = function (target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function (source) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        });
        return target;
    }


    that.isNumber = function(input) {
        return (typeof (input) === 'number')
            ? true
            : (input - 0) == input && input.length > 0;
    }

    that.tryParseInt = function(input) {
        return (that.isNumber(input))
            ? parseInt(input)
            : null;
    }

    that.shallowEqual = function(objA, objB) {
        if (objA === objB) {
            return true;
        }
        var key;
        // Test for A's keys different from B.
        for (key in objA) {
            if (objA.hasOwnProperty(key) &&
                (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
                return false;
            }
        }
        // Test for B's keys missing from A.
        for (key in objB) {
            if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    
    utilityJS = that;

})();

if (!String.format) {
    (function () {

        String.format = function () {
            var args = arguments;
            return args[0].replace(/\{(\d+)\}/g, function (m, i) { return args[parseInt(i) + 1]; });
        };

    }());
}

(function () {

    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    if (!Date.prototype.toISOString) {
        Date.prototype.toISOString = function () {
            return this.getUTCFullYear() +
              '-' + pad(this.getUTCMonth() + 1) +
              '-' + pad(this.getUTCDate()) +
              'T' + pad(this.getUTCHours()) +
              ':' + pad(this.getUTCMinutes()) +
              ':' + pad(this.getUTCSeconds()) +
              '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
              'Z';
        };
    }

    if (!Date.prototype.format) {
        // YYYY-MM-DD hh:mm:ss format
        Date.prototype.format = function (formatString) {
            return formatString.replace(/sss/g, (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5))
                .replace(/YYYY|yyyy/g, this.getFullYear())
                .replace(/MM/g, pad(this.getMonth() + 1))
                .replace(/DD|dd/g, pad(this.getDate()))
                .replace(/hh/g, pad(this.getHours()))
                .replace(/mm/g, pad(this.getMinutes()))
                .replace(/ss/g, pad(this.getSeconds()));

        };
    }

}());
