const { createResolver } = require('apollo-resolvers');
const { createError } = require('apollo-errors');

const { isAuthenticatedResolver, isAdminResolver, isOwnUserResolver } = require('./auth');
const { removeEmpty } = require('/utils');

// queries
const me = isAuthenticatedResolver.createResolver(
  (_, args, { users }) => users.by('email', user.email);
);

const user = isAdminResolver.createResolver(
  (_, args, { users }) => users.by('email', args.email);
);

const users = isAdminResolver.createResolver(
  (_, args, { users }) => users.find(removeEmpty(args));
);

// mutations
const addUser = isOwnUserResolver.createResolver(
  (_, args, { user }) => {
    // add user to db
    // return added user
  }
);

const updateUser = isOwnUserResolver.createResolver(
  (_, args, { user }) => {
    // update user
  }
);

const deleteUser = isAdminResolver.createResolver(
  (_, args, context) => {
    // delete user from db
    // return success string
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
    appts: (user, args, { appts }) => appts.find({ userEmail: user.email });
  }
};
