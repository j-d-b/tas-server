const { createResolver } = require('apollo-resolvers');

const { notLoggedInResolver } = require('../auth');
const { verifyTokenCheck } = require('../checks');
const { signJwt } = require('../helpers');

// verifyEmail(verifyToken: String!): String
const verifyEmail = notLoggedInResolver.createResolver(
  (_, { verifyToken }, { users }) => {
    const targetUser = verifyTokenCheck(verifyToken, users);
    targetUser.emailVerified = true;
    users.update(targetUser);
    return signJwt(targetUser); // logs in on verification
  }
);

module.exports = verifyEmail;
