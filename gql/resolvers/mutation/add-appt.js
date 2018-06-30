const { createResolver, or } = require('apollo-resolvers');

const { willBeOwnApptResolver, isOpOrAdminResolver } = require('../auth');
const { getApptTypeDetails, isOpOrAdmin } = require('../helpers');
const { NoUserInDBError, AddNotOwnApptError } = require('../errors');

// check auth
// check if details.userEmail is in users db
// check if details.userEmail matches user.userEmail, or skip if user.userRole is op/admin
// add appt

// addAppt(details: AddApptInput!): Appointment
const addAppt = or(isOpOrAdminResolver, willBeOwnApptResolver)(
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
