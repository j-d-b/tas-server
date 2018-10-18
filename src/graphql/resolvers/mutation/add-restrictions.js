const { isOpOrAdminResolver } = require('../auth');
const { noDuplicateRestrictionsCheck, validRestrictionInputCheck } = require('../checks');

// addRestrictions(input: [addRestrictionInput!]!): [Restriction!]
const addRestrictions = isOpOrAdminResolver.createResolver(
  async (_, { input }, { Restriction }) => {
    noDuplicateRestrictionsCheck(input);
    validRestrictionInputCheck(input);

    return Promise.all(input.map(async (restriction) => {
      const res = await Restriction.findOne({ where: {
        timeSlotHour: restriction.timeSlot.hour,
        timeSlotDate: restriction.timeSlot.date,
        type: restriction.type,
        ...(restriction.type === 'PLANNED_ACTIVITIES' && { blockId: restriction.blockId })
      }});

      return res ? res.update(restriction) : Restriction.create(restriction);
    }));
  }
);

module.exports = addRestrictions;
