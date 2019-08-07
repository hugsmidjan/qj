export default function inject<V = ((key: string) => string) | any>(template: string, vars: Array<V> | Record<string, V>): string;
