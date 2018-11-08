var matches = require('./matches.js');

//@flow

// TODO: Find a way to be more clever about the type annotation for the return value
function closestParent(selector/*:string*/, elm/*:Node*/, stopper/*::?:HTMLElement*/)/*:null|HTMLElement*/ {
    var _stopper = stopper || null;
    var candidateElm = elm instanceof Element ? elm : elm.parentElement;
    while ( candidateElm && !matches(selector, candidateElm) && candidateElm !== _stopper ) {
         candidateElm = candidateElm.parentElement;
    }
    return candidateElm !== _stopper && candidateElm instanceof HTMLElement ? candidateElm : null;
}

module.exports = closestParent;
