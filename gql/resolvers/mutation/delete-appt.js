const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck } = require('../checks');
const { isOpOrAdmin } = require('../helpers');

// check auth
// check if id matches an appointment in the database
// check if target appt details.userEmail matches user.userEmail, or skip if user.userRole is op/admin
// delete appt

// deleteAppt(id: ID!): String
const deleteAppt = isAuthenticatedResolver.createResolver(
  (_, { id }, { appts, user }) => {
    const targetAppt = doesApptExistCheck(id);

    if (!isOpOrAdmin(user)) {
      isOwnApptCheck(targetAppt);
    }

    appts.remove(targetAppt);
    return 'Appointment deleted successfully';
  }
);

module.exports = deleteAppt;
