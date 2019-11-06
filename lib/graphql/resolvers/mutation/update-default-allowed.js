const { isAdminResolver } = require('../auth');

// updateDefaultAllowed(input: UpdateDefaultAllowedInput!): Int
const updateDefaultAllowed = isAdminResolver.createResolver(
  async (_, { input: { defaultAllowed } }, { Config }) => {
    const config = await Config.findOne();
    const updatedConfig = await config.update({ defaultAllowedApptsPerHour: defaultAllowed });
    return updatedConfig.defaultAllowedApptsPerHour;
  }
);

module.exports = updateDefaultAllowed;
