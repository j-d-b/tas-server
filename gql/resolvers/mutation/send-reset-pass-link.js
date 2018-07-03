const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');

const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');
const { thirtyMinFromNow } = require('../helpers');

// sendResetPassLink(email: String!): String
const sendResetPassLink = notLoggedInResolver.createResolver(
  (_, { email }, { users }) => {
    const targetUser = doesUserExistCheck(email, users);

    const resetToken = jwt.sign({
      exp: thirtyMinFromNow(),
      userEmail: targetUser.email
    }, targetUser.password); // use current password hash as secret; single use JWT

    const resetLink = `http://localhost:3000/new-password/${resetToken}`; // TODO for production

    console.log(resetLink);
    // TODO send link, send success string if successful send
    return resetLink;
  }
);

module.exports = sendResetPassLink;
