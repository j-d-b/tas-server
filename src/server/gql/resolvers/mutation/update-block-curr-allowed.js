const { isOpOrAdminResolver } = require('../auth');
const { doesBlockExistCheck, isAllowedApptsPerHourValsCheck } = require('../checks');

// updateBlockCurrAllowed(blockId: String!, newVal: Int!): Block
const updateBlockCurrAllowed = isOpOrAdminResolver.createResolver(
  async (_, { blockId, newVal }, { Block }) => {
    const targetBlock = await doesBlockExistCheck(blockId, Block);

    isAllowedApptsPerHourValsCheck({
      maxAllowedApptsPerHour: targetBlock.maxAllowedApptsPerHour,
      currAllowedApptsPerHour: newVal
    });

    await Block.update({ currAllowedApptsPerHour: newVal }, { where: { id: blockId }});

    return Block.findById(blockId); // IDEA not another database interaction here, if update fails we won't get here, if it doesn't, we know what it'll be
  }
);

module.exports = updateBlockCurrAllowed;
