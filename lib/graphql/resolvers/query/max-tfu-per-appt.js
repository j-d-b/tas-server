const { isAuthenticatedResolver } = require('../auth');

// maxTFUPerAppt: Int
const maxTFUPerAppt = isAuthenticatedResolver.createResolver(
  (_, args, { Config }) => Config.findOne().then(config => config.maxTFUPerAppt)
);

module.exports = maxTFUPerAppt;
