const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');

const { sendResetLink } = require.main.require('./email/sendmail');
const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { MailSendError } = require('../errors');

// sendResetPassLink(email: String!): String
const sendResetPassLink = notLoggedInResolver.createResolver(
  async (_, { email }, { users }) => {
    const targetUser = doesUserExistCheck(email, users);

    const resetToken = jwt.sign({
      userEmail: targetUser.email
    }, targetUser.password, { expiresIn: '30m' }); // use current password hash as secret; single use JWT

    const resetLink = `http://localhost:3000/new-password/${resetToken}`; // TODO for production

    try {
      await sendResetLink(email, resetLink); // IDEA could log this return value
    } catch (err) {
      throw new MailSendError();
    }

    return `Reset password link sent to ${email}`;
  }
);

module.exports = sendResetPassLink;
