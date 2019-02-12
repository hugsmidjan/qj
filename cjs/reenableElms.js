'use strict';

var qq = require('./qq.js');

// reenable selected HTML elements that were disbbled by htmlToDiv()
function reenableElms(elm, tagName) {
  var disabledTagName = tagName + '--disabled';
  var re = new RegExp('(<\\/?'+ tagName +')--disabled([ >])', 'gi');
  var enable = function (elm) {
    elm.outerHTML = elm.outerHTML.replace(re, '$1$2');
  };
  if ( elm.tagName.toLowerCase() === disabledTagName ) {
    enable(elm);
  }
  // Since none of the elements disabled by htmlToDiv() may be nested
  // we can assume this is an either or case.
  else {
    qq(disabledTagName, elm).forEach(enable);
  }
  return elm;
}

module.exports = reenableElms;