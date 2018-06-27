const { makeExecutableSchema } = require('graphql-tools');

const ApptType = require('./schema/appt-type');
const UserRole = require('./schema/user-role');
const ContainerSize = require('./schema/container-size');
const TypeDetails = require('./schema/type-details');
const Appointment = require('./schema/appointment');
const User = require('./schema/user');
const Query = require('./schema/query');
const Mutation = require('./schema/mutation');

const Resolvers = require('./resolvers/resolvers');

module.exports = makeExecutableSchema({
  typeDefs: [ ApptType, UserRole, ContainerSize, TypeDetails, Appointment, User, Query, Mutation ],
  resolvers: Resolvers
});
