const { makeExecutableSchema } = require('graphql-tools');

// scalar
const Hour = require('./schema/hour');
const ISODate = require('./schema/iso-date');

// enum
const ActionType = require('./schema/action-type');
const ContainerSize = require('./schema/container-size');
const DayOfWeek = require('./schema/day-of-week');
const ReminderSetting = require('./schema/reminder-setting');
const RestrictionType = require('./schema/restriction-type');
const UserRole = require('./schema/user-role');

// union
const TypeSpecific = require('./schema/type-specific');

// mutation input types
const MutationInputs = require('./schema/mutation-input-types');

// type
const TimeSlot = require('./schema/time-slot');
const RestrictionTemplate = require('./schema/restriction-template');
const Restriction = require('./schema/restriction');
const Action = require('./schema/action');
const Appt = require('./schema/appt');
const User = require('./schema/user');
const Query = require('./schema/query');
const Mutation = require('./schema/mutation');

const Resolvers = require('./resolvers');

module.exports = makeExecutableSchema({
  typeDefs: [
    Hour,
    ISODate,
    ActionType,
    ContainerSize,
    DayOfWeek,
    ReminderSetting,
    RestrictionType,
    UserRole,
    TypeSpecific,
    TimeSlot,
    RestrictionTemplate,
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
