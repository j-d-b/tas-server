const { isAdminResolver } = require('../auth');

// updateTotalAllowed(newVal: Int!): Int
const updateTotalAllowed = isAdminResolver.createResolver(
  (_, { newVal }) => {
    global.TOTAL_ALLOWED = newVal;
    return newVal;
  }
);

module.exports = updateTotalAllowed;
