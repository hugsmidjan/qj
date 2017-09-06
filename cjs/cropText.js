'use strict';

var _reCache = {};

function cropText(str, length, end) {
  end = end || ' ...';
  str = str.trim().replace(/\s+/g, ' ');
  if ( length  &&  str.length > length+end.length ) {
    var hash = length +'~~'+end;
    var re = _reCache[hash] || (_reCache[hash] = new RegExp('^(.{0,'+length+'})\\s.+$'));
    var newTxt = str.replace(re, '$1');
    return newTxt + (newTxt.length<str.length ? end : '');
  }
  return str;
}

module.exports = cropText;
