import o from 'ospec';
import slugify from './simpleSlugify.WIP';

o.spec('Slugify', () => {

    o('Leaves pure ASCII alphanumerical strings alone', () => {
        o( slugify('Hello') ).equals( 'hello' );
        o( slugify('FooBar2000') ).equals( 'fooobar2000' );
    });

    o('Leaves @ symbols alone', () => {
        o( slugify('email@address.com') ).equals( 'email@address_com' );
    });

    o('Turns whitespace, periods, dashes and such into "_"', () => {
        o( slugify('Hello World') ).equals( 'hello_world' );
        o( slugify('Hello\tTab') ).equals( 'hello_tab' );
        o( slugify('Hello\nNewline') ).equals( 'hello_newline' );
        o( slugify('Hello Nbsp') ).equals( 'hello_nbsp' );
        o( slugify('Hello, comma') ).equals( 'hello_comma' );
        o( slugify('Spaced Dash–Period.') ).equals( 'spaced_dash_period' );
        o( slugify('En–dash') ).equals( 'en_dash' );
        o( slugify('Em—dash') ).equals( 'em_dash' );
        o( slugify('Photo.jpg') ).equals( 'photo_jpg' );
        o( slugify('Dot dot dot...') ).equals( 'dot_dot_dot' );
        o( slugify('Slash/slash') ).equals( 'slash_slash' );
        o( slugify('Ellipsis…is space') ).equals( 'ellipsis_is_space' );
    });

    o('Removes punctuation, other than period', () => {
        o( slugify('Semi;colon') ).equals( 'semicolon' );
        o( slugify('Normal:colon') ).equals( 'normalcolon' );
        o( slugify('What\'s up?') ).equals( 'whats_up' );
        o( slugify('Exclaim!') ).equals( 'exclaim' );
        o( slugify('¡Hola!') ).equals( 'hola' );
        o( slugify('¿Que?') ).equals( 'que' );
        o( slugify('http://foo.bar') ).equals( 'http_foo_bar' );
    });

    o('Trims and collapses multipile white spaces', () => {
        o( slugify(' Hello') ).equals( 'hello' );
        o( slugify('Hello ') ).equals( 'hello' );
        o( slugify('/path/') ).equals( 'path' );
        o( slugify('\tHello   Tab') ).equals( 'hello_tab' );
        o( slugify('\n– Hi — –- there!\tWhat\'s up ?  ') ).equals( 'hi_there_whats_up' );
    });

    o('Leaves unknown Unicode symbols as is', () => {
        o( slugify('Hello ...er... Путин') ).equals( 'hello_er_Путин' );
        o( slugify('گرگ!') ).equals( 'گرگ' );
    });

});