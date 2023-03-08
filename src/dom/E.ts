// Fix TypeScript's weird/borked DOM typing
declare global {
  interface Window {
    NodeList: typeof NodeList;
    Node: typeof Node;
  }
}

type HTMLProp = 'id'; // to silence TypeScript
type CSSStyleProp = 'all'; // to silence TypeScript

type Attrs = {
  [attrName: string]: unknown;
  style?: CSSStyleDeclaration;
};
type Child = Node | string | number | null | undefined | false;
type ChildOrChildren = Child | Array<Child> | NodeList;

type HyperScriptDOM = {
  <T extends keyof HTMLElementTagNameMap>(
    tagName: T,
    attrs?: Attrs | null,
    ...children: Array<ChildOrChildren>
  ): HTMLElementTagNameMap[T];
  make: EMaker;
};

type Windoid = Pick<Window, 'document' | 'Node' | 'NodeList'>;

declare type EMaker = (window: Windoid) => HyperScriptDOM;

// ---------------------------------------------------------------------------

const makeE: EMaker = (window) => {
  const { document, Node, NodeList } = window;
  const E: HyperScriptDOM = (tagName, attrs, ...children) => {
    const elm = document.createElement(tagName);
    if (attrs) {
      for (const name in attrs) {
        const value = attrs[name];
        if (value != null) {
          if (name === 'style') {
            const styleObj = value as CSSStyleDeclaration;
            for (const cssProp in styleObj) {
              if (cssProp in elm.style) {
                elm.style[cssProp as CSSStyleProp] = styleObj[cssProp];
              }
            }
          } else if (name in elm) {
            // Note: This includes lowercased `onevent` attrs
            elm[name as HTMLProp] = value as string;
          } else if (/^on[A-Z]/.test(name)) {
            // Camel-cased onEvent attrs
            elm.addEventListener(name.substr(2).toLowerCase(), value as () => void);
          } else if (name.charAt(0) === '_') {
            // Prefixing ambigious prop/attr names with an underscore
            // signals they should be treated as properties
            elm[name.substr(1) as HTMLProp] = value as string;
          } else {
            // Default to setAttribute()
            elm.setAttribute(name, value as string);
          }
        }
      }
    }
    const _appendChildren = (child: ChildOrChildren) => {
      if (child instanceof Array || child instanceof NodeList) {
        child.forEach(_appendChildren);
      } else if (child || child === 0) {
        if (!(child instanceof Node)) {
          child = document.createTextNode(
            typeof child === 'string' ? child : String(child)
          );
        }
        elm.appendChild(child);
      }
    };
    children.forEach(_appendChildren);

    return elm;
  };
  E.make = makeE;
  return E;
};

let _E: HyperScriptDOM;

/** Hyperscript (JSX friendly) function that spits out DOM nodes. */
const E =
  typeof window !== 'undefined'
    ? makeE(window)
    : (function () {
        if (!_E) {
          _E = makeE(typeof window !== 'undefined' ? window : ({} as Window));
        }
        // eslint-disable-next-line prefer-spread, prefer-rest-params
        return _E.apply(null, arguments);
      } as unknown as HyperScriptDOM);

E.make = E.make || makeE;

export default E;
