/*
Truck appointment system (TAS) GraphQL API
Copyright (C) 2019 KCUS, Inc.

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

const makeDir = require('make-dir');
const moment = require('moment-timezone');
const cron = require('node-cron');

const server = require('./server');
const logger = require('./logging/logger');
const setupHttpLogging = require('./logging/setup-http-logging');
const sendApptReminders = require('./reminders/send-appt-reminders');

const { NODE_ENV, PORT, TIMEZONE, REMIND_HOUR } = process.env;

// set default timezone
moment.tz.setDefault(TIMEZONE);

// setup logging
makeDir.sync('logs/');
setupHttpLogging(server);

// start the server
logger.info('🌱  Starting the TAS backend GraphQL API server');

server.listen(PORT, () => {
  logger.info(`🌻  Server ready${NODE_ENV === 'development' ? ' at http://localhost:' : '; exposing port '}${PORT}`);
  cron.schedule(`0 ${REMIND_HOUR} * * *`, sendApptReminders);
});