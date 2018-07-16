const send = require.main.require('./server/messaging/sendmail');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { getVerifyLink } = require('../helpers');
const { MailSendError } = require('../errors');

// sendVerifyEmailLink(email: String!): String
const sendVerifyEmailLink = isAdminResolver.createResolver(
  async (_, { email }, { users }) => {
    const targetUser = doesUserExistCheck(email, users);
    const verifyLink = getVerifyLink(email);

    try {
      await send.sendVerifyEmailLink(email, { name: targetUser.name.split(' ')[0], verifyLink });
    } catch (err) {
      throw new MailSendError();
    }

    return `Email verification link sent to ${email}`;
  }
);

module.exports = sendVerifyEmailLink;
