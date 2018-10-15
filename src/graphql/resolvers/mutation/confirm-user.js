const { sendAcctConfirmedNotice } = require.main.require('./messaging/email/send-email');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { getVerifyLink } = require('../helpers');
const { MailSendError } = require('../errors');

// confirmUser(input: ConfirmUserInput!): User
const confirmUser = isAdminResolver.createResolver(
  async (_, { input: { email } }, { User }) => {
    const targetUser = await doesUserExistCheck(email, User);
    const verifyLink = getVerifyLink(email);

    try {
      await sendAcctConfirmedNotice(email, { name: targetUser.name.split(' ')[0], verifyLink });
    } catch (err) {
      throw new MailSendError();
    }

    await User.update({ confirmed: true }, { where: { email: email }});

    return `Account confirmed. Email verification link sent to ${email}`;
  }
);

module.exports = confirmUser;
