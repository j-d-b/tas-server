const { isAuthenticatedResolver } = require('../auth');
const { isOpOrAdmin } = require('../helpers');
const { doesUserExistCheck, hasTypeDetailsCheck, isUserSelfCheck } = require('../checks');

// addAppt(details: AddApptInput!): Appointment
const addAppt = isAuthenticatedResolver.createResolver(
  (_, { details }, { appts, users, user }) => {
    const apptUserEmail = details.userEmail;
    doesUserExistCheck(apptUserEmail, users);

    const typeDetails = hasTypeDetailsCheck(details); // schema doesn't verify this

    if (!isOpOrAdmin(user)) {
      isUserSelfCheck(apptUserEmail, user);
    }

    return appts.insert({
      timeSlot: details.timeSlot,
      block: details.block,
      userEmail: apptUserEmail,
      type: details.type,
      typeDetails: typeDetails
    });
  }
);

module.exports = addAppt;
