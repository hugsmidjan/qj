'use strict';

// List-to-Array converter
function A/*::<T>*/(list/*:$Supertype<T[]> */)/*:T[] */ {
  return [].slice.call(list);
}

function htmlToDiv(html, opts) {
  const div = document.createElement('div');
  div.innerHTML = String(html)
      .replace(/<\!DOCTYPE[^>]*>/i, '')
      .replace(/(<\/?(img|script|html|head|body|title|meta|style|link))/gi, (m,p1,p2) => {
        return p1 + (opts && !opts['keep'+p2.toLowerCase()] ? '' : '--disabled');
      });
  return div;
}

function htmlToNodes(html, opts) {
  return A( htmlToDiv(html, opts).childNodes );
}

module.exports = htmlToNodes;
