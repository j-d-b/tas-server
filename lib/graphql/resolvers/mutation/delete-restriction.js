const { isOpOrAdminResolver } = require('../auth');
const { doesRestrictionExistCheck } = require('../checks');

// deleteRestriction(input: DeleteRestrictionInput!): String
const deleteRestriction = isOpOrAdminResolver.createResolver(
  async (_, { input: { id } }, { Restriction }) => {
    const restriction = await doesRestrictionExistCheck(id, Restriction);
    await restriction.destroy();
    return 'Restriction deleted successfully';
  }
);

module.exports = deleteRestriction;
