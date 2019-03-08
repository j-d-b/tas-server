const { isOpOrAdminResolver } = require('../auth');

// defaultAllowedApptsPerHour: Int
const defaultAllowedApptsPerHour = isOpOrAdminResolver.createResolver(
  (_, args, { Config }) => Config.findOne().then(config => config.defaultAllowedApptsPerHour)
);

module.exports = defaultAllowedApptsPerHour;
