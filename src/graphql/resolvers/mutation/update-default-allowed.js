const { isAdminResolver } = require('../auth');

// updateDefaultAllowed(input: UpdateDefaultAllowedInput!): Int
const updateDefaultAllowed = isAdminResolver.createResolver(
  async (_, { input: { defaultAllowed } }, { Config }) => {
    await Config.update({ defaultAllowedApptsPerHour: defaultAllowed }, { where: {}}); // TODO do you need where?
    return defaultAllowed;
  }
);

module.exports = updateDefaultAllowed;
