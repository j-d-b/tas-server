const getContainerBlockId = require.main.require('./terminal-connection/get-container-block-id');
const getContainerSize = require.main.require('./terminal-connection/get-container-size');
const { isAuthenticatedResolver } = require('../auth');
const { doesUserExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin, getNewApptArrivalWindow, getArrivalWindowString } = require('../helpers');

// addAppt(input: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { userEmail, timeSlot, type, ...typeSpecific } }, { user, Appt, Block, Config, Restriction, User }) => {
    await doesUserExistCheck(userEmail, User);

    const typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific });
    if (type === 'IMPORTFULL') typeDetails.containerSize = getContainerSize(type, typeDetails);

    if (!isOpOrAdmin(user)) isUserSelfCheck(userEmail, user);

    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindow(timeSlot, Appt, Config);

    const blockID = getContainerBlockId(type, typeDetails);
    const newAppt = { timeSlot, userEmail, blockID, arrivalWindowSlot, arrivalWindowLength, type, typeDetails };
    await isAvailableCheck([newAppt], Appt, Block, Config, Restriction); // appt scheduling logic

    return Appt.create(newAppt);
  }
);

module.exports = addAppt;
