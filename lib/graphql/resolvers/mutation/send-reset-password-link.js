const jwt = require('jsonwebtoken');

const { sendPassResetLink } = require('../../../messaging/email/send-email');
const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { EmailSendError } = require('../errors');

// sendResetPasswordLink(input: SendResetPasswordLinkInput!): String
const sendResetPasswordLink = notLoggedInResolver.createResolver(
  async (_, { input: { email } }, { User }) => {
    const targetUser = await doesUserExistCheck(email, User);

    const resetToken = jwt.sign({
      userEmail: targetUser.email
    }, targetUser.password, { expiresIn: '24h' }); // use current password hash as secret; single use JWT

    const resetLink = `${process.env.WEB_APP_URL}/reset-password/${resetToken}`;

    try {
      await sendPassResetLink(email, { name: targetUser.name, resetLink });
    } catch (err) {
      throw new EmailSendError();
    }

    return `Reset password link sent to ${email}`;
  }
);

module.exports = sendResetPasswordLink;
