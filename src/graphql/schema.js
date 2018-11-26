const { makeExecutableSchema } = require('graphql-tools');

// scalar
const Hour = require('./schema/hour');
const ISODate = require('./schema/iso-date');

// enum
const ActionType = require('./schema/action-type');
const ContainerSize = require('./schema/container-size');
const ReminderSetting = require('./schema/reminder-setting');
const UserRole = require('./schema/user-role');
const RestrictionType = require('./schema/restriction-type');

// union
const TypeSpecific = require('./schema/type-specific');

// mutation input types
const MutationInputs = require('./schema/mutation-input-types');

// type
const TimeSlot = require('./schema/time-slot');
const Restriction = require('./schema/restriction');
const Action = require('./schema/action');
const Appt = require('./schema/appt');
const User = require('./schema/user');
const Block = require('./schema/block');
const Query = require('./schema/query');
const Mutation = require('./schema/mutation');

const Resolvers = require('./resolvers');

module.exports = makeExecutableSchema({
  typeDefs: [
    Hour,
    ISODate,
    ActionType,
    ContainerSize,
    ReminderSetting,
    UserRole,
    RestrictionType,
    TypeSpecific,
    TimeSlot,
    Block,
    Restriction,
    Action,
    Appt,
    User,
    ...MutationInputs,
    Query,
    Mutation
  ],
  resolvers: Resolvers
});
