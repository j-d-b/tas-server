const { isAuthenticatedResolver } = require('../auth');
const { doesUserExistCheck, doesContainerIdExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin, getNewApptArrivalWindow, getArrivalWindowString } = require('../helpers');

// addAppts (input: [AddApptInput!]!): [Appt]
const addAppts = isAuthenticatedResolver.createResolver(
  async (_, { input }, { user, Appt, Block, Config, Restriction, User }) => {
    // only need to do this once, since will be the same for all appts
    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindow(input[0].timeSlot, Appt, Config);

    const newAppts = await Promise.all(input.map(async ({ timeSlot, userEmail, type, ...typeSpecific }) => {
      await doesUserExistCheck(userEmail, User);

      let typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific }); // schema doesn't verify this
      if (type === 'IMPORTFULL') typeDetails = { ...typeDetails, ...doesContainerIdExistCheck(typeDetails.containerId) };

      if (!isOpOrAdmin(user)) isUserSelfCheck(userEmail, user);

      return { timeSlot, userEmail, arrivalWindowSlot, arrivalWindowLength, type, typeDetails };
    }));

    await isAvailableCheck(newAppts, Appt, Block, Config, Restriction); // appt scheduling logic
    await Appt.bulkCreate(newAppts);

    return newAppts.map(appt => ({
      ...appt,
      arrivalWindow: getArrivalWindowString(appt.timeSlot, appt.arrivalWindowSlot, appt.arrivalWindowLength)
    }));
  }
);

module.exports = addAppts;
