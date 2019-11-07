function qq<S extends keyof HTMLElementTagNameMap>(
	selectors: S,
	root?: Element | null
): Array<HTMLElementTagNameMap[S]>;

function qq<S extends keyof SVGElementTagNameMap>(
	selectors: S,
	root?: Element | null
): Array<SVGElementTagNameMap[S]>;

function qq<E extends Element = Element>(
	selectors: string,
	root?: Element | null
): Array<E>;

function qq<E extends Element = Element>(
	selectors: string,
	root?: Element | null
): Array<E> {
	return !selectors || root === null
		? []
		: [].slice.call((root || document).querySelectorAll(selectors));
}

export default qq;
