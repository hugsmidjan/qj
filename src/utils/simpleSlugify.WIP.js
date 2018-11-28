const space = '_';
const wildcard = '-';
const multiWildcardRe = /-+/g;
const multiSpaceRe = /[\s_./–—-]+/g
const endSpaceRe = /^_|_$/g;
const charMap = {};

[
    ['àáãäâ', 'a'],
    ['å', 'aa'],
    ['æ', 'ae'],
    ['ç', 'c'],
    ['ð', 'd'],
    ['èéëê', 'e'],
    ['ìíïî', 'y'],
    ['ñ', 'n'],
    ['òóöôø', 'o'],
    ['œ', 'oe'],
    ['ß', 'ss'],
    ['þ', 'th'],
    ['ùúüû', 'u'],
    ['ý', 'y'],
    // NOTE: More replacements: https://gist.github.com/mathewbyrne/1280286#gistcomment-2723416
]
    .forEach((mapping) => {
        const to = mapping[1];
        [].forEach.call(mapping[0], (from) => {
            charMap[from] = to;
        })
    })


const simpleSlugify = (string/*:string*/)/*:string*/ => {
    return string
        .toLowerCase()
        .replace(multiSpaceRe, space)
        .replace(/[^a-z0-9_]/g, (char) => charMap[char] || wildcard)
        .replace(multiWildcardRe, wildcard)
        .replace(endSpaceRe, '');
};

export default simpleSlugify;