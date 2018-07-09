const { createResolver } = require('apollo-resolvers');

const { sendVerifyEmailLink } = require.main.require('./email/sendmail');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { sendVerifyEmail } = require('../helpers');
const { MailSendError } = require('../errors');

// confirmUser(email: String!): User
const confirmUser = isAdminResolver.createResolver(
  async (_, { email }, { users, user }) => {
    const targetUser = doesUserExistCheck(email, users);

    const verifyToken = jwt.sign({ userEmail: email }, process.env.VERIFY_EMAIL_SECRET); // NOTE never expires
    const verifyLink = `http://localhost:3000/verify-email/${verifyToken}`; // TODO production link

    try {
      await sendVerifyEmailLink(email, verifyLink);
    } catch (err) {
      throw new MailSendError();
    }

    targetUser.confirmed = true;
    users.update(targetUser);

    return `Account confirmed. Email verification link sent to ${email}`;
  }
);

module.exports = confirmUser;
