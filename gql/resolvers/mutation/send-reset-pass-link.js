const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');

const { sendResetLink } = require('../../../sendmail');
const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { thirtyMinFromNow } = require('../helpers');
const { MailSendError } = require('../errors');

// sendResetPassLink(email: String!): String
const sendResetPassLink = notLoggedInResolver.createResolver(
  async (_, { email }, { users }) => {
    const targetUser = doesUserExistCheck(email, users);

    const resetToken = jwt.sign({
      exp: thirtyMinFromNow(),
      userEmail: targetUser.email
    }, targetUser.password); // use current password hash as secret; single use JWT

    const resetLink = `http://localhost:3000/new-password/${resetToken}`; // TODO for production

    try {
      await sendResetLink(email, resetLink); // IDEA could log this return value
      return `Reset password link sent to ${email}`;
    } catch (err) {
      throw new MailSendError();
    }
  }
);

module.exports = sendResetPassLink;
