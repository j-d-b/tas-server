const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, doesUserExistCheck } = require('../checks');

// addUser(password: String!, details: AddUserInput!): User
const addUser = baseResolver.createResolver( // TODO how to prevent spam creating users (e.g. a register mutation)
  async (_, { password, details }) => {
    isAllowedPasswordCheck(password);
    doesUserExistCheck(details.email);

    return users.insert({
      password: await bcrypt.hash(password, 10),
      ...details
    });
  }
);

module.exports = addUser;
