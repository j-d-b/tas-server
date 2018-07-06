const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');

// block(id: String!): Block
const block = isAuthenticatedResolver.createResolver(
  (_, { id }, { blocks }) => blocks.by('id', id)
);

module.exports = block;
