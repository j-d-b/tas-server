const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');

const { notLoggedInResolver } = require('./auth');
const { InvalidOrExpiredLinkError } = require('../errors');

const checkPass = (password) => { //
  if (password.length < 6) throw new Error('Password must be at least 6 characters'); // TODO
};

// resetPassword(token: String!, newPassword: String!): String
const resetPassword = notLoggedInResolver.createResolver(
  async (_, { token, newPassword }, { users }) => {
    checkPass(newPassword); // form validation

    let targetUser;
    try {
      targetUser = users.by('email', jwt.decode(token).userEmail);
      jwt.verify(token, targetUser.password); // current password hash is secret key
    } catch (err) {
      throw new InvalidOrExpiredLinkError();
    }

    targetUser.password = await bcrypt.hash(newPassword, 10);

    return 'Password updated successfully';
  }
);

module.exports = resetPassword;
