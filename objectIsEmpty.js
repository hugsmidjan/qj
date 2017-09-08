const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function objectIsEmpty(object) {
    for (var key in object) {
        if ( hasOwnProperty.call(object, key) ) {
            return false;
        }
    }
    return true;
}
