const Op = require('sequelize').Op;

const { isOpOrAdminResolver } = require('../auth');

// globalRestrictions(input: GlobalRestrictionsInput!): [Restriction]
const globalRestrictions = isOpOrAdminResolver.createResolver(
  async (_, { input: { timeSlotHours, timeSlotDates } }, { Restriction }) => {
    const filters = {};
    if (timeSlotHours) filters.timeSlotHour = { [Op.or]: timeSlotHours };
    if (timeSlotDates) filters.timeSlotDate = { [Op.or]: timeSlotDates };

    return Restriction.findAll({ where: { ...filters, type: 'GLOBAL' } });
  }
);

module.exports = globalRestrictions;
