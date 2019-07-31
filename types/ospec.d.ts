type AnyFn = (...args: any) => any

declare module 'ospec' {
  function o<T>(
    actual: T
  ): {
    equals(expected: T): void;
    notEquals(expected: any): void;
  };

  function o(name: string, fn: () => void): void;

  namespace o {
    export function spec(name: string, fn: () => void): void;

    export function spy<F extends AnyFn>(
      fn: F
    ): F & { callCount: number };
  }

  export default o;
}
