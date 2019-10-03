const { isOpOrAdminResolver } = require('../auth');
const { noDuplicateRestrictionsCheck } = require('../checks');

// addGlobalRestrictions(input: [addGlobalRestrictionInput!]!): [Restriction!]
const addGlobalRestrictions = isOpOrAdminResolver.createResolver(
  async (_, { input }, { Restriction }) => {
    noDuplicateRestrictionsCheck(input, 'GLOBAL');

    return Promise.all(input.map(async (restriction) => {
      const res = await Restriction.findOne({
        where: {
          hour: restriction.timeSlot.hour,
          timeSlotDate: restriction.timeSlot.date
        }
      });

      return res ? res.update(restriction) : Restriction.create({ ...restriction, type: 'GLOBAL' });
    }));
  }
);

module.exports = addGlobalRestrictions;
