const _reCache: Record<string, RegExp> = {};

export default function cropText(str: string, length: number, end?: string): string {
	end = end || ' ...';
	str = str.trim().replace(/\s+/g, ' ');
	if (length && str.length > length + end.length) {
		const hash = length + '~~' + end;
		const re =
			_reCache[hash] || (_reCache[hash] = new RegExp('^(.{0,' + length + '})\\s.+$'));
		const newTxt = str.replace(re, '$1');
		return newTxt + (newTxt.length < str.length ? end : '');
	}
	return str;
}
