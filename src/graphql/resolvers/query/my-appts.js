const { isAuthenticatedResolver } = require('../auth');

// myAppts: [Appointment]
const myAppts = isAuthenticatedResolver.createResolver(
  async (_, args, { user, Appt }) => Appt.findAll({ where: { userEmail: user.userEmail } })
);

module.exports = myAppts;
