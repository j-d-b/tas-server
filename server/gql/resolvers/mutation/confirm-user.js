const jwt = require('jsonwebtoken');

const { sendAcctConfirmedNotice } = require.main.require('./server/messaging/sendmail');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { MailSendError } = require('../errors');

// confirmUser(email: String!): User
const confirmUser = isAdminResolver.createResolver(
  async (_, { email }, { users }) => {
    const targetUser = doesUserExistCheck(email, users);

    const verifyToken = jwt.sign({ userEmail: email }, process.env.VERIFY_EMAIL_SECRET); // NOTE never expires
    const verifyLink = `http://localhost:3000/verify-email/${verifyToken}`; // TODO production link

    try {
      await sendAcctConfirmedNotice(email, { name: targetUser.name, verifyLink });
    } catch (err) {
      console.log(err);
      throw new MailSendError();
    }

    targetUser.confirmed = true;
    users.update(targetUser);

    return `Account confirmed. Email verification link sent to ${email}`;
  }
);

module.exports = confirmUser;
