const { isAdminResolver } = require('../auth');
const { doesBlockExistCheck } = require('../checks');

// updateBlockMaxAllowed(input: UpdateBlockMaxAllowedInput!): Block
const updateBlockMaxAllowed = isAdminResolver.createResolver(
  async (_, { input: { id, maxAllowed } }, { Block }) => {
    await doesBlockExistCheck(id, Block);

    await Block.update({ maxAllowedApptsPerHour: maxAllowed }, { where: { id }});

    return Block.findById(id);
  }
);

module.exports = updateBlockMaxAllowed;
