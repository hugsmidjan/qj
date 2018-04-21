import memoize from '../cjs/memoize';
import o from 'ospec';

o.spec('Memoize', () => {

    o('Remembers result of last input', () => {
        const foo = memoize((inp) => ({}) );
        const firstValue = foo('a');
        o( foo('a') ).equals(firstValue);
        const secondValue = foo('b');
        o( secondValue ).notEquals(firstValue);
        o( foo('b') ).equals(secondValue);
        o( foo('a') ).notEquals(firstValue);
        o( foo('b') ).notEquals(secondValue);
    });

});