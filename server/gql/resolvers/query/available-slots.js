const { isAuthenticatedResolver } = require('../auth');

const { isValidNumContainersCheck, doContainerIdsExistCheck } = require('../checks');
const { getTimeSlotsInNextWeek } = require('../helpers');

// availableSlots(input: AvailableSlotsInput!): [TimeSlot]
const availableSlots = isAuthenticatedResolver.createResolver(
  (_, { input: { numContainers, importFullContainerIDs, knownContainerSizes }}, { appts, blocks }) => {
    const importFullBlockAndSize = doContainerIdsExistCheck(importFullContainerIDs);

    const sizes = knownContainerSizes.concat(importFullBlockAndSize.map(({ containerSize }) => containerSize));
    isValidNumContainersCheck(numContainers, sizes);

    const uniqueBlocks = new Set(importFullBlockAndSize.map(({ block }) => block));
    const movesByBlock = importFullBlockAndSize.reduce((acc, { block }) => {
      acc[block] ? acc[block]++ : acc[block] = 1;
      return acc;
    }, {});

    return getTimeSlotsInNextWeek().filter((slot) => {
      const slotTotalCurrScheduled = appts.count({ 'timeSlot.hour': slot.hour, 'timeSlot.date': slot.date });

      if (numContainers + slotTotalCurrScheduled > global.TOTAL_ALLOWED) return false;

      for (const block of uniqueBlocks) {
        const blockCurrAllowed = blocks.find({ id: block }).currAllowedApptsPerHour;
        const slotBlockCurrScheduled = appts.count({ 'timeSlot.hour': slot.hour, 'timeSlot.date': slot.date, block }); // yes, this shoud be resultset op from line 21, but we aren't using loki anyways...
        if (movesByBlock[block] + slotBlockCurrScheduled > blockCurrAllowed) return false;
      }

      return true;
    });
  }
);

module.exports = availableSlots;
