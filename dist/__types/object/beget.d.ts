import { Apply } from "./object";
export default function beget<O extends object, P>(proto: O, props?: P | null): Apply<O, P>;
