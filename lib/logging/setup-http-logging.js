const morgan = require('morgan');

const logger = require('./logger');

module.exports = (app) => {
  const formatString = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" ":referrer" ":user-agent" Authorization: :auth';
  morgan.token('auth', req => req.headers.authorization);
  app.use(morgan('Request Received: ' + formatString, {
    immediate: true,
    stream: { write: message => logger.info(message.trim()) }
  }));
  app.use(morgan('Error Response Sent: ' + formatString, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: message => logger.error(message.trim()) }
  }));
};
