const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { baseResolver } = require('../auth');
const { isAllowedPasswordCheck, doesUserNotExistCheck } = require('../checks');

// TODO implement sendEmailVerification link. Signup alone won't use the addUser mutation
// addUser(password: String!, details: AddUserInput!): User
const addUser = baseResolver.createResolver(
  async (_, { password, details }, { users }) => {
    isAllowedPasswordCheck(password);
    doesUserNotExistCheck(details.email, users);

    return users.insert({
      password: await bcrypt.hash(password, 10),
      confirmed: false,
      ...details
    });
  }
);

module.exports = addUser;
