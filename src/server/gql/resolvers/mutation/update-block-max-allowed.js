const { isAdminResolver } = require('../auth');
const { doesBlockExistCheck } = require('../checks');

// updateBlockMaxAllowed(blockId: String!, newVal: Int!): Block
const updateBlockMaxAllowed = isAdminResolver.createResolver(
  async (_, { blockId, newVal }, { Block }) => {
    await doesBlockExistCheck(blockId, Block);

    await Block.update({ maxAllowedApptsPerHour: newVal }, { where: { id: blockId }});

    return Block.findById(blockId);
  }
);

module.exports = updateBlockMaxAllowed;
