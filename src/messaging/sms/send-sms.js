const plivo = require('plivo');

const { PLIVO_AUTH_ID, PLIVO_AUTH_TOKEN, PLIVO_SRC_NUM } = process.env;
const client = new plivo.Client(PLIVO_AUTH_ID, PLIVO_AUTH_TOKEN);

const sendSMS = async (destNum, message) => {
  const created = await client.messages.create(
    PLIVO_SRC_NUM,
    destNum,
    message
  );

  console.log(created); // TODO: logging
};

const createApptReminderMessage = data => `Hello, ${data.name}.\nYou have an appointment scheduled for tomorrow, ${data.date}.\nPlease arrive between ${data.arrivalWindow}.\nBCTC TAS 🚚`;
const createApptCreatedMessage = data => `An appointment has been scheduled for you at ${data.date}, arrival time ${data.arrivalWindow}.\nBCTC TAS 🚚`;

module.exports.sendApptReminderSMS = async (mobileNum, data) => sendSMS(mobileNum, createApptReminderMessage(data));
module.exports.sendApptCreatedSMS = async (mobileNum, data) => sendSMS(mobileNum, createApptCreatedMessage(data));
