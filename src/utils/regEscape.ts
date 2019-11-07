export default function regEscape(s: string): string {
	return s.replace(/([\\^$*+[\]?{}.=!:(|)])/g, '\\$1');
}
