const { isAdminResolver } = require('../auth');

// updateDefaultAllowed(input: UpdateDefaultAllowedInput!): Int
const updateDefaultAllowed = isAdminResolver.createResolver(
  async (_, { input: { defaultAllowed } }, { Config }) => {
    const config = await Config.findOne();
    return config.update({ defaultAllowedApptsPerHour: defaultAllowed });
  }
);

module.exports = updateDefaultAllowed;
