const jwt = require('jsonwebtoken');

const { sendPassResetLink } = require.main.require('./messaging/email/sendmail');
const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { MailSendError } = require('../errors');

// sendResetPassLink(email: String!): String
const sendResetPassLink = notLoggedInResolver.createResolver(
  async (_, { email }, { User }) => {
    const targetUser = await doesUserExistCheck(email, User);

    const resetToken = jwt.sign({
      userEmail: targetUser.email
    }, targetUser.password, { expiresIn: '30m' }); // use current password hash as secret; single use JWT

    const resetLink = `http://localhost:3000/new-password/${resetToken}`; // TODO for production

    try {
      await sendPassResetLink(email, { name: targetUser.name.split(' ')[0], resetLink }); // IDEA could log this return value
    } catch (err) {
      throw new MailSendError();
    }

    return `Reset password link sent to ${email}`;
  }
);

module.exports = sendResetPassLink;
