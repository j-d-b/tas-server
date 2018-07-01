const bcrypt = require('bcrypt');
const { createResolver, and } = require('apollo-resolvers');

const { isAllowedPasswordResolver, doesUserNotExistResolver } = require('../auth');
const { UserAlreadyInDBError } = require('../errors');

// check if password is allowable
// check if user details.email already exists in db
// add user to db

// addUser(password: String!, details: AddUserInput!): User
const addUser = and(isAllowedPasswordResolver, doesUserNotExistResolver)( // TODO how to prevent spam creating users (e.g. a register mutation)
  async (_, { password, details }) => {
    return users.insert({
      password: await bcrypt.hash(password, 10),
      ...details
    });
  }
);

module.exports = addUser;
