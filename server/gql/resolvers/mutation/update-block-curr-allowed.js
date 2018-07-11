const { isOpOrAdminResolver } = require('../auth');
const { doesBlockExistCheck, isAllowedApptsPerHourValsCheck } = require('../checks');

// updateBlockCurrAllowed(blockId: String!, newVal: Int!): Block
const updateBlockCurrAllowed = isOpOrAdminResolver.createResolver(
  (_, { blockId, newVal }, { blocks }) => {
    const targetBlock = doesBlockExistCheck(blockId, blocks);

    isAllowedApptsPerHourValsCheck({
      maxAllowedApptsPerHour: targetBlock.maxAllowedApptsPerHour,
      currAllowedApptsPerHour: newVal
    });

    targetBlock.currAllowedApptsPerHour = newVal;
    blocks.update(targetBlock);

    return targetBlock;
  }
);

module.exports = updateBlockCurrAllowed;
