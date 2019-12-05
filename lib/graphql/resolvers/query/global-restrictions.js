const { Op } = require('sequelize');
const { startOfDay, addDays } = require('date-fns');

const { isOpOrAdminResolver } = require('../auth');

// globalRestrictions(input: GlobalRestrictionsInput!): [Restriction]
const globalRestrictions = isOpOrAdminResolver.createResolver(
  async (_, { input: { startDate, endDate } }, { Restriction }) => (
    Restriction.findAll({
      where: {
        type: 'GLOBAL',
        timeSlotDate: {
          ...(startDate && { [Op.gt]: startOfDay(new Date(startDate)) }),
          ...(endDate && { [Op.lte]: startOfDay(addDays(new Date(endDate), 1)) })
        }
      }
    })
  )
);

module.exports = globalRestrictions;
