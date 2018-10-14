const { isOpOrAdminResolver } = require('../auth');
const { noDuplicateRestrictionsCheck, validRestrictionInputCheck } = require('../checks');

// addRestrictions(input: [addRestrictionInput!]!): [Restriction!]
const addRestrictions = isOpOrAdminResolver.createResolver(
  async (_, { input }, { Restriction }) => {
    noDuplicateRestrictionsCheck(input);
    validRestrictionInputCheck(input);

    // it's actually 'upsert'
    for (const restriction of input) {
      const res = await Restriction.findOne({ where: {
        timeSlotHour: restriction.timeSlot.hour,
        timeSlotDate: restriction.timeSlot.date,
        type: restriction.type,
        blockID: restriction.type === 'PLANNED_ACTIVITIES' && restriction.blockID || null
      }});

      res ? await res.update(restriction) : Restriction.create(restriction);
    }

    return input;
  }
);

module.exports = addRestrictions;
