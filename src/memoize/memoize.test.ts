import o from 'ospec';
import memoize from './memoize';

o.spec('Memoize', () => {

    o('Remembers result of last input', () => {
        const wrapValue = memoize((value) => ({ value }) );
        const firstObject = wrapValue('a');
        o( wrapValue('a') ).equals(firstObject);
        const secondObject = wrapValue('b');
        o( secondObject ).notEquals(firstObject);
        o( wrapValue('b') ).equals(secondObject);
        o( wrapValue('a') ).notEquals(firstObject);
        const thirdObject = wrapValue('b');
        o( thirdObject ).notEquals(secondObject);
        o( wrapValue('b') ).equals(thirdObject);
    });

    o('Only does shallow equals', () => {
        const getValue = memoize((obj) => obj.value);
        const obj = { value: 1 };
        o( getValue(obj) ).equals(1);
        obj.value = 2;
        o( getValue(obj) ).equals(1);
        delete obj.value;
        o( getValue(obj) ).equals(1);
        o( getValue({ value: 3 }) ).equals(3);
    });

    o('Memoizes 0 arguments', () => {
        const _getRandom = o.spy(() => Math.random());
        const getRandom = memoize(_getRandom);
        const random = getRandom();
        o( getRandom() ).equals(random);
        o( _getRandom.callCount ).equals(1);
        // Extra params are ignored
        const callCountBefore = _getRandom.callCount;
        // @ts-ignore  (Parameter not allowed)
        o( getRandom(2) ).equals(random);
        o( getRandom() ).equals(random);
        o( _getRandom.callCount ).equals(callCountBefore);
    });

    o('Memoizes 2 arguments', () =>  {
        const _decimalize = o.spy((a:number, b:number) => a*10 + b);
        const decimalize = memoize(_decimalize);
        decimalize(1, 2);
        o( decimalize(1, 2) ).equals(12);
        o( _decimalize.callCount ).equals(1);
        o( decimalize(2, 1) ).equals(21);
    });

    o('Memoizes 3 arguments', () => {
        const _decimalize = o.spy((a:number, b:number, c:number) => a*100 + b*10 + c);
        const decimalize = memoize(_decimalize);
        decimalize(1, 2, 3);
        o( decimalize(1, 2, 3) ).equals(123);
        o( _decimalize.callCount ).equals(1);
        o( decimalize(3, 2, 1) ).equals(321);
        // Extra params are ignored
        const callCountBefore = _decimalize.callCount;
        // @ts-ignore  (4th parameter not allowed)
        decimalize(3, 2, 1, 0);
        decimalize(3, 2, 1);
        o( _decimalize.callCount ).equals(callCountBefore);
        // missing params are not
        // @ts-ignore  (3rd parameter missing)
        o( isNaN( decimalize(3, 2) ) ).equals(true);
    });

    o('Memoizes 5 arguments', () => {
        const _decimalize = o.spy((a:number, b:number, c:number, d:number, e:number) => a*10000 + b*1000 + c*100 + d*10 + e);
        const decimalize = memoize(_decimalize);
        decimalize(1, 2, 3, 4, 5);
        o( decimalize(1, 2, 3, 4, 5) ).equals(12345);
        o( _decimalize.callCount ).equals(1);
        o( decimalize(5, 4, 3, 2, 1) ).equals(54321);
    });

    o('Memoizes (...arg) functions with multiArg param', () => {
        const _decimalize = o.spy((...args: Array<number>) => args.reverse().reduce((acc,arg,i) => acc+arg*Math.pow(10,i), 0));
        const decimalize = memoize(_decimalize, true);
        decimalize(1, 2, 3);
        o( decimalize(1, 2, 3) ).equals(123);
        o( _decimalize.callCount ).equals(1);
        o( decimalize(3, 2, 1) ).equals(321);
    });

    o('Memoizes (n, ...arg) functions with multiArg', () => {
        const _decimalize = o.spy((n: number, ...args: Array<number>) => n*Math.pow(10,args.length) + args.reverse().reduce((acc,arg,i) => acc+arg*Math.pow(10,i), 0));
        const decimalize = memoize(_decimalize, true);
        decimalize(1, 2, 3);
        o( decimalize(1, 2, 3) ).equals(123);
        o( _decimalize.callCount ).equals(1);
        o( decimalize(3, 2, 1) ).equals(321);

        // Extra params are NOT ignored
        const callCountBefore = _decimalize.callCount;
        o( decimalize(3, 2, 1, 0) ).equals(3210);
        o( decimalize(3, 2, 1) ).equals(321);
        o( _decimalize.callCount ).equals(callCountBefore+2);
        // So are missing params
        o( decimalize(3, 2) ).equals(32);
        o( _decimalize.callCount ).equals(callCountBefore+3);
    });

});
