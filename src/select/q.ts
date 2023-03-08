function q<S extends keyof HTMLElementTagNameMap>(
  selectors: S,
  root?: Element | null
): HTMLElementTagNameMap[S] | undefined;

function q<S extends keyof SVGElementTagNameMap>(
  selectors: S,
  root?: Element | null
): SVGElementTagNameMap[S] | undefined;

function q<E extends Element = Element>(
  selectors: string,
  root?: Element | null
): E | undefined;

function q<E extends Element = Element>(
  selectors: string,
  root?: Element | null
): E | undefined {
  return (
    (selectors && root !== null && (root || document).querySelector<E>(selectors)) ||
    undefined
  );
}

export default q;
