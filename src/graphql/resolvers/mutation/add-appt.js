const { getContainerBlockId, getContainerSize } = require('../../../terminal-connection');
const { isAuthenticatedResolver } = require('../auth');
const { hasTypeDetailsCheck, isAvailableCheck } = require('../checks');
const { getNewApptArrivalWindow } = require('../helpers');

// addAppt(input: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { timeSlot, type, ...typeSpecific } }, { user, Appt, Block, Config, Restriction }) => {
    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindow(timeSlot, Appt, Config);

    const typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific });
    if (type === 'IMPORTFULL') typeDetails.containerSize = getContainerSize(type, typeDetails);

    const blockID = getContainerBlockId(type, typeDetails);
    const newAppt = { timeSlot, userEmail: user.userEmail, blockID, arrivalWindowSlot, arrivalWindowLength, type, typeDetails };
    await isAvailableCheck([newAppt], Appt, Block, Config, Restriction); // appt scheduling logic

    return Appt.create(newAppt);
  }
);

module.exports = addAppt;
