var matches = require('./matches.js');

function closestParent(selectors, elm, stopper) {
    stopper = stopper || null;
    var candidateElm = elm instanceof Element ? elm : elm.parentElement;
    while (candidateElm && !matches(selectors, candidateElm) && candidateElm !== stopper) {
        candidateElm = candidateElm.parentElement;
    }
    return candidateElm !== stopper ? candidateElm : null;
}

module.exports = closestParent;
