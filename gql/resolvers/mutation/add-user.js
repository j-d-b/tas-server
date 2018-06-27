const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { baseResolver } = require('../auth');
const { UserAlreadyInDBError } = require('../../errors');

// TODO move this somewhere else; modularize
function checkPass(password) {
  if (password.length < 6) throw new Error('Password must be at least 6 characters'); // TODO apollo-error
};

// addUser(password: String!, details: AddUserInput!): User
const addUser = baseResolver.createResolver( // TODO how to prevent spam creating users (e.g. a register mutation)
  async (_, { password, details }, { users }) => {
    checkPass(password); // form validation

    if (users.by('email', details.email)) throw new UserAlreadyInDBError({ data: { targetUser: details.email }});

    const encryptedPass = await bcrypt.hash(password, 10);

    return users.insert({
      password: encryptedPass,
      ...details
    });
  }
);

module.exports = addUser;
