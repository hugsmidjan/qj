import { Apply } from './object';

// Prototypal inheritance
// export default function beget<O extends object, P>(proto: O, props?: P | null): P extends object ? O & P : O { // <-- Similar signature to Object.assign
export default function beget<O extends object, P>(
	proto: O,
	props?: P | null
): Apply<O, P> {
	return Object.assign(Object.create(proto), props);
}
