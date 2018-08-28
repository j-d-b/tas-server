const { isAuthenticatedResolver } = require('../auth');
const { doesUserExistCheck, doesContainerIdExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin } = require('../helpers');

// addAppt(details: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  async (_, { details: { userEmail, timeSlot, type, ...typeSpecific } }, { user, Restriction, Appt, Block, Config, User }) => {
    await doesUserExistCheck(userEmail, User);

    let typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific }); // schema doesn't verify this
    if (type === 'IMPORTFULL') typeDetails = { ...typeDetails, ...doesContainerIdExistCheck(typeDetails.containerId) };

    if (!isOpOrAdmin(user)) isUserSelfCheck(userEmail, user);

    const newAppt = { timeSlot, userEmail, type, typeDetails };
    await isAvailableCheck([newAppt], Restriction, Appt, Block, Config); // appt scheduling logic
    await Appt.create(newAppt);

    return newAppt;
  }
);

module.exports = addAppt;
