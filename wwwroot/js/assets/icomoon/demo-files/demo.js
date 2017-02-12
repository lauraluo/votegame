(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

if (!('boxShadow' in document.body.style)) {
    document.body.setAttribute('class', 'noBoxShadow');
}

document.body.addEventListener("click", function (e) {
    var target = e.target;
    if (target.tagName === "INPUT" && target.getAttribute('class').indexOf('liga') === -1) {
        target.select();
    }
});

(function () {
    var fontSize = document.getElementById('fontSize'),
        testDrive = document.getElementById('testDrive'),
        testText = document.getElementById('testText');
    function updateTest() {
        testDrive.innerHTML = testText.value || String.fromCharCode(160);
        if (window.icomoonLiga) {
            window.icomoonLiga(testDrive);
        }
    }
    function updateSize() {
        testDrive.style.fontSize = fontSize.value + 'px';
    }
    fontSize.addEventListener('change', updateSize, false);
    testText.addEventListener('input', updateTest, false);
    testText.addEventListener('change', updateTest, false);
    updateSize();
})();

},{}]},{},[1])