const { isAdminResolver } = require('../auth');

// updateMaxTotalAllowed(newVal: Int!): Int
const updateTotalMaxAllowed = isAdminResolver.createResolver(
  async (_, { newVal }, { Config }) => {
    await Config.update({ maxAllowedApptsPerHour: newVal }, { where: {}});
    return newVal;
  }
);

module.exports = updateTotalMaxAllowed;
