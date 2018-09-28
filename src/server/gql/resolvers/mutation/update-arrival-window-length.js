const { isAdminResolver } = require('../auth');
const { isWindowLengthValidCheck } = require('../checks');

// updateArrivalWindowLength(newVal: Int!): Block
const updateArrivalWindowLength = isAdminResolver.createResolver(
  async (_, { newVal }, { Config }) => {
    isWindowLengthValidCheck(newVal);

    await Config.update({ arrivalWindowLength: newVal }, { where: {}}); // TODO do you need where?

    return newVal;
  }
);

module.exports = updateArrivalWindowLength;
