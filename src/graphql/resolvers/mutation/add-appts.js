const getContainerBlockId = require.main.require('./terminal-connection/get-container-block-id');
const getContainerSize = require.main.require('./terminal-connection/get-container-size');
const { isAuthenticatedResolver } = require('../auth');
const { doesUserExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin, getNewApptArrivalWindow } = require('../helpers');

// addAppts (input: [AddApptInput!]!): [Appt]
const addAppts = isAuthenticatedResolver.createResolver(
  async (_, { input }, { user, Appt, Block, Config, Restriction, User }) => {
    // only need to do this once, since will be the same for all appts
    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindow(input[0].timeSlot, Appt, Config);

    const newAppts = await Promise.all(input.map(async ({ timeSlot, userEmail, type, ...typeSpecific }) => {
      await doesUserExistCheck(userEmail, User);

      const typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific }); // schema doesn't verify this
      if (type === 'IMPORTFULL') typeDetails.containerSize = getContainerSize(typeDetails.containerID);

      if (!isOpOrAdmin(user)) isUserSelfCheck(userEmail, user);

      const blockID = getContainerBlockId(type, typeDetails);
      return { timeSlot, userEmail, arrivalWindowSlot, blockID, arrivalWindowLength, type, typeDetails };
    }));

    await isAvailableCheck(newAppts, Appt, Block, Config, Restriction); // appt scheduling logic

    return Appt.bulkCreate(newAppts);
  }
);

module.exports = addAppts;
