const { isAdminResolver } = require('../auth');
const { doesBlockExistCheck, isAllowedApptsPerHourValsCheck } = require('../checks');

// updateBlockMaxAllowed(blockId: String!, newVal: Int!): Block
const updateBlockMaxAllowed = isAdminResolver.createResolver(
  (_, { blockId, newVal }, { blocks }) => {
    const targetBlock = doesBlockExistCheck(blockId, blocks);

    isAllowedApptsPerHourValsCheck({
      maxAllowedApptsPerHour: newVal,
      currAllowedApptsPerHour: targetBlock.currAllowedApptsPerHour
    });

    targetBlock.maxAllowedApptsPerHour = newVal;
    blocks.update(targetBlock);

    return targetBlock;
  }
);

module.exports = updateBlockMaxAllowed;
