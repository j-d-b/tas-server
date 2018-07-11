const bcrypt = require('bcrypt');

const { sendRegistrationRecievedMail } = require.main.require('./server/messaging/sendmail');
const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, doesUserNotExistCheck } = require('../checks');
const { MailSendError } = require('../errors');

// addUser(password: String!, details: AddUserInput!): User
const addUser = baseResolver.createResolver(
  async (_, { password, details }, { users }) => {
    isAllowedPasswordCheck(password);
    doesUserNotExistCheck(details.email, users);

    try {
      await sendRegistrationRecievedMail(details.email);
    } catch (err) {
      throw new MailSendError();
    }

    return bcrypt.hash(password, 10).then(hash => (
      users.insert({
        password: hash,
        confirmed: false,
        emailVerified: false,
        ...details
      })
    ));
  }
);

module.exports = addUser;
