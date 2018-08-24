const { isAuthenticatedResolver } = require('../auth');
const { doesUserExistCheck, doesContainerIdExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin } = require('../helpers');

// addAppts (input: [AddApptInput!]!): [Appt]
const addAppts = isAuthenticatedResolver.createResolver(
  async (_, { input }, { user, Appt, Block, Config, User }) => {
    const newAppts = await Promise.all(input.map(async ({ timeSlot, userEmail, type, ...typeSpecific }) => {
      await doesUserExistCheck(userEmail, User);

      let typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific }); // schema doesn't verify this
      if (type === 'IMPORTFULL') typeDetails = { ...typeDetails, ...doesContainerIdExistCheck(typeDetails.containerId) };

      if (!isOpOrAdmin(user)) isUserSelfCheck(userEmail, user);

      return { timeSlot, userEmail, type, typeDetails };
    }));

    await isAvailableCheck(newAppts, Appt, Block, Config); // appt scheduling logic
    await Appt.bulkCreate(newAppts);

    return newAppts;
  }
);

module.exports = addAppts;
