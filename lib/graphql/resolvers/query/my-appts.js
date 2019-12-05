const { Op } = require('sequelize');
const { subMonths, startOfToday } = require('date-fns');

const { isAuthenticatedResolver } = require('../auth');

// myAppts: [Appointment]
const myAppts = isAuthenticatedResolver.createResolver(
  async (_, args, { user, Appt }) => (
    Appt.findAll({
      where: {
        userEmail: user.userEmail,
        timeSlotDate: { [Op.gte]: subMonths(startOfToday(), 1) }
      }
    })
  )
);

module.exports = myAppts;
