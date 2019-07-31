//@flow
function scrollToElm(_elm, opts) {
    if (opts === void 0) { opts = {}; }
    var offsetOpt = opts.offset;
    var offsetFn = typeof offsetOpt === 'function'
        ? offsetOpt
        : typeof offsetOpt === 'number'
            ? function () { return offsetOpt; }
            : function () { return 30; };
    return new Promise(function (resolve) {
        setTimeout(function () {
            if (opts.setFocus) {
                if (_elm.tabIndex < 0) {
                    _elm.setAttribute('tabindex', '-1');
                }
                _elm.focus();
            }
            var offset = offsetFn(_elm);
            var targetScrollPos = window.pageYOffset + _elm.getBoundingClientRect().top - offset;
            window.scrollTo(window.pageXOffset, targetScrollPos);
            resolve();
        }, opts.delay || 0);
    });
}

module.exports = scrollToElm;
