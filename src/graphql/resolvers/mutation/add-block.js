const { isAdminResolver } = require('../auth');
const { blockDoesntExistCheck } = require('../checks');

// addBlock(input: AddBlockInput!): Block
const addBlock = isAdminResolver.createResolver(
  async (_, { input: { id, maxAllowedApptsPerHour } }, { Block }) => {
    await blockDoesntExistCheck(id, Block);

    const newBlock = {
      id: id,
      maxAllowedApptsPerHour: maxAllowedApptsPerHour,
    };

    return Block.create(newBlock);
  }
);

module.exports = addBlock;
