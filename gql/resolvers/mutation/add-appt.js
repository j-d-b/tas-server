const { createResolver } = require('apollo-resolvers');

const { doesApptUserExistResolver } = require('../auth');
const { getApptTypeDetails, isOpOrAdmin } = require('../helpers');
const { NoUserInDBError, AddNotOwnApptError } = require('../errors');

// TODO consider removing this complexity by not allowing the appt user to be manually set on add
// only operator (and admin) can add appointment data for another user (or change an appt owner `userEmail`)
const isAddOwnApptResolver = doesApptUserExistResolver.createResolver(
  (_, { details: { userEmail } }, { user }) => {
    if (userEmail !== user.userEmail && !isOpOrAdmin(user.userRole)) throw new AddNotOwnApptError();
  }
);

// addAppt(details: AddApptInput!): Appointment
const addAppt = isAddOwnApptResolver.createResolver(
  (_, { details }, { appts }) => {
    return appts.insert({
      timeSlot: details.timeSlot,
      block: details.block,
      userEmail: details.userEmail,
      type: details.type,
      typeDetails: getApptTypeDetails(details) // TODO verify (schema doesn't verify)
    });
  }
);

module.exports = addAppt;
