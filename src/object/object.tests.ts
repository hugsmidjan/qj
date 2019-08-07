import o from 'ospec';
import { objectClean } from './object';

o.spec('objectClean', () => {
  interface T1 {
    a: string;
    a2: number | null;
    b: number | undefined;
    b2: number | undefined | null;
    c?: string | null;
    c2?: number;
    d?: string | undefined;
  }
  type AssertSame<A, B, Ar = Required<A>, Br = Required<B>> = Ar extends Br ?( Br extends Ar ? true : never) : never;
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const foo1 = objectClean({} as T1, true);
  const foo1b: AssertSame<{
    a: string;
    a2?: number | null;
    b?: number;
    b2?: number | null;
    c?: string | null;
    c2?: number;
    d?: string;
  }, typeof foo1> = true;

  const foo2 = objectClean({} as T1);
  const foo2b: AssertSame<{
    a: string;
    a2: number | null;
    b?: number;
    b2?: number | null;
    c?: string | null;
    c2?: number;
    d?: string;
  }, typeof foo2> = true;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  o('Removes undefineds', () => {
    const obj = { a: 1, b: undefined, c: null };
    const cleaned = objectClean(obj);
    o('b' in cleaned).equals(false);
    o(cleaned.c).equals(null);
    o(Object.keys(cleaned).length).equals(2);
  });

  o('Optionally removes nulls also', () => {
    const obj = { a: 1, b: undefined, c: null };
    const cleaned = objectClean(obj, true);
    o(cleaned.a).equals(1);
    o('b' in cleaned).equals(false);
    o('c' in cleaned).equals(false);
    o(Object.keys(cleaned).length).equals(1);
  });

  o('Does not mutate the original', () => {
    const obj = { a: 1, b: undefined };
    const cleaned = objectClean(obj);
    o(cleaned).notEquals(obj);
    o(obj.a).equals(1);
    o(obj.b).equals(undefined);
    o(Object.keys(obj).length).equals(2);
  });

  o('Returns the original if no change', () => {
    const obj = { a: 1, b: null };
    const cleaned = objectClean(obj);
    o(cleaned).equals(obj);
    o(Object.keys(cleaned).length).equals(2);
  });
});
