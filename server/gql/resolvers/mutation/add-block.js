const { isAdminResolver } = require('../auth');
const { doesBlockNotExistCheck, isAllowedApptsPerHourValsCheck } = require('../checks');

// addBlock(details: AddBlockInput!): Block
const addBlock = isAdminResolver.createResolver(
  async (_, { details }, { Block }) => {
    await doesBlockNotExistCheck(details.blockId, Block);
    isAllowedApptsPerHourValsCheck(details);

    const newBlock = {
      id: details.blockId,
      maxAllowedApptsPerHour: details.maxAllowedApptsPerHour,
      currAllowedApptsPerHour: details.currAllowedApptsPerHour
    };

    await Block.create(newBlock);

    return newBlock;
  }
);

module.exports = addBlock;
