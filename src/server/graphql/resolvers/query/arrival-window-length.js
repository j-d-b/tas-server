const { isOpOrAdminResolver } = require('../auth');

// arrivalWindowLength: Int
const arrivalWindowLength = isOpOrAdminResolver.createResolver(
  (_, args, { Config }) => Config.findOne().then(config => config.arrivalWindowLength)
);

module.exports = arrivalWindowLength;
