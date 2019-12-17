const jwt = require('jsonwebtoken');
const nanoid = require('nanoid');
const moment = require('moment');

const logger = require('../../logging/logger');
const { TIMEZONE } = process.env;

const dayEnumMapping = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY'
};

module.exports.FIFTEEN_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 15;

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

module.exports.getPrettyDateString = ISOString => moment(ISOString, 'ddd, MMM Do, YYYY');

// expects 0 to 23
const getHourString = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;
module.exports.getHourString = getHourString;

const getUTCTimeFromTimeSlot = slot => moment.tz(`${slot.date} ${getHourString(slot.hour)}:00`, TIMEZONE);
module.exports.getUTCTimeFromTimeSlot = getUTCTimeFromTimeSlot;

module.exports.getNewApptArrivalWindowDetails = async (timeSlot, Appt, Action, Config) => {
  const timeSlotDateUTC = getUTCTimeFromTimeSlot(timeSlot);
  const slotScheduledAppts = await Appt.findAll({ where: { timeSlotDateUTC } });
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
  const oneWeekFromToday = moment().endOf('day').add(1, 'week');

  let timeSlotsInNextWeek = [];
  let currDate = moment().startOf('hour').add(1, 'hour');
  while (currDate.isBefore(oneWeekFromToday)) {
    timeSlotsInNextWeek.push({
      date: currDate.format('YYYY-MM-DD'),
      hour: currDate.hours()
    });

    currDate = currDate.add(1, 'hour');
  }

  return timeSlotsInNextWeek;
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

module.exports.slotAvailability = async (timeSlot, Appt, Config, Restriction, RestrictionTemplate) => {
  const timeSlotDateUTC = getUTCTimeFromTimeSlot(timeSlot);

  const slotCurrScheduled = await Appt.count({ where: { timeSlotDateUTC } });
  
  let slotCapacity = await Restriction.findOne({ where: { type: 'GLOBAL', timeSlotDateUTC } }).then(restriction => restriction && restriction.gateCapacity);

  if (slotCapacity === null) { // no global restriction, check for template restriction
    const appliedTemplate = await RestrictionTemplate.findOne({ where: { isApplied: true } });

    if (appliedTemplate) { // applied template restriction
      slotCapacity = await Restriction.findOne({ where: { template: appliedTemplate.name, hour: timeSlot.hour, dayOfWeek: dayEnumMapping[timeSlotDateUTC.day()] } }).then(res => res && res.gateCapacity);
    }

    if (slotCapacity === null) { // no template restrictions, use default allowed appts per hour
      slotCapacity = await Config.findOne().then(config => config.defaultAllowedApptsPerHour);
    }
  }

  return slotCurrScheduled < slotCapacity;
};
