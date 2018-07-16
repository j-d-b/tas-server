const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck } = require('../checks');
const { isOpOrAdmin } = require('../helpers');

// deleteAppt(id: ID!): String
const deleteAppt = isAuthenticatedResolver.createResolver(
  (_, { id }, { appts, user }) => {
    const targetAppt = doesApptExistCheck(id, appts);

    if (!isOpOrAdmin(user)) {
      isOwnApptCheck(targetAppt, user);
    }

    appts.remove(targetAppt);
    return 'Appointment deleted successfully';
  }
);

module.exports = deleteAppt;
