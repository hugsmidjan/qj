const space = '_';
const wildcard = '-';
const multiWildcardRe = /-+/g;
const multiSpaceRe = /[\s_./–—-]+/g
const endSpaceRe = /^_|_$/g;
let charMap;

const buildCharMap = () => {
    const inn = 'åàáãäâèéëêìíïîòóöôùúüûñç';
    const out = 'aaaaaaeeeeiiiioooouuuunc';
    charMap = [].reduce.call(inn, (acc, char, i) => {
        acc[char] = out[i];
        return acc;
    }, {});
}

const simpleSlugify = (string/*:string*/)/*:string*/ => {
    if (!charMap) {
        buildCharMap();
    }
    return string
        .toLowerCase()
        .replace(multiSpaceRe, space)
        .replace(/[^a-z0-9_]/g, (char) => charMap[char] || wildcard)
        .replace(multiWildcardRe, wildcard)
        .replace(endSpaceRe, '');
};

export default simpleSlugify;