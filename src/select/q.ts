function q<S extends keyof HTMLElementTagNameMap>(
  selectors: S,
  root?: Element | null
): HTMLElementTagNameMap[S] | null;

function q<S extends keyof SVGElementTagNameMap>(
  selectors: S,
  root?: Element | null
): SVGElementTagNameMap[S] | null;

function q<E extends Element = Element>(
  selectors: string,
  root?: Element | null
): E | null;

function q<E extends Element = Element>(
  selectors: string,
  root?: Element | null
): E | null {
  return (!selectors || root===null) ? null : (root||document).querySelector(selectors);
}

export default q;
