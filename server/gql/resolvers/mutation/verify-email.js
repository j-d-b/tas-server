const { notLoggedInResolver } = require('../auth');
const { verifyTokenCheck } = require('../checks');
const { signJwt } = require('../helpers');

// verifyEmail(verifyToken: String!): String
const verifyEmail = notLoggedInResolver.createResolver(
  async (_, { verifyToken }, { User }) => {
    const targetUser = await verifyTokenCheck(verifyToken, User);

    await User.update({ emailVerified: true }, { where: { email: targetUser.email }});

    return signJwt(targetUser); // logs in on verification
  }
);

module.exports = verifyEmail;
