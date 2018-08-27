const { isOpOrAdminResolver } = require('../auth');

// maxAllowedApptsPerHour: Int
const maxAllowedApptsPerHour = isOpOrAdminResolver.createResolver(
  (_, args, { Config }) => Config.findOne().then(config => config.maxAllowedApptsPerHour)
);

module.exports = maxAllowedApptsPerHour;
