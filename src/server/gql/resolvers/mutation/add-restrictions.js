const { isOpOrAdminResolver } = require('../auth');
const { noDuplicateRestrictionsCheck, areRestrictionValuesValidCheck } = require('../checks');

// addRestrictions(input: [addRestrictionInput!]!): [Restriction!]
const addRestrictions = isOpOrAdminResolver.createResolver(
  async (_, { input }, { Block, Config, Restriction }) => {
    noDuplicateRestrictionsCheck(input);
    await areRestrictionValuesValidCheck(input, Block, Config, Restriction);

    // it's actually `upsert`
    for (const restriction of input) {
      const res = await Restriction.findOne({ where: {
        timeSlotHour: restriction.timeSlot.hour,
        timeSlotDate: restriction.timeSlot.date,
        block: restriction.block || null
      }});

      res ? await res.update(restriction) : Restriction.create(restriction);
    }

    return input;
  }
);

module.exports = addRestrictions;
