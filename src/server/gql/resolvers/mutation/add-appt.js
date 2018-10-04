const { isAuthenticatedResolver } = require('../auth');
const { doesUserExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin, getContainerBlock, getContainerSize, getNewApptArrivalWindow, getArrivalWindowString } = require('../helpers');

// addAppt(details: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  async (_, { details: { userEmail, timeSlot, type, ...typeSpecific } }, { user, Appt, Block, Config, Restriction, User }) => {
    await doesUserExistCheck(userEmail, User);

    const typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific });
    if (type === 'IMPORTFULL') typeDetails.containerSize = getContainerSize(type, typeDetails);

    if (!isOpOrAdmin(user)) isUserSelfCheck(userEmail, user);

    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindow(timeSlot, Appt, Config);

    const block = getContainerBlock(type, typeDetails);
    const newAppt = { timeSlot, userEmail, block, arrivalWindowSlot, arrivalWindowLength, type, typeDetails }; // TODO standardize these inputs
    await isAvailableCheck([newAppt], Appt, Block, Config, Restriction); // appt scheduling logic
    await Appt.create(newAppt);

    return {
      ...newAppt,
      arrivalWindow: getArrivalWindowString(timeSlot, arrivalWindowSlot, arrivalWindowLength)
    };
  }
);

module.exports = addAppt;
