const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const { graphqlExpress } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;

const { schema } = require('./schema');
const { initAppts } = require('./db-utils'); // setup collections in database

exports.startServer = (db) => {
  const appts = db.getCollection('appointments', { unique: ['id'] }) || initAppts(db);

  const app = express();

  app.use(cors());
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema, context: appts }));
  app.use('/playground', expressPlayground({ endpoint: '/graphql' }));

  app.get('/test', (req, res) => res.json({ test: 'hello' }));

  app.listen(4000, () => console.log('🚀  Server ready at http://localhost:4000'));
}
