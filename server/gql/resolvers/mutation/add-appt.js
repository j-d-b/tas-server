const { isAuthenticatedResolver } = require('../auth');
const { isOpOrAdmin } = require('../helpers');
const { doesUserExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');

// addAppt(details: AddApptInput!): Appointment
const addAppt = isAuthenticatedResolver.createResolver(
  (_, { details }, { appts, users, blocks, user }) => {
    const apptUserEmail = details.userEmail;
    doesUserExistCheck(apptUserEmail, users);

    const typeDetails = hasTypeDetailsCheck(details); // schema doesn't verify this

    if (!isOpOrAdmin(user)) {
      isUserSelfCheck(apptUserEmail, user);
    }

    isAvailableCheck([details], appts, blocks); // appt scheduling logic

    return appts.insert({
      timeSlot: details.timeSlot,
      userEmail: apptUserEmail,
      type: details.type,
      typeDetails: typeDetails
    });
  }
);

module.exports = addAppt;
