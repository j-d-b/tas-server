const { isAuthenticatedResolver } = require('../auth');

// block(input: BlockInput!): Block
const block = isAuthenticatedResolver.createResolver(
  async (_, { input: { id } }, { Block }) => Block.findById(id)
);

module.exports = block;
