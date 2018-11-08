//@flow
// Hyperscript function that spits out DOM nodes.
/*::
    type Attrs = {
        [attrName:string]: any,
        style?: { [prop:string]: any },
    }
    type Child =  Node | string | number | null | false
    type Children = Child | Child[]
*/
function E(tagName/*:string*/, attrs/*:Children[]*/)/*:HTMLElement*/ {
  var children = [], len = arguments.length - 2;
  while ( len-- > 0 ) children[ len ] = arguments[ len + 2 ];

  var elm = document.createElement(tagName);
  if (attrs) {
    for (var name in attrs) {
      var value = attrs[name];
      if ( value != null ) {
        if ( name === 'style' ) {
          for (var cssProp in attrs.style) {
            if (cssProp in elm.style) {
              //$FlowFixMe – flow wants cssProp
              elm.style[cssProp] = value[cssProp];
            }
          }
        }
        else if ( name in elm ) {
          //$FlowFixMe
          elm[name] = value;
        }
        else if ( (/^on[A-Z]/).test(name) ) {
          // onEventtype: fn => elm.addEventListener('eventtype', fn)
          elm.addEventListener(name.substr(2).toLowerCase(), value);
        }
        else if ( name.charAt(0) === '_' ) {
          // _propName: value => elm.propName = value;
          //$FlowFixMe
          elm[name.substr(1)] = value;
        }
        else {
          // default to setAttribute()
          elm.setAttribute(name, value);
        }
      }
    }
  }
  var _appendChildren = function (child) {
    if ( child instanceof Array ) {
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

module.exports = E;
