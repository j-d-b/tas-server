const { isAuthenticatedResolver } = require('../auth');

// block(id: String!): Block
const block = isAuthenticatedResolver.createResolver(
  async (_, { id }, { Block }) => Block.findById(id)
);

module.exports = block;
