export default function trigger(type, elm) {
  const e = new Event(type);
  elm.dispatchEvent( e );
}
