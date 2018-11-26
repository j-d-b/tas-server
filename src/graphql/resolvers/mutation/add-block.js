const { isAdminResolver } = require('../auth');
const { blockDoesntExistCheck } = require('../checks');

// addBlock(input: AddBlockInput!): Block
const addBlock = isAdminResolver.createResolver(
  async (_, { input: { id, maxAllowedActionsPerHour } }, { Block }) => {
    await blockDoesntExistCheck(id, Block);

    const newBlock = {
      id: id,
      maxAllowedActionsPerHour: maxAllowedActionsPerHour
    };

    return Block.create(newBlock);
  }
);

module.exports = addBlock;
