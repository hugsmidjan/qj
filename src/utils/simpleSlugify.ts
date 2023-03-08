const punctuationRe = /[:;',!¡¿?]/g;
const spaceRe = /[\s_./…–—-]+/g;
const replaceRe = /[+&]+/g;
const endSpaceRe = /^_|_$/g;

const charMap: Record<string, string> = {};
[
  ['àáãäâ', 'a'],
  ['å', 'aa'],
  ['æ', 'ae'],
  ['çćĉč', 'c'],
  ['ðď', 'd'],
  ['èéëê', 'e'],
  ['ìíïî', 'y'],
  ['ł', 'l'],
  ['ñ', 'n'],
  ['òóöôø', 'o'],
  ['œ', 'oe'],
  ['ß', 'ss'],
  ['śŝşš', 's'],
  ['þ', 'th'],
  ['ùúüû', 'u'],
  ['ýŷÿ', 'y'],
  ['źżž', 'z'],
  // NOTE: More replacements: https://gist.github.com/mathewbyrne/1280286#gistcomment-2723416
].forEach((mapping) => {
  const to = mapping[1];
  [].forEach.call(mapping[0], (from: string) => {
    charMap[from] = to;
  });
});

const simpleSlugify = (string: string): string =>
  string
    .toLowerCase()
    .replace(punctuationRe, '')
    .replace(spaceRe, '_')
    .replace(/[^a-z0-9_]/g, (char) => charMap[char] || char)
    .replace(replaceRe, '-')
    .replace(endSpaceRe, '');

export default simpleSlugify;
