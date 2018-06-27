const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');
const { IncorrectPasswordError } = require('../../errors');

// THIS IS IN users.js and reset-password.js as well! Modularize!
const checkPass = (password) => { //
  if (password.length < 6) throw new Error('Password must be at least 6 characters'); // TODO apolo errorize
};

// changePassword(newPassword: String!, currPassword: String!): String
const changePassword = isAuthenticatedResolver.createResolver(
  async (obj, { currPassword, newPassword }, { users, user }) => {
    checkPass(newPassword); // form validation

    const userInDb = users.by('email', user.userEmail);
    const valid = await bcrypt.compare(currPassword, userInDb.password);
    if (!valid) throw new IncorrectPasswordError();

    return bcrypt.hash(newPassword, 10).then(hash => {
      userInDb.password = hash;
      users.update(userInDb);
      return 'Password updated successfully';
    });
  }
);

module.exports = changePassword;
