const { createResolver } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { sendVerifyEmail } = require('../helpers');

// confirmUser(email: String!): User
const confirmUser = isAdminResolver.createResolver(
  async (_, { email }, { users, user }) => {
    const targetUser = doesUserExistCheck(email, users);

    await sendVerifyEmail(email);

    targetUser.confirmed = true;
    users.update(targetUser);

    return `Account confirmed. Email verification link sent to ${email}`;
  }
);

module.exports = confirmUser;
