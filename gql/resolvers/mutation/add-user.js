const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, doesUserNotExistCheck } = require('../checks');

// IDEA how to prevent spam creating users (e.g. a register mutation)
// addUser(password: String!, details: AddUserInput!): User
const addUser = baseResolver.createResolver(
  async (_, { password, details }) => {
    isAllowedPasswordCheck(password);
    doesUserNotExistCheck(details.email);

    return users.insert({
      password: await bcrypt.hash(password, 10),
      ...details
    });
  }
);

module.exports = addUser;
