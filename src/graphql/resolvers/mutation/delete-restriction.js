const { isOpOrAdminResolver } = require('../auth');
const { doesRestrictionExistCheck } = require('../checks');

// deleteRestriction(input: DeleteRestrictionInput!): String
const deleteRestriction = isOpOrAdminResolver.createResolver(
  async (_, { input: { id } }, { Restriction }) => {
    await doesRestrictionExistCheck(id, Restriction);
    await Restriction.destroy({ where: { id } });
    return 'Restriction successfully deleted';
  }
);

module.exports = deleteRestriction;
