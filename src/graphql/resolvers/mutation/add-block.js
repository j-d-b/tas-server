const { isAdminResolver } = require('../auth');
const { doesBlockNotExistCheck } = require('../checks');

// addBlock(input: AddBlockInput!): Block
const addBlock = isAdminResolver.createResolver(
  async (_, { input: { id, maxAllowedApptsPerHour } }, { Block }) => {
    await doesBlockNotExistCheck(id, Block);

    const newBlock = {
      id: id,
      maxAllowedApptsPerHour: maxAllowedApptsPerHour,
    };

    await Block.create(newBlock);

    return newBlock;
  }
);

module.exports = addBlock;
