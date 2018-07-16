const { sendAcctConfirmedNotice } = require.main.require('./server/messaging/sendmail');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { getVerifyLink } = require('../helpers');
const { MailSendError } = require('../errors');

// confirmUser(email: String!): User
const confirmUser = isAdminResolver.createResolver(
  async (_, { email }, { users }) => {
    const targetUser = doesUserExistCheck(email, users);
    const verifyLink = getVerifyLink(email);

    try {
      await sendAcctConfirmedNotice(email, { name: targetUser.name.split(' ')[0], verifyLink });
    } catch (err) {
      throw new MailSendError();
    }

    targetUser.confirmed = true;
    users.update(targetUser);

    return `Account confirmed. Email verification link sent to ${email}`;
  }
);

module.exports = confirmUser;
