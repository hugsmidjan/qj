type AnyFn = (...args: any) => any;
type CB = () => void;

type Describer = (description: string) => void;

type Runner = (done?: CB, timeout?: CB) => void | Promise<void>;

type Results = Array<
  | {
      pass: true | null;
    }
  | {
      pass: false;
      error: Error;
      testError: Error;
      message: string;
      context: string;
    }
>;

type Reporter = (results: Results) => number;

declare module 'ospec' {
  function o<T>(
    actual: T
  ): {
    equals(expected: T): Describer;
    notEquals(expected: any): Describer;
    deepEquals(expected: T): Describer;
    notDeepEquals(expected: any): Describer;
    throws(error: string | NewableFunction): Describer;
    notThrows(error: string | NewableFunction): Describer;
  };

  function o(name: string, tests: Runner): void;

  namespace o {
    // same as o(tests, tests) signature above
    export function only(name: string, tests: Runner): void;

    export function before(setup: Runner): void;
    export function after(teardown: Runner): void;
    export function beforeEach(setup: Runner): void;
    export function afterEach(teardown: Runner): void;

    export function spec(name: string, testSuites: () => void): void;

    export function spy<F extends AnyFn, A = Parameters<F>>(
      fn: F
    ): F & {
      callCount: number;
      args: A;
      calls: Array<A>;
    };

    export function specTimeout(ms: number): void;
    export function timeout(ms: number): void;

    export function run(reporter: Reporter): void;

    export const report: Reporter;
  }

  o.new = (name?: string) => o;


  export default o;
}
