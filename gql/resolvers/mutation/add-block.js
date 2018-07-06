const { createResolver } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { doesBlockNotExistCheck, isAllowedApptsPerHourValsCheck } = require('../checks');

// addBlock(details: AddBlockInput!): Block
const addBlock = isAdminResolver.createResolver(
  (_, { details }, { blocks }) => {
    doesBlockNotExistCheck(details.blockId, blocks);
    isAllowedApptsPerHourValsCheck(details);

    return blocks.insert({
      id: details.blockId,
      maxAllowedApptsPerHour: details.maxAllowedApptsPerHour,
      currAllowedApptsPerHour: details.currAllowedApptsPerHour
    });
  }
);

module.exports = addBlock;
