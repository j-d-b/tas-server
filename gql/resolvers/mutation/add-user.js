const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { baseResolver } = require('../auth');
const { checkPass } = require('../helpers');
const { UserAlreadyInDBError } = require('../errors');

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
