const bcrypt = require('bcrypt');

const { sendSignupReceivedNotice } = require('../../../messaging/email/send-email');
const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, userDoesntExistCheck } = require('../checks');
const { MailSendError } = require('../errors');

// addUser(input: AddUserInput!): User
const addUser = baseResolver.createResolver(
  async (_, { input }, { User }) => {
    isAllowedPasswordCheck(input.password);
    await userDoesntExistCheck(input.email, User);

    try {
      await sendSignupReceivedNotice(input.email, { name: input.name.split(' ')[0] });
    } catch (err) {
      throw new MailSendError();
    }

    const hash = await bcrypt.hash(input.password, 10);
    await User.create({ password: hash, ...input });

    return User.findById(input.email);
  }
);

module.exports = addUser;
