const { createResolver, or } = require('apollo-resolvers');

const { isOwnApptResolver, isOpOrAdminResolver } = require('../auth');

// check auth
// check if id matches an appointment in the database
// check if target appt details.userEmail matches user.userEmail, or skip if user.userRole is op/admin
// delete appt

// deleteAppt(id: ID!): String
const deleteAppt = or(isOpOrAdminResolver, isOwnApptResolver)(
  (_, args, { appts, targetAppt }) => {
    appts.remove(targetAppt);
    return 'Appointment deleted successfully';
  }
);

module.exports = deleteAppt;
