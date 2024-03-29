import o from 'ospec';

import slugify from './simpleSlugify';

o.spec('simpleSlugify', () => {
  o('Leaves pure ASCII alphanumerical strings alone', () => {
    o(slugify('Hello')).equals('hello');
    o(slugify('FooBar2000')).equals('foobar2000');
  });

  o('Leaves @ symbols alone', () => {
    o(slugify('email@address.com')).equals('email@address_com');
  });

  o('Turns whitespace, periods, dashes and such into "_"', () => {
    o(slugify('Hello World')).equals('hello_world');
    o(slugify('Hello\tTab')).equals('hello_tab');
    o(slugify('Hello\nNewline')).equals('hello_newline');
    o(slugify('Hello Nbsp')).equals('hello_nbsp');
    o(slugify('Spaced Dash–Period.')).equals('spaced_dash_period');
    o(slugify('En–dash')).equals('en_dash');
    o(slugify('Em—dash')).equals('em_dash');
    o(slugify('Photo.jpg')).equals('photo_jpg');
    o(slugify('Dot dot dot...')).equals('dot_dot_dot');
    o(slugify('Slash/slash')).equals('slash_slash');
    o(slugify('Ellipsis…is space')).equals('ellipsis_is_space');
  });

  o('Removes punctuation, other than period', () => {
    o(slugify('Semi;colon')).equals('semicolon');
    o(slugify('Normal:colon')).equals('normalcolon');
    o(slugify("What's up?")).equals('whats_up');
    o(slugify('Exclaim!')).equals('exclaim');
    o(slugify('Hello, comma')).equals('hello_comma');
    o(slugify('¡Hola!')).equals('hola');
    o(slugify('¿Que?')).equals('que');
    o(slugify('http://foo.bar')).equals('http_foo_bar');
  });

  o('Turns plus and ampersand into dash', () => {
    o(slugify("Ben & Tom & Jerry's")).equals('ben_-_tom_-_jerrys');
    o(slugify('One + one')).equals('one_-_one');
  });

  o('Trims and collapses multiple white spaces', () => {
    o(slugify(' Hello')).equals('hello');
    o(slugify('Hello ')).equals('hello');
    o(slugify('/path/')).equals('path');
    o(slugify('\tHello   Tab')).equals('hello_tab');
    o(slugify("\n– Hi — –- there!\tWhat's up ?  ")).equals('hi_there_whats_up');
  });

  o('ASCII-fies latin accented characters', () => {
    o(slugify('Halló þú ert Æðibiti')).equals('hallo_thu_ert_aedibiti');
    o(slugify('Déjà vu garçon')).equals('deja_vu_garcon');
    o(slugify('Øl på Señor')).equals('ol_paa_senor');
    o(slugify('Schloß Ümläuts')).equals('schloss_umlauts');
  });

  o('Leaves unknown Unicode symbols as is, but lower-cased', () => {
    o(slugify('Hello ...err... Путин')).equals('hello_err_путин');
    o(slugify('گرگ!!')).equals('گرگ');
  });
});
