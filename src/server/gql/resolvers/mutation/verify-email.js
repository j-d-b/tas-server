const { notLoggedInResolver } = require('../auth');
const { verifyTokenCheck } = require('../checks');

// verifyEmail(verifyToken: String!): String
const verifyEmail = notLoggedInResolver.createResolver(
  async (_, { verifyToken }, { User }) => {
    const targetUser = await verifyTokenCheck(verifyToken, User);

    await User.update({ emailVerified: true }, { where: { email: targetUser.email }});

    return 'Your email address has been successfully verified';
  }
);

module.exports = verifyEmail;
