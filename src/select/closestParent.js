//@flow
import matches from './matches';

// TODO: Find a way to be more clever about the type annotation for the return value
export default function closestParent(selector/*:string*/, elm/*:Node*/, stopper/*::?:Element*/)/*:null|Element*/ {
    let _stopper = stopper || null;
    let candidateElm = elm instanceof Element ? elm : elm.parentElement;
    while ( candidateElm && !matches(selector, candidateElm) && candidateElm !== _stopper ) {
         candidateElm = candidateElm.parentElement;
    }
    return candidateElm !== _stopper && candidateElm instanceof Element ? candidateElm : null;
}
