const twilio = require('twilio');

const logger = require('../../logging/logger');

const { TWILIO_ACCT_SID, TWILIO_AUTH_TOKEN, TWILIO_SRC_NUM } = process.env;

const client = twilio(TWILIO_ACCT_SID, TWILIO_AUTH_TOKEN);

const sendSMS = async (destNum, message) => {
  client.messages.create({ from: TWILIO_SRC_NUM, to: destNum, body: message })
    .then(m => logger.info('SMS Queued: ' + JSON.stringify(m)))
    .catch((err) => {
      logger.error(err);
      throw err;
    });
};

const createApptReminderMessage = ({ date, arrivalWindow }) => `This is a reminder that you have an appointment scheduled for tomorrow, ${date}.\nPlease arrive between ${arrivalWindow}.\nBCTC TAS 🚚`;
const createApptCreatedMessage = ({ date, arrivalWindow }) => `An appointment has been scheduled for you at ${date}, arrival time ${arrivalWindow}.\nBCTC TAS 🚚`;
const createApptRescheduledMessage = ({ oldDate, oldArrivalWindow, newDate, newArrivalWindow }) => `Your appointment for ${oldDate}, arrival time ${oldArrivalWindow}, has been rescheduled to ${newDate}, arrival time ${newArrivalWindow}.\nBCTC TAS 🚚`;
const createApptDeletedMessage = ({ date, arrivalWindow }) => `Your appointment for ${date}, arrival time ${arrivalWindow}, has been deleted.\nBCTC TAS 🚚`;

module.exports.sendApptReminderSMS = async (mobileNum, data) => sendSMS(mobileNum, createApptReminderMessage(data));
module.exports.sendApptCreatedSMS = async (mobileNum, data) => sendSMS(mobileNum, createApptCreatedMessage(data));
module.exports.sendApptRescheduledSMS = async (mobileNum, data) => sendSMS(mobileNum, createApptRescheduledMessage(data));
module.exports.sendApptDeletedSMS = async (mobileNum, data) => sendSMS(mobileNum, createApptDeletedMessage(data));