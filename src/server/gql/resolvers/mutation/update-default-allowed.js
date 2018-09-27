const { isAdminResolver } = require('../auth');

// updateDefaultAllowed(newVal: Int!): Int
const updateDefaultAllowed = isAdminResolver.createResolver(
  async (_, { newVal }, { Config }) => {
    await Config.update({ defaultAllowedApptsPerHour: newVal }, { where: {}}); // TODO do you need where?
    return newVal;
  }
);

module.exports = updateDefaultAllowed;
