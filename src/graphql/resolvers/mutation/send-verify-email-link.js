const send = require('../../../messaging/email/send-email');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { getVerifyLink } = require('../helpers');
const { MailSendError } = require('../errors');

// sendVerifyEmailLink(input: SendVerifyEmailLinkInput!): String
const sendVerifyEmailLink = isAdminResolver.createResolver(
  async (_, { input: { email } }, { User }) => {
    const { name } = await doesUserExistCheck(email, User);
    const verifyLink = getVerifyLink(email);

    try {
      await send.sendVerifyEmailLink(email, { name: name.split(' ')[0], verifyLink });
    } catch (err) {
      throw new MailSendError();
    }

    return `Email verification link sent to ${email}`;
  }
);

module.exports = sendVerifyEmailLink;
