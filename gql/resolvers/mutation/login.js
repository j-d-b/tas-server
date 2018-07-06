const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');

const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck, isUserConfirmedCheck, isCorrectPasswordCheck } = require('../checks');
const { twelveHrFromNow } = require('../helpers');

// login(email: String!, password: String!): String
const login = notLoggedInResolver.createResolver(
  async (_, { email, password }, { users }) => {
    const targetUser = doesUserExistCheck(email, users);

    isUserConfirmedCheck(targetUser);

    await isCorrectPasswordCheck(password, targetUser);

    return jwt.sign({
      exp: twelveHrFromNow(),
      userEmail: targetUser.email,
      userRole: targetUser.role
    }, process.env.JWT_SECRET);
  }
);

module.exports = login;
