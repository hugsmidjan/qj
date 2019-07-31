export default function trigger(type: string, elm: Element): void {
  const e = new Event(type);
  elm.dispatchEvent( e );
}
