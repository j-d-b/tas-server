const { isAdminResolver } = require('../auth');
const { doesBlockExistCheck } = require('../checks');

// deleteBlock(id: String!): String
const deleteBlock = isAdminResolver.createResolver(
  async (_, { id }, { Block }) => {
    const targetBlock = await doesBlockExistCheck(id, Block);

    //blocks.remove(targetBlock);
    return `Block ${id} deleted successfully`;
  }
);

module.exports = deleteBlock;
