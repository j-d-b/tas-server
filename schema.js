const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers');

const typeDefs = `
  type Appointment {
    id: ID!
    user: String
    time: String
    block: String
    type: String
  }

  type User {
    email: ID!
    role: String!
    name: String!
    company: String
    mobileNumber: String
  }

  type Query {
    appt(id: ID!): Appointment
    appts(user: String, time: String, block: String, type: String): [Appointment]
    me: User
    users: [User]
  }

  input userDetails {
    name: String!
    company: String!
    role: String
    mobileNumber: String
  }

  input ApptDetails {
    user: String
    time: String
    block: String
    type: String
  }

  type Mutation {
    addAppt(apptDetails: ApptDetails!): Appointment
    delAppt(id: ID!): String
    updateAppt(id: ID!, apptDetails: ApptDetails!): Appointment
    addUser(email: ID!, password: String!, userDetails: userDetails!): String
    changePassword(email: ID!, currPassword: String!, newPassword: String!): String
    login(email: ID!, password: String!): String
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
