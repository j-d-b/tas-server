const logger = require('../../../logging/logger');
const { sendEmailChangedNotice } = require('../../../messaging/email/send-email');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, userDoesntExistCheck } = require('../checks');
const { getFirstName } = require('../helpers');

// changeUserEmail(input: ChangeUserEmailInput!): String
const changeUserEmail = isAdminResolver.createResolver(
  async (_, { input: { currEmail, newEmail } }, { User }) => {
    const targetUser = await doesUserExistCheck(currEmail, User);
    await userDoesntExistCheck(newEmail, User);

    // can't update email (pk) of targetUser directly; see sequelize github issue #5827
    await User.update({ email: newEmail }, { where: { email: currEmail } });

    try {
      await sendEmailChangedNotice(newEmail, { name: getFirstName(targetUser), currEmail, newEmail });
      await sendEmailChangedNotice(currEmail, { name: getFirstName(targetUser), currEmail, newEmail });
    } catch (err) {
      logger.error(`Email Changed Notice Failed to Send: ${err.stack}`);
    }

    return `User ${currEmail} changed to ${newEmail}`;
  }
);

module.exports = changeUserEmail;
