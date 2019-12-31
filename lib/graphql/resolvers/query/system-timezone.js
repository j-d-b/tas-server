const { baseResolver } = require('../auth');

// systemTimezone: String
const systemTimezone = baseResolver.createResolver(
  async () => process.env.TIMEZONE
);

module.exports = systemTimezone;
