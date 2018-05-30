const { makeExecutableSchema } = require('graphql-tools');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const { saveDb } = require('./db-utils');
const { removeEmpty } = require('./utils');

const typeDefs = `
  type Appointment {
    id: ID!
    user: String
    time: String
    block: String
    type: String
  }

  type Query {
    appt(id: ID!): Appointment
    appts(user: String, time: String, block: String, type: String): [Appointment]
  }

  type Mutation {
    addAppt(user: String, time: String, block: String, type: String): Appointment
    delAppt(id: ID!): Appointment
    updateAppt(id: ID!, user: String, time: String, block: String, type: String): Appointment
  }
`;


// appts collection in database given as context
const resolvers = {
  Query: {
    appts: (root, args, { appts, user }) => {
      if (!user) {
        throw new Error('You are not authorized!');
      }
      console.log(user.email);
      return appts.find(removeEmpty(args));
    },
    appt: (root, { id }) => appts.by('id', id)
  },
  Mutation: {
    addAppt: (root, args, appts) => {
      const newAppt = appts.insert(args);
      newAppt.id = newAppt.$loki; // use $loki as ID
      appts.update(newAppt);
      saveDb(db);
      return newAppt;
    },
    updateAppt: (root, { id, user, time, block, type }, appts) => { // update appt by id
      const targetAppt = appts.by('id', id);
      user && (targetAppt.user = user);
      time && (targetAppt.time = time);
      block && (targetAppt.block = block);
      type && (targetAppt.type = type);
      appts.update(targetAppt);
      saveDb(db);
      return targetAppt;
    },
    delAppt: (root, { id }, appts) => {
      appts.remove(appts.by('id', id));
      saveDb(db);
    }
  }
};

module.exports.schema = makeExecutableSchema({ typeDefs, resolvers });
