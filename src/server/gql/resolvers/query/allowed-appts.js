const Op = require('sequelize').Op;

const { isOpOrAdminResolver } = require('../auth');

// allowedAppts(input: AllowedApptsInput!): [AllowedAppts]
const allowedAppts = isOpOrAdminResolver.createResolver(
  async (_, { input: { timeSlotHours, timeSlotDates, blocks } }, { AllowedAppts }) => {
    const filterSet = {};
    if (timeSlotHours) filterSet.timeSlotHour = { [Op.or]: timeSlotHours };
    if (timeSlotDates) filterSet.timeSlotDate = { [Op.or]: timeSlotDates };
    if (blocks) filterSet.block = { [Op.or]: blocks };

    return AllowedAppts.findAll({ where: { ...filterSet } });
  }
);

module.exports = allowedAppts;
