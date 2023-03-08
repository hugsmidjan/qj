if (!Object.fromEntries) {
  Object.fromEntries = function (list) {
    const obj = {};
    [].slice.call(list).forEach((entry) => {
      obj[entry[0]] = entry[1];
    });
    return obj;
  };
}
