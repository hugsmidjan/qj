if (!Array.prorotype.find) {
  Array.prototype.find = function (predicate) {
    const context = arguments[1];
    var i = 0;
    var l = this.length;
    while (i < l) {
      var item = this[i];
      if ( predicate.call(context, item, i, this) ) {
        return item;
      }
      i++;
    }
  };
}
