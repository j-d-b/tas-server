const { createResolver } = require('apollo-resolvers');

const { isOwnApptResolver } = require('../auth');

// deleteAppt(id: ID!): String
const deleteAppt = isOwnApptResolver.createResolver(
  (_, args, { appts, targetAppt }) => {
    appts.remove(targetAppt);
    return 'Appointment deleted successfully';
  }
);

module.exports = deleteAppt;
