const { isOpOrAdminResolver } = require('../auth');
const { noDuplicateRestrictionsCheck } = require('../checks');
const { getUTCTimeFromTimeSlot } = require('../helpers');

// addGlobalRestrictions(input: [addGlobalRestrictionInput!]!): [Restriction!]
const addGlobalRestrictions = isOpOrAdminResolver.createResolver(
  async (_, { input: restrictions }, { Restriction }) => {
    noDuplicateRestrictionsCheck(restrictions, 'GLOBAL');

    return Promise.all(restrictions.map(async (restriction) => {
      const timeSlotDateUTC = getUTCTimeFromTimeSlot(restriction.timeSlot);

      const res = await Restriction.findOne({ where: { timeSlotDateUTC } });

      return res ? res.update(restriction) : Restriction.create({ ...restriction, type: 'GLOBAL' });
    }));
  }
);

module.exports = addGlobalRestrictions;
