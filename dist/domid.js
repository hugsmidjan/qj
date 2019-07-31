var domid_prefix = '_' + /*@__PURE__*/ (Date.now() + '-').substr(6);
var domid_incr = 0;
function domid() {
    return domid_prefix + (domid_incr++);
}

module.exports = domid;
