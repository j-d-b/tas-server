const makeDir = require('make-dir');

const server = require('./server');
const logger = require('./logging/logger');
const setupHttpLogging = require('./logging/setup-http-logging');

const { NODE_ENV, PORT } = process.env;

// setup logging
makeDir.sync('logs/');
setupHttpLogging(server);

// start the server
logger.info('🌱  Starting the TAS backend GraphQL API server');

server.listen(PORT, () => {
  logger.info(`🌻  Server ready${NODE_ENV === 'development' ? ' at http://localhost:' : '; exposing port '}${PORT}`);
});