const send = require('../../../messaging/email/send-email');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { getVerifyLink } = require('../helpers');
const { EmailSendError } = require('../errors');

// sendVerifyEmailLink(input: SendVerifyEmailLinkInput!): String
const sendVerifyEmailLink = isAdminResolver.createResolver(
  async (_, { input: { email } }, { User }) => {
    const targetUser = await doesUserExistCheck(email, User);
    const verifyLink = getVerifyLink(email);

    try {
      await send.sendVerifyEmailLink(email, { name: targetUser.name, verifyLink });
    } catch (err) {
      throw new EmailSendError();
    }

    return `Email verification link sent to ${email}`;
  }
);

module.exports = sendVerifyEmailLink;
