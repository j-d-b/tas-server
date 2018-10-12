const bcrypt = require('bcrypt');

const { sendSignupReceivedNotice } = require.main.require('./messaging/email/send-email');
const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, doesUserNotExistCheck } = require('../checks');
const { MailSendError } = require('../errors');

// addUser(input: AddUserInput!): User
const addUser = baseResolver.createResolver(
  async (_, { input }, { User }) => {
    isAllowedPasswordCheck(input.password);
    await doesUserNotExistCheck(input.email, User);

    const hash = await bcrypt.hash(input.password, 10);
    await User.create({ password: hash, ...input });

    // IDEA mail sending and creating the user could be concurrent, with Promise.all
    try {
      await sendSignupReceivedNotice(input.email, { name: input.name.split(' ')[0] });
    } catch (err) {
      throw new MailSendError();
    }

    return User.findById(input.email);
  }
);

module.exports = addUser;