const { isAdminResolver } = require('../auth');
const { isWindowLengthValidCheck } = require('../checks');

// updateArrivalWindowLength(input: UpdateArrivalWindowLengthInput): Int
const updateArrivalWindowLength = isAdminResolver.createResolver(
  async (_, { input: { windowLength } }, { Config }) => {
    isWindowLengthValidCheck(windowLength);
    const config = await Config.findOne();
    await config.update({ arrivalWindowLength: windowLength });
    return windowLength;
  }
);

module.exports = updateArrivalWindowLength;
