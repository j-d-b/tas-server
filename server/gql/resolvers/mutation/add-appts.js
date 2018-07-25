const { isAuthenticatedResolver } = require('../auth');
const { isOpOrAdmin } = require('../helpers');
const { doesUserExistCheck, doesContainerIdExistCheck, hasTypeDetailsCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');

// addAppts (input: [AddApptInput!]!): [Appt]
const addAppts = isAuthenticatedResolver.createResolver(
  async (_, { input }, { user, Appt, Block, User, Config }) => {
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
