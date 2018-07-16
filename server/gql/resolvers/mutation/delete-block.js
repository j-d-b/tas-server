const { isAdminResolver } = require('../auth');
const { doesBlockExistCheck } = require('../checks');

// deleteBlock(id: String!): String
const deleteBlock = isAdminResolver.createResolver(
  (_, { id }, { blocks }) => {
    const targetBlock = doesBlockExistCheck(id, blocks);

    blocks.remove(targetBlock);
    return `Block ${id} deleted successfully`;
  }
);

module.exports = deleteBlock;
