const Op = require('sequelize').Op;

const { isOpOrAdminResolver } = require('../auth');

// restrictions(input: RestrictionsInput!): [Restriction]
const restrictions = isOpOrAdminResolver.createResolver(
  async (_, { input: { timeSlotHours, timeSlotDates, blocks } }, { Restriction }) => {
    const filterSet = {};
    if (timeSlotHours) filterSet.timeSlotHour = { [Op.or]: timeSlotHours };
    if (timeSlotDates) filterSet.timeSlotDate = { [Op.or]: timeSlotDates };
    if (blocks) filterSet.block = { [Op.or]: blocks };

    return Restriction.findAll({ where: { ...filterSet } });
  }
);

module.exports = restrictions;
