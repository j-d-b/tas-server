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
  }

  type Query {
    appt(id: ID!): Appointment
    appts(user: String, time: String, block: String, type: String): [Appointment]
    me: User
  }

  type Mutation {
    addAppt(user: String, time: String, block: String, type: String): Appointment
    delAppt(id: ID!): String
    updateAppt(id: ID!, user: String, time: String, block: String, type: String): Appointment
    signup (email: String!, password: String!): String
    login (email: String!, password: String!): String
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
