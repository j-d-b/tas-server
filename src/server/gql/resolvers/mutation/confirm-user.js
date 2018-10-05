const { sendAcctConfirmedNotice } = require.main.require('./messaging/email/send-email');
const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { getVerifyLink } = require('../helpers');
const { MailSendError } = require('../errors');

// confirmUser(email: String!): User
const confirmUser = isAdminResolver.createResolver(
  async (_, { email }, { User }) => {
    const targetUser = await doesUserExistCheck(email, User);
    const verifyLink = getVerifyLink(email);

    // IDEA mail sending and updating the user could be concurrent, with Promise.all
    try {
      await sendAcctConfirmedNotice(email, { name: targetUser.name.split(' ')[0], verifyLink });
    } catch (err) {
      throw new MailSendError();
    }

    await User.update({ confirmed: true }, { where: { email: email }});

    return `Account confirmed. Email verification link sent to ${email}`;
  }
);

module.exports = confirmUser;
