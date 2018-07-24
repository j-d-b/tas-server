const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck, isUserConfirmedCheck, isUserEmailVerifiedCheck, isCorrectPasswordCheck } = require('../checks');
const { signJwt } = require('../helpers');

// login(email: String!, password: String!): String
const login = notLoggedInResolver.createResolver(
  async (_, { email, password }, { User }) => {
    //const targetUser = doesUserExistCheck(email, users);

    //isUserConfirmedCheck(targetUser);
    //isUserEmailVerifiedCheck(targetUser);
    //await isCorrectPasswordCheck(password, targetUser);
    const targetUser = await User.findById(email);
    return signJwt(targetUser);
  }
);

module.exports = login;
