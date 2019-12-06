const logger = require('../../../logging/logger');
const { sendEmailChangedNotice } = require('../../../messaging/email/send-email');
const { isAdminResolver } = require('../auth');
const { isRootUserCheck, doesUserExistCheck, userDoesntExistCheck } = require('../checks');

// changeUserEmail(input: ChangeUserEmailInput!): String
const changeUserEmail = isAdminResolver.createResolver(
  async (_, { input: { currEmail, newEmail } }, { User }) => {
    isRootUserCheck(currEmail);

    const targetUser = await doesUserExistCheck(currEmail, User);
    await userDoesntExistCheck(newEmail, User);

    // can't update email (pk) of targetUser directly; see sequelize github issue #5827
    await User.update({ email: newEmail }, { where: { email: currEmail } });

    try {
      await sendEmailChangedNotice(newEmail, { name: targetUser.name, currEmail, newEmail });
      await sendEmailChangedNotice(currEmail, { name: targetUser.name, currEmail, newEmail });
    } catch (err) {
      logger.error(`Email Changed Notice Failed to Send: ${err.stack}`);
    }

    return `User ${currEmail} changed to ${newEmail}`;
  }
);

module.exports = changeUserEmail;
