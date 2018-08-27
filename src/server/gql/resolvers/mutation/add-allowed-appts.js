const { isOpOrAdminResolver } = require('../auth');
const { doAllowedApptsSetsExist } = require('../checks');

// addAllowedAppts(input: [AddAllowedApptsInput!]!): [AllowedAppts!]
const addAllowedAppts = isOpOrAdminResolver.createResolver(
  async (_, { input }, { AllowedAppts }) => {
    await doAllowedApptsSetsExist(input, AllowedAppts);
    await AllowedAppts.bulkCreate(input);
    return input;
  }
);

module.exports = addAllowedAppts;
