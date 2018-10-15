const { notLoggedInResolver } = require('../auth');
const { verifyTokenCheck } = require('../checks');
const { signJwt } = require('../helpers');

// verifyEmail(input: VerifyEmailInput!): String
const verifyEmail = notLoggedInResolver.createResolver(
  async (_, { input: { verifyToken } }, { User }) => {
    const targetUser = await verifyTokenCheck(verifyToken, User);

    await targetUser.update({ emailVerified: true });

    return signJwt(targetUser);
  }
);

module.exports = verifyEmail;
