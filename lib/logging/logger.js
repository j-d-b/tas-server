const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(info => `${info.level} (${info.timestamp}): ${info.message}`)
  ),
  transports:[
    new transports.File({ filename: 'logs/combined.log', level: 'info' }),
    new transports.File({ filename: 'logs/errors.log', level: 'error' }),
    new transports.Console({ level: 'info' }) 
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});

module.exports = logger;
