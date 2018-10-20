/*
Truck appointment system (TAS) GraphQL API
Copyright (C) 2018 Jacob Brady (KCUS, Inc.)

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
const morgan = require('morgan');
const chalk = require('chalk');

const logger = require('./logging/logger');
const sequelize = require('./data/sequelize-config');
const defineModels = require('./data/define-models');
const schema = require('./graphql/schema');

const { NODE_ENV, HOST, PORT } = process.env;
const logConsoleAndInfo = (message) => {
  console.log(chalk.green(message));
  logger.info(message);
};

const app = express();
app.use(bodyParser.json());

logConsoleAndInfo('🌱  Starting the TAS backend GraphQL API server');

const formatString = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" ":referrer" ":user-agent" Authorization: :auth';
morgan.token('auth', req => req.headers.authorization);
app.use(morgan('Request Received: ' + formatString, {
  immediate: true,
  stream: { write: message => logger.info(message.trim()) }
}));
app.use(morgan('Error Response Sent: ' + formatString, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: message => logger.info(message.trim()) }
}));

if (NODE_ENV === 'development') app.use('/playground', playground({ endpoint: '/graphql' }));

app.use('/graphql', graphqlExpress(req => ({
  schema: schema,
  context: {
    ...defineModels(sequelize),
    authHeader: req.headers.authorization
  }
})));

app.listen(PORT, () => {
  logConsoleAndInfo(`🌻  Server ready${NODE_ENV === 'development' ? ` at ${HOST}:` : '; exposing port '}${PORT}`);
});
