const { isAuthenticatedResolver } = require('../auth');
const { isOpOrAdmin } = require('../helpers');
const { doesUserExistCheck, doesContainerIdExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');

// addAppts (input: [AddApptInput!]!): [Appt]
const addAppts = isAuthenticatedResolver.createResolver(
  (_, { input }, { appts, users, blocks, user }) => {
    const toInsert = input.map((details) => {
      const apptUserEmail = details.userEmail;
      doesUserExistCheck(apptUserEmail, users);

      let typeDetails = hasTypeDetailsCheck(details); // schema doesn't verify this
      if (details.type === 'IMPORTFULL') typeDetails = { ...typeDetails, ...doesContainerIdExistCheck(typeDetails.container) };

      if (!isOpOrAdmin(user)) isUserSelfCheck(apptUserEmail, user);

      return {
        timeSlot: details.timeSlot,
        userEmail: apptUserEmail,
        type: details.type,
        typeDetails: typeDetails
      };
    });

    isAvailableCheck(input, appts, blocks); // appt scheduling logic
    const insertedAppts = appts.insert(toInsert);
    return Array.isArray(insertedAppts) ? insertedAppts : [insertedAppts];
  }
);

module.exports = addAppts;
