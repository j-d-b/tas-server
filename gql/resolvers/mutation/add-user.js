const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, doesUserNotExistCheck } = require('../checks');

// TODO implement sendEmailVerification link. Signup alone won't use the addUser mutation
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
