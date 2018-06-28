const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');

const { notLoggedInResolver } = require('../auth');
const { NoUserInDBError } = require('../errors');
const { thirtyMinFromNow } = require('../helpers');

// sendResetPassLink(email: String!): String
const sendResetPassLink = notLoggedInResolver.createResolver(
  (_, { email }, { users }) => {
    const targetUser = users.by('email', email);
    if (!targetUser) throw new NoUserInDBError({ data: { targetUser: email }});

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
