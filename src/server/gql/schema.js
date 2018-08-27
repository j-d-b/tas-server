const { makeExecutableSchema } = require('graphql-tools');

const Hour = require('./schema/hour');
const ISODate = require('./schema/iso-date');
const ApptType = require('./schema/appt-type');
const UserRole = require('./schema/user-role');
const ContainerSize = require('./schema/container-size');
const TypeDetails = require('./schema/type-details');
const TimeSlot = require('./schema/time-slot');
const AllowedAppts = require('./schema/allowed-appts');
const Appt = require('./schema/appt');
const User = require('./schema/user');
const Block = require('./schema/block');
const Query = require('./schema/query');
const Mutation = require('./schema/mutation');

const Resolvers = require('./resolvers/resolvers');

module.exports = makeExecutableSchema({
  typeDefs: [
    Hour,
    ISODate,
    ApptType,
    UserRole,
    ContainerSize,
    TypeDetails,
    TimeSlot,
    AllowedAppts,
    Appt,
    User,
    Block,
    Query,
    Mutation
  ],
  resolvers: Resolvers
});
