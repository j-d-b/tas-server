const { Op } = require('sequelize');
const moment = require('moment');

const { isAuthenticatedResolver } = require('../auth');
const { TIMEZONE } = process.env;

// myAppts: [Appointment]
const myAppts = isAuthenticatedResolver.createResolver(
  async (_, args, { user, Appt }) => (
    Appt.findAll({
      where: {
        userEmail: user.userEmail,
        timeSlotDateUTC: { [Op.gte]: moment().startOf('day').tz(TIMEZONE).subtract(1, 'months') } // TODO verify this is in the right tz
      }
    })
  )
);

module.exports = myAppts;
