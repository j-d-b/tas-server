const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');

const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck, isUserConfirmedCheck, isUserEmailVerifiedCheck, isCorrectPasswordCheck } = require('../checks');
const { signJwt } = require('../helpers');

// login(email: String!, password: String!): String
const login = notLoggedInResolver.createResolver(
  async (_, { email, password }, { users }) => {
    const targetUser = doesUserExistCheck(email, users);

    isUserConfirmedCheck(targetUser);
    isUserEmailVerifiedCheck(targetUser);
    await isCorrectPasswordCheck(password, targetUser);

    return signJwt(targetUser);
  }
);

module.exports = login;
