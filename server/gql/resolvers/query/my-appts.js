const { isAuthenticatedResolver } = require('../auth');

// myAppts: [Appointment]
const myAppts = isAuthenticatedResolver.createResolver(
  (_, args, { appts, user }) => appts.find({ userEmail: user.userEmail })
);

module.exports = myAppts;
