const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;

const sequelize = require('../data/sequelize-config');
const defineModels = require('../data/define-models');
const schema = require('./graphql/schema');

const { NODE_ENV, PORT } = process.env;

module.exports = () => {
  const app = express();

  if (NODE_ENV === 'development') app.use('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.use('/graphql', bodyParser.json(), graphqlExpress(req => (
    {
      schema: schema,
      context: {
        ...defineModels(sequelize),
        authHeader: req.headers.authorization
      }
    }
  )));

  app.listen(PORT, () => {
    console.log('💫  Server ready'
      + (NODE_ENV === 'development' ? ' at http://localhost:' : '; exposing port ')
      + PORT
    );
  });
};
