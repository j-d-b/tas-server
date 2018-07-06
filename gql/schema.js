const { makeExecutableSchema } = require('graphql-tools');

const ApptType = require('./schema/appt-type');
const UserRole = require('./schema/user-role');
const ContainerSize = require('./schema/container-size');
const TypeDetails = require('./schema/type-details');
const Appt = require('./schema/appt');
const User = require('./schema/user');
const Block = require('./schema/block');
const Query = require('./schema/query');
const Mutation = require('./schema/mutation');

const Resolvers = require('./resolvers/resolvers');

module.exports = makeExecutableSchema({
  typeDefs: [
    ApptType,
    UserRole,
    ContainerSize,
    TypeDetails,
    Appt,
    User,
    Block,
    Query,
    Mutation
  ],
  resolvers: Resolvers
});
