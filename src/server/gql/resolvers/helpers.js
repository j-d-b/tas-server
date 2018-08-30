const jwt = require('jsonwebtoken');

module.exports.buildSlotId = timeSlot => timeSlot.hour + ':' + timeSlot.date;

module.exports.containerSizeToInt = size => size === 'TWENTYFOOT' ? 20 : 40;

module.exports.getApptTypeDetails = (apptDetails) => {
  switch (apptDetails.type) {
    case 'IMPORTFULL': return apptDetails.importFull;
    case 'IMPORTEMPTY': return apptDetails.importEmpty;
    case 'EXPORTFULL': return apptDetails.exportFull;
    case 'EXPORTEMPTY': return apptDetails.exportEmpty;
  }
};

module.exports.getTimeSlotFromId = (slotId) => {
  const slotHourDate = slotId.split(':');
  return { hour: slotHourDate[0], date: slotHourDate[1] };
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

module.exports.getUserFromAuthHeader = (authHeader) => {
  const token = authHeader.replace('Bearer ', '');
  return jwt.verify(token, process.env.PRIMARY_SECRET);
};

module.exports.getVerifyLink = (email) => {
  const verifyToken = jwt.sign({ userEmail: email }, process.env.VERIFY_EMAIL_SECRET); // NOTE never expires
  return `http://localhost:3000/verify-email/${verifyToken}`; // TODO production link
};

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
  }, process.env.PRIMARY_SECRET, { expiresIn: '12h' })
);

// moveCountByBlock expected as an object where fields and blocks and values
// are number of appts for that block
module.exports.slotBlockAvailability = async (timeSlot, moveCountByBlock, Appt, Block, Restriction) => {
  for (const [block, count] of Object.entries(moveCountByBlock)) {
    let slotBlockTotalAllowed = await Restriction.findOne({ where: { block, timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date } }).then(alloweds => alloweds && alloweds.allowedAppts);
    if (!slotBlockTotalAllowed && slotBlockTotalAllowed !== 0) {
      slotBlockTotalAllowed = await Block.findById(block).then(blk => blk && blk.maxAllowedApptsPerHour);
    }

    const slotBlockCurrScheduled = await Appt.count({ where: { timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date, block } });

    if (slotBlockCurrScheduled + count > slotBlockTotalAllowed) return false;
  }

  return true;
};

module.exports.slotTotalAvailability = async (timeSlot, numAppts, Appt, Config, Restriction) => {
  let slotTotalAllowed = await Restriction.findOne({ where: { timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date, block: null } }).then(alloweds => alloweds && alloweds.allowedAppts);
  if (!slotTotalAllowed && slotTotalAllowed !== 0) {
    slotTotalAllowed = await Config.findOne().then(config => config.maxAllowedApptsPerHour);
  }

  const slotTotalCurrScheduled = await Appt.count({ where: { timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date } });

  return numAppts + slotTotalCurrScheduled <= slotTotalAllowed;
};
