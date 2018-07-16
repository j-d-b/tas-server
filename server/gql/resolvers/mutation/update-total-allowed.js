const { isAdminResolver } = require('../auth');

// updateTotalAllowed(newVal: Int!): Int
const updateTotalAllowed = isAdminResolver.createResolver(
  (_, { newVal }) => {
    global.totalAllowed = newVal;
    return newVal;
  }
);

module.exports = updateTotalAllowed;
