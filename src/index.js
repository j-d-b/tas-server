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
const expressPlayground = require('graphql-playground-middleware-express').default;

const sequelize = require('./data/sequelize-config');
const defineModels = require('./data/define-models');
const schema = require('./graphql/schema');

console.log('🌻  Starting the TAS backend GraphQL API server');

const { NODE_ENV, PORT } = process.env;
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
