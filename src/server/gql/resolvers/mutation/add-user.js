const bcrypt = require('bcrypt');

const { sendSignupReceivedNotice } = require.main.require('./messaging/email/sendmail');
const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, doesUserNotExistCheck } = require('../checks');
const { MailSendError } = require('../errors');

// addUser(password: String!, details: AddUserInput!): User
const addUser = baseResolver.createResolver(
  async (_, { password, details }, { User }) => {
    isAllowedPasswordCheck(password);
    await doesUserNotExistCheck(details.email, User);

    const hash = await bcrypt.hash(password, 10);
    await User.create({ password: hash, ...details });

    // IDEA mail sending and creating the user could be concurrent, with Promise.all
    try {
      await sendSignupReceivedNotice(details.email, { name: details.name.split(' ')[0] });
    } catch (err) {
      throw new MailSendError();
    }

    return User.findById(details.email);
  }
);

module.exports = addUser;
