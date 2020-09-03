import o from 'ospec';
import { prettyNum } from './prettyNum';

o.spec('prettyNum()', () => {
	o('Prettify numbers', () => {
		o(prettyNum()).equals('0');
		o(prettyNum(NaN)).equals('0');
		o(prettyNum('bob')).equals('0');
		o(prettyNum(42)).equals('42');
		o(prettyNum('42')).equals('42');
		o(prettyNum(123456789)).equals('123.456.789');
		o(prettyNum(123456.789, 2, '.', ',')).equals('123.456,79');
		o(prettyNum(1234.56789, 3, ',', '.')).equals('1,234.568');
		o(prettyNum(123456.789, 2, '', ',')).equals('123456,79');
		o(prettyNum(123456.789, 2, '', '')).equals('12345679');
	});
});
