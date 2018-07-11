const { isAuthenticatedResolver } = require('../auth');

// allBlocks: [Block]
const allBlocks = isAuthenticatedResolver.createResolver(
  (_, args, { blocks }) => blocks.find()
);

module.exports = allBlocks;
