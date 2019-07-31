import regEscape from '../utils/regEscape';

// Simple String templating (variable injection) that accepts either arrays or hash-maps.
// Usage:
// var output = inject('Hello %{1}! Hava a %{0}', ['banana', 'John']);                           // Returns  'Hello John! Have a banana'
// var output = inject('Hello %{name}! Hava a %{food}', { food : 'banana', person : 'John' });   // Returns  'Hello John! Have a banana'
//
const _injectRegExpCache: Record<string, RegExp> = {}; // used by $.inject(); to store regexp objects.

const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function inject(
  template: string,
  _vars: Array<any> | Record<string, any>
): string {
  return template.replace(/%\{([^%{}}]+?)\}/, (m, key) => {
    if (!hasOwnProperty.call(_vars, key)) {
      return m;
    }
    // @ts-ignore  (Bah)
    const value = _vars[key];
    if (typeof value === 'function') {
      return value(key)
    }
    return value;
  });
}
