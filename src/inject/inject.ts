// Simple String templating (variable injection) that accepts either arrays or hash-maps.
// Usage:
// var output = inject('Hello %{1}! Hava a %{0}', ['banana', 'John']);                           // Returns  'Hello John! Have a banana'
// var output = inject('Hello %{name}! Hava a %{food}', { food : 'banana', person : 'John' });   // Returns  'Hello John! Have a banana'
//
const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function inject<V =((key: string) => string) | any>(
  template: string,
  vars: Array<V> | Record<string, V>
): string {
  return template.replace(/%\{([^%{}}]+?)\}/g, (m, key) => {
    if (!hasOwnProperty.call(vars, key)) {
      return m;
    }
    // @ts-ignore  (Bah)
    const value = vars[key];
    if (typeof value === 'function') {
      return value(key);
    }
    return value;
  });
}
