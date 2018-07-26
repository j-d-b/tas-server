const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlExpress } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;

const sequelize = require('../data/sequelize-connection');
const defineModels = require('../data/define-models');
const schema = require('./gql/schema');

module.exports = () => {
  const app = express();

  app.use(cors()); // TODO is this needed?

  app.use('/graphql', bodyParser.json(), graphqlExpress((req) => {
    return {
      schema: schema,
      context: {
        ...defineModels(sequelize),
        authHeader: req.headers.authorization
      }
    };
  }));

  process.env.NODE_ENV === 'development' && app.use('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.listen(4000, () => console.log('💫  Server ready at http://localhost:4000'));
};
