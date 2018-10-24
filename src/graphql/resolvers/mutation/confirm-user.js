const { sendAcctConfirmedNotice } = require('../../../messaging/email/send-email');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { getVerifyLink, getFirstName } = require('../helpers');
const { EmailSendError } = require('../errors');

// confirmUser(input: ConfirmUserInput!): User
const confirmUser = isAdminResolver.createResolver(
  async (_, { input: { email } }, { User }) => {
    const targetUser = await doesUserExistCheck(email, User);
    const verifyLink = getVerifyLink(email);

    try {
      await sendAcctConfirmedNotice(email, { name: getFirstName(targetUser), verifyLink });
    } catch (err) {
      throw new EmailSendError();
    }

    await User.update({ confirmed: true }, { where: { email: email }});

    return `Account confirmed. Email verification link sent to ${email}`;
  }
);

module.exports = confirmUser;
