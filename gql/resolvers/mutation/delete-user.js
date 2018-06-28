const { createResolver } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { NoUserInDBError, DeleteSelfError } = require('../errors');

// deleteUser(email: String!): String
const deleteUser = isAdminResolver.createResolver(
  (_, { email }, { users, user }) => {
    if (user.email === email) throw new DeleteSelfError();

    const targetUser = users.by('email', email);
    if (!targetUser) throw new NoUserInDBError({ data: { targetUser: email }});
    users.remove(targetUser);

    return `User ${email} deleted successfully`;
  }
);

module.exports = deleteUser;
