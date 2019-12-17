const { Op } = require('sequelize');
const moment = require('moment');

const { isAuthenticatedResolver } = require('../auth');

// myAppts: [Appointment]
const myAppts = isAuthenticatedResolver.createResolver(
  async (_, args, { user, Appt }) => (
    Appt.findAll({
      where: {
        userEmail: user.userEmail,
        timeSlotDateUTC: { 
          [Op.gte]: moment().startOf('day').subtract(1, 'month') 
        }
      }
    })
  )
);

module.exports = myAppts;
