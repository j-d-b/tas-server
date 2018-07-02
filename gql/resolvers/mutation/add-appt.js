const { createResolver, or } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');
const { isOpOrAdmin, getApptTypeDetails } = require('../helpers');
const { doesUserExistCheck, isUserSelfCheck } = require('../checks');

// addAppt(details: AddApptInput!): Appointment
const addAppt = isAuthenticatedResolver.createResolver(
  (_, { details }, { appts, users, user }) => {
    const apptUserEmail = details.userEmail

    doesUserExistCheck(apptUserEmail, users);

    if (!isOpOrAdmin(user)) {
      isUserSelfCheck(apptUserEmail, user);
    }

    return appts.insert({
      timeSlot: details.timeSlot,
      block: details.block,
      userEmail: apptUserEmail,
      type: details.type,
      typeDetails: getApptTypeDetails(details) // TODO verify (schema doesn't verify)
    });
  }
);

module.exports = addAppt;
