/*
Truck appointment system (TAS) GraphQL API
Copyright (C) 2019 Jacob Brady (KCUS, Inc.)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see https://www.gnu.org/licenses/gpl-3.0.en.html.
*/
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const playground = require('graphql-playground-middleware-express').default;
const cookieParser = require('cookie-parser');
const cors = require('cors');

const models = require('./data/models');
const schema = require('./graphql/schema');
const authToken = require('./rest/auth-token');

const { NODE_ENV } = process.env;

const server = express();

server.use(bodyParser.json());
server.use(cookieParser());
server.use(cors());

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
