// Hyperscript function that spits out DOM nodes.
type Attrs = {
    [attrName:string]: any,
    style?: CSSStyleDeclaration,
}
type Child =  Node | string | number | null | undefined | false
type ChildOrChildren = Child | Array<Child> | NodeList


export default function E<T extends keyof HTMLElementTagNameMap>(tagName: T, attrs?: Attrs | null, ...children: Array<ChildOrChildren>): HTMLElementTagNameMap[T] {
  const elm = document.createElement(tagName);
  if (attrs) {
    for (let name in attrs) {
      const value = attrs[name];
      if ( value != null ) {
        if ( name === 'style' ) {
          for (let cssProp in value) {
            if (cssProp in elm.style) {
              // @ts-ignore
              elm.style[cssProp] = value[cssProp];
            }
          }
        }
        else if ( name in elm ) {
          // Note: This includes lowercased `onevent` attrs
          // @ts-ignore
          elm[name] = value;
        }
        else if ( (/^on[A-Z]/).test(name) ) {
          // Camel-cased onEvent attrs
          elm.addEventListener(name.substr(2).toLowerCase(), value);
        }
        else if ( name.charAt(0) === '_' ) {
          // Prefixing ambigious prop/attr names with an underscore
          // signals they should be treated as properties
          // @ts-ignore
          elm[name.substr(1)] = value;
        }
        else {
          // Default to setAttribute()
          elm.setAttribute(name, value);
        }
      }
    }
  }
  const _appendChildren = (child: ChildOrChildren) => {
    if ( child instanceof Array || child instanceof NodeList ) {
      child.forEach(_appendChildren);
    }
    else if ( child || child === 0 ) {
      if ( !(child instanceof Node) ) {
        child = document.createTextNode( typeof child === 'string' ? child : String(child) );
      }
      elm.appendChild( child );
    }
  };
  children.forEach(_appendChildren);

  return elm;
}