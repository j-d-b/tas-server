const { isOpOrAdminResolver } = require('../auth');

// totalAllowedApptsPerHour: Int
const totalAllowedApptsPerHour = isOpOrAdminResolver.createResolver(
  (_, args, { Config }) => Config.findOne().then(config => config.totalAllowedApptsPerHour)
);

module.exports = totalAllowedApptsPerHour;
