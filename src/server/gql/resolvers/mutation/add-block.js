const { isAdminResolver } = require('../auth');
const { doesBlockNotExistCheck } = require('../checks');

// addBlock(details: AddBlockInput!): Block
const addBlock = isAdminResolver.createResolver(
  async (_, { details }, { Block }) => {
    await doesBlockNotExistCheck(details.blockId, Block);

    const newBlock = {
      id: details.blockId,
      maxAllowedApptsPerHour: details.maxAllowedApptsPerHour,
    };

    await Block.create(newBlock);

    return newBlock;
  }
);

module.exports = addBlock;
