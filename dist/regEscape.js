function regEscape(s) {
  return s.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1');
}

module.exports = regEscape;
