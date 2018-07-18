const { isAdminResolver } = require('../auth');

// totalAllowedApptsPerHour: Int
const totalAllowedApptsPerHour = isAdminResolver.createResolver(
  () => global.TOTAL_ALLOWED
);

module.exports = totalAllowedApptsPerHour;
