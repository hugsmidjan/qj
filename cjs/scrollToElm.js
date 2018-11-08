'use strict';

//@flow

// ScrollTo top of _elm

/*::
    type ScrollToElmOptions<Elm> = {
        offset?: number | (elm:?Elm)=>number,
        setFocus?: boolean,
        delay: number,
    // TODO: Add basic animation support
        // speed?: number, // ms for each 100vh - capped at 200vh
        // easing?: EasingFn,
    }
*/
function /*::<Elm:HTMLElement>*/scrollToElm(_elm/*:Elm*/, opts/*:?ScrollToElmOptions<Elm>*/)/*:Promise*/ {
    opts = opts || {};
    let offsetFn = opts.offset;
    if (!offsetFn || !offsetFn.apply) {
        offsetFn = typeof opts.offset === 'number' ?
            () => opts.offset:
            () => 30;
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            if (opts.setFocus) {
                if ( _elm.tabIndex < 0 ) {
                    _elm.setAttribute('tabindex', -1);
                }
                _elm.focus();
            }
            const offset = offsetFn(_elm);
            const targetScrollPos = window.pageYOffset + _elm.getBoundingClientRect().top - offset;
            window.scrollTo(window.pageXOffset, targetScrollPos);
            resolve();
        }, opts.delay || 0);
    });
}

module.exports = scrollToElm;
