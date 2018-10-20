const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(info => `${info.level} (${info.timestamp}): ${info.message}`)
  ),
  transports:[
    new transports.File({ filename: 'src/logging/logs/combined.log', level: 'info' }),
    new transports.File({ filename: 'src/logging/logs/errors.log', level: 'error' }),
    new transports.File({ filename: 'src/logging/logs/verbose.log', level: 'verbose' }),
    new transports.Console({ level: process.env.NODE_ENV === 'production' ? 'error' : 'info' })
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: 'src/logging/logs/exceptions.log' })
  ]
});

module.exports = logger;
