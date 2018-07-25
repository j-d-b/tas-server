const bcrypt = require('bcrypt');

const { sendSignupReceivedNotice } = require.main.require('./server/messaging/sendmail');
const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, doesUserNotExistCheck } = require('../checks');
const { MailSendError } = require('../errors');

// addUser(password: String!, details: AddUserInput!): User
const addUser = baseResolver.createResolver(
  async (_, { password, details }, { User }) => {
    isAllowedPasswordCheck(password);
    await doesUserNotExistCheck(details.email, User);

    const firstName = details.name.split(' ')[0];

    return sendSignupReceivedNotice(details.email, { name: firstName }).catch(err => {
      throw new MailSendError();
    }).then(() => (
      bcrypt.hash(password, 10)
    )).then(hash => User.create({ password: hash, ...details }));
  }
);

module.exports = addUser;
