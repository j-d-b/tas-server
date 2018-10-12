const { isAdminResolver } = require('../auth');
const { isWindowLengthValidCheck } = require('../checks');

// updateArrivalWindowLength(input: UpdateArrivalWindowLengthInput): Block
const updateArrivalWindowLength = isAdminResolver.createResolver(
  async (_, { input: { windowLength } }, { Config }) => {
    isWindowLengthValidCheck(windowLength);

    await Config.update({ arrivalWindowLength: windowLength }, { where: {}}); // TODO do I even need where?

    return windowLength;
  }
);

module.exports = updateArrivalWindowLength;
