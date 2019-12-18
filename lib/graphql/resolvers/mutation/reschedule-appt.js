const moment = require('moment-timezone');

const { sendApptRescheduledSMS } = require('../../../messaging/sms/send-sms');
const { NotifyNumberSMSSendError } = require('../errors');
const { sendApptRescheduledNotice } = require('../../../messaging/email/send-email');
const logger = require('../../../logging/logger');
const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, isAvailableCheck } = require('../checks');
const { buildSlotId, isOpOrAdmin, getNewApptArrivalWindowDetails, getPrettyDateString } = require('../helpers');

// rescheduleAppt(input: RescheduleApptInput!): Appt
const rescheduleAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, timeSlot } }, { user, Action, Appt, Config, User, Restriction, RestrictionTemplate }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    const oldTimeSlot = targetAppt.timeSlot;
    const oldArrivalWindow = targetAppt.arrivalWindow;

    if (buildSlotId(targetAppt.timeSlot) === buildSlotId({ ...targetAppt.timeSlot, ...timeSlot })) return targetAppt;

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user);
    await isAvailableCheck(timeSlot, Action, Appt, Config, Restriction, RestrictionTemplate);

    const newArrivalWindow = await getNewApptArrivalWindowDetails(timeSlot, Appt, Action, Config);

    if (targetAppt.notifyMobileNumber) {
      try {
        await sendApptRescheduledSMS(
          targetAppt.notifyMobileNumber,
          {
            oldDate: getPrettyDateString(oldTimeSlot.date),
            oldArrivalWindow,
            newDate: getPrettyDateString(timeSlot.date),
            newArrivalWindow: (() => {
              const getHourString = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;
              const apptDate = `${timeSlot.date} ${getHourString(timeSlot.hour)}:00`;
              const startDate = moment(apptDate).add(newArrivalWindow.arrivalWindowSlot * newArrivalWindow.arrivalWindowLength, 'minutes');
              const endDate = moment(apptDate).add((newArrivalWindow.arrivalWindowSlot + 1) * newArrivalWindow.arrivalWindowLength, 'minutes');
              return `${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`;
            })()
          }
        );
      } catch (err) {
        throw new NotifyNumberSMSSendError();
      }
    }

    await targetAppt.update({ timeSlot, ...newArrivalWindow });

    if (isOpOrAdmin(user) && targetAppt.userEmail !== user.userEmail) {
      const { name } = await User.findByPk(targetAppt.userEmail);

      try {
        await sendApptRescheduledNotice(targetAppt.userEmail, {
          name,
          oldDate: getPrettyDateString(oldTimeSlot.date),
          oldArrivalWindow,
          newDate: getPrettyDateString(targetAppt.timeSlot.date),
          newArrivalWindow: targetAppt.arrivalWindow
        });
      } catch (err) {
        logger.error(`Reschedule Appt Notice email failed to send: ${err.stack}`);
      }
    }

    return targetAppt;
  }
);

module.exports = rescheduleAppt;
