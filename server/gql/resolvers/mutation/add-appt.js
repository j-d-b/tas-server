const { isAuthenticatedResolver } = require('../auth');
const { isOpOrAdmin } = require('../helpers');
const { doesUserExistCheck, doesContainerIdExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');

// addAppt(details: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  async (_, { details: { timeSlot, userEmail, type, ...typeSpecific } }, { user, Appt, User, Block, Config }) => {
    await doesUserExistCheck(userEmail, User);

    let typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific }); // schema doesn't verify this
    if (type === 'IMPORTFULL') typeDetails = { ...typeDetails, ...doesContainerIdExistCheck(typeDetails.containerId) };

    if (!isOpOrAdmin(user)) isUserSelfCheck(userEmail, user);

    const newAppt = { timeSlot, userEmail, type, typeDetails };
    await isAvailableCheck([newAppt], Appt, Block, Config); // appt scheduling logic
    await Appt.create(newAppt);
    
    return newAppt;
  }
);

module.exports = addAppt;
