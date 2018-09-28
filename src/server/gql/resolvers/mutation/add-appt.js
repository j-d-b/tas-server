const { isAuthenticatedResolver } = require('../auth');
const { doesUserExistCheck, doesContainerIdExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin, getNewApptArrivalWindow, getArrivalWindowString } = require('../helpers');

// addAppt(details: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  async (_, { details: { userEmail, timeSlot, type, ...typeSpecific } }, { user, Appt, Block, Config, Restriction, User }) => {
    await doesUserExistCheck(userEmail, User);

    let typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific }); // schema doesn't verify this
    if (type === 'IMPORTFULL') typeDetails = { ...typeDetails, ...doesContainerIdExistCheck(typeDetails.containerId) };

    if (!isOpOrAdmin(user)) isUserSelfCheck(userEmail, user);

    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindow(timeSlot, Appt, Config);

    const newAppt = { timeSlot, userEmail, arrivalWindowSlot, arrivalWindowLength, type, typeDetails };
    await isAvailableCheck([newAppt], Appt, Block, Config, Restriction); // appt scheduling logic
    await Appt.create(newAppt);

    return {
      ...newAppt,
      arrivalWindow: getArrivalWindowString(timeSlot, arrivalWindowSlot, arrivalWindowLength)
    };
  }
);

module.exports = addAppt;
