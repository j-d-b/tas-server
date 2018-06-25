const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');
const { createError } = require('apollo-errors');

const { isAuthenticatedResolver, isAdminResolver, isOwnUserResolver } = require('./auth');
const { removeEmpty } = require('../../utils');

// queries
const me = isAuthenticatedResolver.createResolver(
  (_, args, { users }) => users.by('email', user.email)
);

const user = isAdminResolver.createResolver(
  (_, args, { users }) => users.by('email', args.email)
);

const users = isAdminResolver.createResolver(
  (_, args, { users }) => users.find(removeEmpty(args))
);

// mutations
const checkPass = (password) => {
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
};

const addUser = isOwnUserResolver.createResolver(
  async (_, { password, details }, { users, user }) => {
    checkPass(args.password); // form validation

    if (users.by('email', details.email)) throw new Error(`User with email ${email} already exists`); // TODO convert to apollo-error

    const encryptedPass = await bcrypt.hash(password, 10);

    return users.insert({
      password: encryptedPass,
      ...details
    });
  }
);

const updateUser = isOwnUserResolver.createResolver(
  (_, { email, details }, { user }) => {
    const targetUser = users.by('email', email);
    if (!targetUser) throw new Error(`User ${email} does not exist`);

    Object.entries(details).forEach(([field, val]) => targetUser[field] = val);
    users.update(targetUser);

    return targetUser;
  }
);

const deleteUser = isAdminResolver.createResolver(
  (_, { email }, { users, user }) => {
    if (user.email === email) throw new Error('You cannot delete yourself'); // TODO convert to apollo-errors

    const targetUser = users.by('email', email);
    if (!targetUser) throw new Error(`User ${email} does not exist`);
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
