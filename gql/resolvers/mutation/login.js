const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');

const { notLoggedInResolver } = require('../auth');
const { NoUserInDBError, IncorrectPasswordError } = require('../errors');
const { twelveHrFromNow } = require('../helpers');

// check if not already logged in
// check if email matches a user in the database
// check password is correct
// return a signed jwt

// login(email: String!, password: String!): String
const login = notLoggedInResolver.createResolver(
  async (_, { email, password }, { users }) => {
    const user = users.by('email', email);
    if (!user) throw new NoUserInDBError({ data: { targetUser: email }});

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new IncorrectPasswordError();

    return jwt.sign({
      exp: twelveHrFromNow(),
      userEmail: user.email,
      userRole: user.role
    }, process.env.JWT_SECRET);
  }
);

module.exports = login;
