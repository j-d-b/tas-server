const { isAdminResolver } = require('../auth');
const { doesBlockExistCheck, isAllowedApptsPerHourValsCheck } = require('../checks');

// updateBlockMaxAllowed(blockId: String!, newVal: Int!): Block
const updateBlockMaxAllowed = isAdminResolver.createResolver(
  async (_, { blockId, newVal }, { Block }) => {
    const targetBlock = await doesBlockExistCheck(blockId, Block);

    isAllowedApptsPerHourValsCheck({
      maxAllowedApptsPerHour: newVal,
      currAllowedApptsPerHour: targetBlock.currAllowedApptsPerHour
    });

    await Block.update({ maxAllowedApptsPerHour: newVal }, { where: { id: blockId }});

    return Block.findById(blockId);
  }
);

module.exports = updateBlockMaxAllowed;
