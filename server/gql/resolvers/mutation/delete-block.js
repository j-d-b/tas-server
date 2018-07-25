const { isAdminResolver } = require('../auth');
const { doesBlockExistCheck } = require('../checks');

// deleteBlock(id: String!): String
const deleteBlock = isAdminResolver.createResolver(
  async (_, { id }, { Block }) => {
    await doesBlockExistCheck(id, Block);

    Block.destroy({ where: { id: id }});
    
    return `Block ${id} deleted successfully`;
  }
);

module.exports = deleteBlock;
