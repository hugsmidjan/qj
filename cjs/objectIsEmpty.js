'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

function objectIsEmpty(object) {
    for (var key in object) {
        if ( hasOwnProperty.call(object, key) ) {
            return false;
        }
    }
    return true;
}

module.exports = objectIsEmpty;
