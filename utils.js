// used to remove empty variables from query
// e.g. if query object is { id: "", user: "jacob" }, will search the database for
// only for where user: "jacob", not looking for a null ID
exports.removeEmpty = (obj) => {
  const nonNullKeys = Object.keys(obj).filter(key => obj[key]);
  return nonNullKeys.reduce((newObj, key) => {
    newObj[key] = obj[key];
    return newObj
  }, {});
};
