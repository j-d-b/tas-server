const { isOpOrAdminResolver } = require('../auth');
const { doesRestrictionExist } = require('../checks');

// deleteRestriction(input: DeleteRestrictionInput!): String
const deleteRestriction = isOpOrAdminResolver.createResolver(
  async (_, { input }, { AllowedAppts }) => {
    await doesRestrictionExist(input, AllowedAppts);
    await AllowedAppts.destroy({ where: { timeSlotHour: input.timeSlot.hour, timeSlotDate: input.timeSlot.date, block: (input.block || null) } });
    return 'Restriction successfully deleted';
  }
);

module.exports = deleteRestriction;
