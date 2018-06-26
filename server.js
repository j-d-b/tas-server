const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlExpress } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;

const schema = require('./gql/schema');

module.exports = db => {
  const apptsCollection = db.getCollection('appointments');
  const usersCollection = db.getCollection('users');

  const app = express();

  app.use(cors()); // TODO is this needed
  app.use(bodyParser.json());

  app.use('/graphql', graphqlExpress(req => {
    return {
      schema: schema,
      context: {
        appts: apptsCollection,
        users: usersCollection,
        authHeader: req.headers.authorization
      }
    }
  }));

  process.env.NODE_ENV === 'development' && app.use('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.listen(4000, () => console.log('🚀  Server ready at http://localhost:4000'));
};
