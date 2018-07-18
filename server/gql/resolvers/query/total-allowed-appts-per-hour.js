const { isOpOrAdminResolver } = require('../auth');

// totalAllowedApptsPerHour: Int
const totalAllowedApptsPerHour = isOpOrAdminResolver.createResolver(
  () => global.TOTAL_ALLOWED
);

module.exports = totalAllowedApptsPerHour;
