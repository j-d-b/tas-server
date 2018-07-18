const { isAuthenticatedResolver } = require('../auth');
const { isOpOrAdmin } = require('../helpers');
const { doesUserExistCheck, doesContainerIdExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');

// addAppt(details: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  (_, { details }, { appts, users, blocks, user }) => {
    const apptUserEmail = details.userEmail;
    doesUserExistCheck(apptUserEmail, users);

    let typeDetails = hasTypeDetailsCheck(details); // schema doesn't verify this
    if (details.type === 'IMPORTFULL') typeDetails = { ...typeDetails, ...doesContainerIdExistCheck(typeDetails.container) };

    if (!isOpOrAdmin(user)) isUserSelfCheck(apptUserEmail, user);

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
