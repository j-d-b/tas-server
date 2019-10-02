const { isOpOrAdminResolver } = require('../auth');
const { noDuplicateRestrictionsCheck } = require('../checks');

// addRestrictions(input: [addRestrictionInput!]!): [Restriction!]
const addRestrictions = isOpOrAdminResolver.createResolver(
  async (_, { input }, { Restriction }) => {
    noDuplicateRestrictionsCheck(input);

    return Promise.all(input.map(async (restriction) => {
      const res = await Restriction.findOne({
        where: {
          timeSlotHour: restriction.timeSlot.hour,
          timeSlotDate: restriction.timeSlot.date
        }
      });

      return res ? res.update(restriction) : Restriction.create(restriction);
    }));
  }
);

module.exports = addRestrictions;
