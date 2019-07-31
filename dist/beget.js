// Prototypal inheritance
// export default function beget<O extends object, P>(proto: O, props?: P | null): P extends object ? O & P : O { // <-- Similar signature to Object.assign
function beget(proto, props) {
    return Object.assign(Object.create(proto), props);
}

module.exports = beget;
