/*
  Fast CSS support checker and vendor-prefix resolver
  Returns `false` for unsupported css properties.
  For supported css properties it returns an object with
  the properly vendor-prefixed property-name as both
  JavaScript propertyName and in CSS format.

  Examples of use:
  -------------------------------------

      cssSupport('not-supported-property');
  ==>
      false

      cssSupport('transform-origin');
  ==>
      {
        prop: 'WebkitTransformOrigin',
        css: '-webkit-transform-origin'
      }

      cssSupport('transform-origin');
  ==>
      {
        prop: 'WebkitTransformOrigin',
        css: '-webkit-transform-origin'
      }

*/
var cache = {};
var elmStyles;
var vendorsJs = ['Khtml', 'O', 'Ms', 'Moz', 'Webkit'];
var vendorsCss = ['-khtml-', '-o-', '-ms-', '-moz-', '-webkit-'];
function cssSupport(propname) {
    // lazy initalize elmStyle
    elmStyles = elmStyles || document.createElement('div').style;
    var prop = cache[propname];
    // If this is the first time we're asked about propname
    if (prop === undefined) {
        var cssProp = '';
        var jsProp = void 0;
        // Convert propname from CSS style `transform-origin`
        // into JavaScript-style `transformOrigin`
        var PropName = propname.replace(/-([a-z])/g, function (val, chr) { return chr.toUpperCase(); });
        if (PropName in elmStyles) {
            // Un-prefixed property is supported!
            jsProp = PropName;
            cssProp = propname;
        }
        else {
            // Capitalize PropName in preparation for vendor-prefixing
            // (i.e. from `transformOrigin` to `TransformOrigin`
            PropName = PropName.replace(/^[a-z]/, function (chr) { return chr.toUpperCase(); });
            var i = vendorsJs.length;
            while (i--) {
                var PrefixedProp = vendorsJs[i] + PropName;
                if (PrefixedProp in elmStyles) {
                    // Vendor-prefixed property is supported
                    jsProp = PrefixedProp;
                    cssProp = vendorsCss[i] + propname;
                    break;
                }
            }
        }
        // Build the property-name object.
        prop = jsProp ? { prop: jsProp, css: cssProp } : false;
        // Cache the results
        cache[propname] = prop;
    }
    return prop;
}

module.exports = cssSupport;
