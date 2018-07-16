const { isAdminResolver } = require('../auth');

// totalAllowedApptsPerHour: Int
const totalAllowedApptsPerHour = isAdminResolver.createResolver(
  () => global.totalAllowed
);

module.exports = totalAllowedApptsPerHour;
