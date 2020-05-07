import matches from './matches';

function closestParent<S extends keyof HTMLElementTagNameMap>(
	selectors: S,
	elm: Node,
	stopper?: Element | null
): HTMLElementTagNameMap[S] | undefined;

function closestParent<S extends keyof SVGElementTagNameMap>(
	selectors: S,
	elm: Node,
	stopper?: Element | null
): SVGElementTagNameMap[S] | undefined;

function closestParent<E extends Element>(
	selectors: string,
	elm: Node,
	stopper?: Element | null
): E | undefined;

function closestParent(
	selectors: string,
	elm: Node,
	stopper?: Element | null
): Element | undefined {
	stopper = stopper || null;
	let candidateElm = elm instanceof Element ? elm : elm.parentElement;
	while (candidateElm && !matches(selectors, candidateElm) && candidateElm !== stopper) {
		candidateElm = candidateElm.parentElement;
	}
	return (candidateElm !== stopper && candidateElm) || undefined;
}

export default closestParent;
