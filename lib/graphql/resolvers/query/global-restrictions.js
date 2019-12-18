const { Op } = require('sequelize');
const moment = require('moment-timezone');

const { isOpOrAdminResolver } = require('../auth');
const { TIMEZONE } = process.env;

// globalRestrictions(input: GlobalRestrictionsInput!): [Restriction]
const globalRestrictions = isOpOrAdminResolver.createResolver(
  async (_, { input: { startTimeSlotDate, endTimeSlotDate } }, { Restriction }) => (
    Restriction.findAll({
      where: {
        type: 'GLOBAL',
        timeSlotDateUTC: {
          ...(startTimeSlotDate && { [Op.gte]: moment.tz(`${startTimeSlotDate} 00:00:00`, TIMEZONE) }),
          ...(endTimeSlotDate && { [Op.lte]: moment.tz(`${endTimeSlotDate} 23:59:59`, TIMEZONE) })
        }
      }
    })
  )
);

module.exports = globalRestrictions;
