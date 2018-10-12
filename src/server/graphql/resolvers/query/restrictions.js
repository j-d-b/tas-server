const Op = require('sequelize').Op;

const { isOpOrAdminResolver } = require('../auth');

// restrictions(input: RestrictionsInput!): [Restriction]
const restrictions = isOpOrAdminResolver.createResolver(
  async (_, { input: { timeSlotHours, timeSlotDates, blocks } }, { Restriction }) => {
    const filters = {};
    if (timeSlotHours) filters.timeSlotHour = { [Op.or]: timeSlotHours };
    if (timeSlotDates) filters.timeSlotDate = { [Op.or]: timeSlotDates };
    if (blocks) filters.blockId = { [Op.or]: blocks };

    return Restriction.findAll({ where: { ...filters } });
  }
);

module.exports = restrictions;
