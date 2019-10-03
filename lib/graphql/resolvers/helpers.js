const jwt = require('jsonwebtoken');
const nanoid = require('nanoid');

const logger = require('../../logging/logger');

module.exports.buildSlotId = timeSlot => timeSlot.hour + ':' + timeSlot.date;

module.exports.containerSizeToInt = size => size === 'TWENTYFOOT' ? 20 : 40;

module.exports.getActionTypeSpecific = (action) => {
  switch (action.type) {
    case 'IMPORT_FULL': return action.importFull;
    case 'STORAGE_EMPTY': return action.storageEmpty;
    case 'EXPORT_FULL': return action.exportFull;
    case 'EXPORT_EMPTY': return action.exportEmpty;
    default: logger.error('Invalid action type');
  }
};

module.exports.getDateString = UTCString => new Date(Date.parse(UTCString)).toUTCString().substring(0, 16);

module.exports.getFirstName = user => user.name.split(' ')[0];

// expects 0 to 23
module.exports.getHourString = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;

module.exports.getNewApptArrivalWindow = async (timeSlot, Appt, Action, Config) => {
  const slotScheduledAppts = await Appt.findAll({ where: { timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date } });
  const currWindowLength = await Config.findOne().then(config => config.arrivalWindowLength);

  const actionCountByWindowSlot = new Array(60 / currWindowLength).fill(0);
  for (const appt of slotScheduledAppts) {
    const { arrivalWindowSlot, arrivalWindowLength, id } = appt;
    const numActions = await Action.count({ where: { apptId: id } });
    const equivalentSlot = Math.round(arrivalWindowSlot * (arrivalWindowLength / currWindowLength));
    actionCountByWindowSlot[equivalentSlot] += numActions;
  }

  const arrivalWindowSlot = actionCountByWindowSlot.reduce((mostFreeSlot, slotCount, i) => slotCount < actionCountByWindowSlot[mostFreeSlot] ? i : mostFreeSlot);

  return { arrivalWindowSlot, arrivalWindowLength: currWindowLength };
};

module.exports.getTimeSlotsInNextWeek = () => {
  const HR_IN_MS = 60 * 60 * 1000;
  const WEEK_IN_HRS = 7 * 24;

  const startDate = new Date(Date.now() + HR_IN_MS); // start at next hour

  // returns slot object for each hour in the next week
  return [...Array(WEEK_IN_HRS).keys()].map((hour) => {
    const slotTime = new Date(startDate.valueOf() + hour * HR_IN_MS);
    return {
      hour: slotTime.getUTCHours(),
      date: slotTime.toISOString().split('T')[0]
    };
  });
};

module.exports.getTokenFromAuthHeader = authHeader => authHeader.replace('Bearer ', '');

module.exports.getVerifyLink = (email) => {
  const verifyToken = jwt.sign({ userEmail: email }, process.env.SECRET_KEY); // never expires
  return `${process.env.WEB_APP_URL}/verify-email/${verifyToken}`;
};

module.exports.generateRefreshToken = () => nanoid();

module.exports.isAdmin = user => user.userRole === 'ADMIN';

module.exports.isOpOrAdmin = user => user.userRole === 'OPERATOR' || user.userRole === 'ADMIN';

// remove null or empty keys from an object (at a depth of one)
module.exports.removeEmpty = (obj) => {
  const nonNullKeys = Object.keys(obj).filter(key => obj[key]);
  return nonNullKeys.reduce((newObj, key) => {
    newObj[key] = obj[key];
    return newObj;
  }, {});
};

module.exports.signJwt = targetUser => (
  jwt.sign({
    userEmail: targetUser.email,
    userRole: targetUser.role
  }, process.env.SECRET_KEY, { expiresIn: '10m' })
);

module.exports.slotTotalAvailability = async (timeSlot, Appt, Config, Restriction) => {
  let slotTotalAllowed = await Restriction.findOne({ where: { type: 'GLOBAL', timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date } }).then(restriction => restriction && restriction.gateCapacity);
  if (!slotTotalAllowed && slotTotalAllowed !== 0) {
    slotTotalAllowed = await Config.findOne().then(config => config.defaultAllowedApptsPerHour);
  }

  const slotTotalCurrScheduled = await Appt.count({ where: { timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date } });

  return slotTotalCurrScheduled < slotTotalAllowed;
};
