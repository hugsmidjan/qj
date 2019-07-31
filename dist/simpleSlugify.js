var punctuationRe = /[:;',!¡¿?]/g;
var spaceRe = /[\s_./…–—-]+/g;
var replaceRe = /[+&]+/g;
var endSpaceRe = /^_|_$/g;
var charMap = {};
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
]
    .forEach(function (mapping) {
    var to = mapping[1];
    [].forEach.call(mapping[0], function (from) {
        charMap[from] = to;
    });
});
var simpleSlugify = function (string) { return string
    .toLowerCase()
    .replace(punctuationRe, '')
    .replace(spaceRe, '_')
    .replace(/[^a-z0-9_]/g, function (char) { return charMap[char] || char; })
    .replace(replaceRe, '-')
    .replace(endSpaceRe, ''); };

module.exports = simpleSlugify;
