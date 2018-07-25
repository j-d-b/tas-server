const { isAuthenticatedResolver } = require('../auth');

// allBlocks: [Block]
const allBlocks = isAuthenticatedResolver.createResolver(
  async (_, args, { Block }) => Block.findAll()
);

module.exports = allBlocks;
