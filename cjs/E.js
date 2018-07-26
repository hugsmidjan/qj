'use strict';

// Hyperscript function that spits out DOM nodes.
function E(tagName, attrs, ...children) {
  const elm = document.createElement(tagName);
  if (attrs) {
    for (let name in attrs) {
      const value = attrs[name];
      if ( value != null ) {
        if ( name === 'style' ) {
          for (var cssProp in value) {
            elm.style[cssProp] = value[cssProp];
          }
        }
        else if ( name in elm ) {
          elm[name] = value;
        }
        else if ( (/^on[A-Z]/).test(name) ) {
          // onEventtype: fn => elm.addEventListener('eventtype', fn)
          elm.addEventListener(name.substr(2).toLowerCase(), value);
        }
        else if ( name.charAt(0) === '_' ) {
          // _propName: value => elm.propName = value;
          elm[name.substr(1)] = value;
        }
        else {
          // default to setAttribute()
          elm.setAttribute(name, value);
        }
      }
    }
  }
  const _appendChildren = (child) => {
    if ( child instanceof Array ) {
      child.forEach(_appendChildren);
    }
    else if ( child || child === 0 ) {
      if ( !(child instanceof Node) ) {
        child = document.createTextNode( child );
      }
      elm.appendChild( child );
    }
  };
  children.forEach(_appendChildren);

  return elm;
}

module.exports = E;
