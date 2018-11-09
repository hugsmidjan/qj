function zapElm(elm) {
  var parent = elm && elm.parentNode;
  if ( parent ) {
    while ( elm.firstChild ) {
      parent.insertBefore(elm.firstChild, elm);
    }
    parent.removeChild(elm);
  }
}

module.exports = zapElm;
