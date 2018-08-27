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

  if (process.env.NODE_ENV === 'development') app.use('/playground', expressPlayground({ endpoint: '/graphql' }));

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

  app.listen(process.env.PORT, () => console.log('💫  Server ready ' + (process.env.NODE_ENV === 'development' ?  `at http://localhost:` : 'using port ') + process.env.PORT));
};
