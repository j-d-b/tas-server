const { isAdminResolver } = require('../auth');

// updateDefaultAllowed(input: UpdateDefaultAllowedInput!): Int
const updateDefaultAllowed = isAdminResolver.createResolver(
  async (_, { input: { defaultAllowed } }, { Config }) => {
    const config = await Config.findOne();
    await config.update({ defaultAllowedApptsPerHour: defaultAllowed });
    return defaultAllowed;
  }
);

module.exports = updateDefaultAllowed;
