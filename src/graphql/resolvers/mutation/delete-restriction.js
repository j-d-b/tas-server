const { isOpOrAdminResolver } = require('../auth');
const { doesRestrictionExistCheck } = require('../checks');

// deleteRestriction(input: DeleteRestrictionInput!): String
const deleteRestriction = isOpOrAdminResolver.createResolver(
  async (_, { input }, { Restriction }) => {
    await doesRestrictionExistCheck(input, Restriction);
    await Restriction.destroy({
      where: {
        timeSlotHour: input.timeSlot.hour,
        timeSlotDate: input.timeSlot.date,
        type: input.type,
        blockID: (input.blockID || null)
      }
    });
    return 'Restriction successfully deleted';
  }
);

module.exports = deleteRestriction;
