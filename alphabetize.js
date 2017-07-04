import sortIsl from './sortIsl';
let supportsIcelandic;

const langAliases = {
  no: 'nb', // 'no' doesn't work in Chrome, but 'nb' does
};

export default function alphabetize(arr, lang, getProp) {
  getProp = getProp || ((item) => item);

  if ( typeof getProp === 'string' ) {
    const prop = getProp;
    getProp = (item) => item[prop];
  }
  if (
    lang === 'is' &&
    supportsIcelandic == null &&
    (supportsIcelandic = 'ð'.localeCompare('e','is') === -1) === false
  ) {
    return sortIsl( arr, { getProp } );
  }
  else {
    let newArr = arr.map((item, idx) => ({ value: getProp(item), idx }));
    lang = langAliases[lang] || lang;
    newArr.sort( (a,b) => {
      return a.value.localeCompare(b.value, lang, {
        sensitivity: 'accent',
        ignorePunctuation: true,
        numeric: true,
      });
    });
    return newArr.map((item) => arr[item.idx]);
  }
}
