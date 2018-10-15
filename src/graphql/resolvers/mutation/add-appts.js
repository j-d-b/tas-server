const { getContainerBlockId, getContainerSize } = require('../../../terminal-connection/');
const { isAuthenticatedResolver } = require('../auth');
const { hasTypeDetailsCheck, isAvailableCheck } = require('../checks');
const { getNewApptArrivalWindow } = require('../helpers');

// addAppts (input: [AddApptInput!]!): [Appt]
const addAppts = isAuthenticatedResolver.createResolver(
  async (_, { input }, { user, Appt, Block, Config, Restriction }) => {
    const { userEmail } = user;
    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindow(input[0].timeSlot, Appt, Config);

    const newAppts = input.map(({ timeSlot, type, ...typeSpecific }) => {
      const typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific }); // schema doesn't verify this
      if (type === 'IMPORTFULL') typeDetails.containerSize = getContainerSize(typeDetails.containerID);

      const blockID = getContainerBlockId(type, typeDetails);
      return { timeSlot, userEmail, arrivalWindowSlot, blockID, arrivalWindowLength, type, typeDetails };
    });

    await isAvailableCheck(newAppts, Appt, Block, Config, Restriction); // appt scheduling logic

    return Appt.bulkCreate(newAppts);
  }
);

module.exports = addAppts;
