const { isAdminResolver } = require('../auth');
const { doesBlockExistCheck } = require('../checks');

// updateBlockMaxAllowed(input: UpdateBlockMaxAllowedInput!): Block
const updateBlockMaxAllowed = isAdminResolver.createResolver(
  async (_, { input: { id, maxAllowed } }, { Block }) => {
    const block = await doesBlockExistCheck(id, Block);
    return block.update({ maxAllowedActionsPerHour: maxAllowed });
  }
);

module.exports = updateBlockMaxAllowed;
