const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const playground = require('graphql-playground-middleware-express').default;
const cookieParser = require('cookie-parser');
const cors = require('cors');

const models = require('./data/models');
const schema = require('./graphql/schema');
const authToken = require('./rest/auth-token');

const { WEB_APP_URL, NODE_ENV } = process.env;

const server = express();

server.use(bodyParser.json());
server.use(cookieParser());
server.use(cors({
  origin: WEB_APP_URL,
  credentials: true
}));

// graphql playground for development mode
if (NODE_ENV === 'development') server.use('/playground', playground({ endpoint: '/graphql' }));

// use this endpoint to get a new auth token using the refreshToken in cookie
server.use('/auth-token', (req, res, next) => {
  Promise.resolve(authToken(req, res, models.User)).catch(next);
});

// attaches data models to the context, for use in resolvers
server.use('/graphql', graphqlExpress((req, res) => ({
  schema: schema,
  context: {
    req,
    res,
    ...models,
    authHeader: req.headers.authorization
  }
})));

module.exports = server;
