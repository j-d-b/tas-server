const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const { graphqlExpress } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;

const schema = require('./schema');

module.exports = (db) => {
  const appts = db.getCollection('appointments', { unique: ['id'] });
  const users = db.getCollection('users', { unique: ['email'] });

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  // NOTE doesn't return errors to the GraphQL client...
  // perhaps implement within resolvers
  const authMiddleware = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false
  });

  app.use('/graphql', authMiddleware, graphqlExpress(req => {
    return {
      schema: schema,
      context: { db: db, appts: appts, users: users, user: req.user }
    }
  }));

  app.use('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.listen(4000, () => console.log('🚀  Server ready at http://localhost:4000'));
};
