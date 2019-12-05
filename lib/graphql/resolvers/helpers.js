const jwt = require('jsonwebtoken');
const nanoid = require('nanoid');
const { addWeeks, endOfToday, startOfHour, getHours, isBefore, format, addHours } = require('date-fns');

const logger = require('../../logging/logger');

const dayEnumMapping = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY'
};

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
const getHourString = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;
module.exports.getHourString = getHourString;

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
  const oneWeekFromToday = addWeeks(endOfToday(), 1);

  let timeSlotsInNextWeek = [];
  let currDate = startOfHour(addHours(new Date(), 1));
  while (isBefore(currDate, oneWeekFromToday)) {
    timeSlotsInNextWeek.push({
      date: format(currDate, 'yyyy-MM-dd'),
      hour: getHours(currDate)
    });

    currDate = addHours(currDate, 1);
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
  const slotCurrScheduled = await Appt.count({ where: { timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date } });
  let slotCapacity;
  
  slotCapacity = await Restriction.findOne({ where: { type: 'GLOBAL', hour: timeSlot.hour, timeSlotDate: timeSlot.date } }).then(restriction => restriction && restriction.gateCapacity);

  if (slotCapacity === null) { // no global restriction, check for template restriction
    const apptDate = new Date(`${timeSlot.date}T${getHourString(timeSlot.hour)}:00`);
    const apptDayOfWeek = dayEnumMapping[apptDate.getDay()];

    const appliedTemplate = await RestrictionTemplate.findOne({ where: { isApplied: true } });

    if (appliedTemplate) { // applied template restriction
      slotCapacity = await Restriction.findOne({ where: { template: appliedTemplate.name, hour: timeSlot.hour, dayOfWeek: apptDayOfWeek } }).then(res => res && res.gateCapacity);
    }

    if (slotCapacity === null) { // no template restrictions, use default allowed appts per hour
      slotCapacity = await Config.findOne().then(config => config.defaultAllowedApptsPerHour);
    }
  }

  return slotCurrScheduled < slotCapacity;
};
