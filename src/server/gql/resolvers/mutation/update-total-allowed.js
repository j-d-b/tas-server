const { isAdminResolver } = require('../auth');

// updateTotalAllowed(newVal: Int!): Int
const updateTotalAllowed = isAdminResolver.createResolver(
  async (_, { newVal }, { Config }) => {
    await Config.update({ totalAllowedApptsPerHour: newVal }, { where: {}});
    return newVal;
  }
);

module.exports = updateTotalAllowed;
