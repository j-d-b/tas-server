const { isAuthenticatedResolver } = require('../auth');

// myAppts: [Appointment]
const myAppts = isAuthenticatedResolver.createResolver(
  async (_, args, { Appt, user }) => Appt.findAll({ where: { userEmail: user.userEmail } })
);

module.exports = myAppts;
