const express = require('express');
const { ApolloServer } = require('apollo-server');
const { registerServer } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;

const { typeDefs, resolvers } = require('./schema.js');
const { initAppts } = require('./db-utils.js'); // setup collections in database

exports.startServer = (db) => {
  const appts = db.getCollection('appointments', { unique: ['id'] }) || initAppts(db);
  const gqlServer = new ApolloServer({ typeDefs, resolvers, context: appts });

  const app = express();

  app.get('/test', (req,res) => {
    res.json({test: 'hello'});
  });

  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  registerServer({ gqlServer, app });

  gqlServer.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  });

  //app.listen(4000, () => console.log('🚀  Server ready at port 4000'));
}
