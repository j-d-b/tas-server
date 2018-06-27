const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');
const { createError } = require('apollo-errors');

const { baseResolver, isAuthenticatedResolver, isAdminResolver, isOwnUserResolver } = require('./auth');
const { NoUserInDBError, DeleteSelfError, UserAlreadyInDBError } = require('../errors');
const { removeEmpty } = require('../../utils');

// TODO move this somewhere else; modularize
function checkPass(password) {
  if (password.length < 6) throw new Error('Password must be at least 6 characters'); // TODO apollo-error
};

// queries
const me = isAuthenticatedResolver.createResolver(
  (_, args, { users, user }) => users.by('email', user.userEmail)
);

const user = isAdminResolver.createResolver(
  (_, args, { users }) => users.by('email', args.email) // IDEA currently returns null if no matches, but could require a return and error otherwise..
);

const users = isAdminResolver.createResolver(
  (_, { where }, { users }) => users.find(removeEmpty(where))
);

// mutations
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

const updateUser = isOwnUserResolver.createResolver(
  (_, { email, details }, { users, targetUser }) => {
    Object.entries(details).forEach(([field, val]) => targetUser[field] = val);
    users.update(targetUser);

    return targetUser;
  }
);

const deleteUser = isAdminResolver.createResolver(
  (_, { email }, { users, user }) => {
    if (user.email === email) throw new DeleteSelfError();

    const targetUser = users.by('email', email);
    if (!targetUser) throw new NoUserInDBError({ data: { targetUser: email }});
    users.remove(targetUser);

    return `User ${email} deleted successfully`;
  }
);

module.exports = {
  Query: {
    me,
    user,
    users
  },
  Mutation: {
    addUser,
    updateUser,
    deleteUser
  },
  User: {
    appts: (user, args, { appts }) => appts.find({ userEmail: user.email })
  }
};
