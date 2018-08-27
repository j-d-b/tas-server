const { isAuthenticatedResolver } = require('../auth');
const { isValidNumContainersCheck, doContainerIdsExistCheck } = require('../checks');
const { getTimeSlotsInNextWeek } = require('../helpers');

// availableSlots(input: AvailableSlotsInput!): [TimeSlot]
const availableSlots = isAuthenticatedResolver.createResolver(
  async (_, { input: { numContainers, importFullContainerIds, knownContainerSizes }}, { Appt, Block, Config }) => {
    const importFullBlockAndSize = doContainerIdsExistCheck(importFullContainerIds);

    const sizes = knownContainerSizes.concat(importFullBlockAndSize.map(({ containerSize }) => containerSize));
    await isValidNumContainersCheck(numContainers, sizes, Config);

    const uniqueBlocks = new Set(importFullBlockAndSize.map(({ block }) => block));
    const movesByBlock = importFullBlockAndSize.reduce((acc, { block }) => {
      acc[block] ? acc[block]++ : acc[block] = 1;
      return acc;
    }, {});

    // implicitly wrapped in Promise
    return getTimeSlotsInNextWeek().filter(async (slot) => {
      const slotTotalCurrScheduled = Appt.count({ where: { timeSlotHour: slot.hour, timeSlotDate: slot.date } });

      const config = await Config.findOne();
      if (numContainers + slotTotalCurrScheduled > config.totalAllowedApptsPerHour) return false;

      for (const block of uniqueBlocks) {
        const blockCurrAllowed = await Block.findById(block).then(blk => blk.currAllowedApptsPerHour);
        const slotBlockCurrScheduled = await Appt.count({ where: { timeSlotHour: slot.hour, timeSlotDate: slot.date, block } }); // yes, this shoud be resultset op from line 21, but we aren't using loki anyways...
        if (movesByBlock[block] + slotBlockCurrScheduled > blockCurrAllowed) return false;
      }

      return true;
    });
  }
);

module.exports = availableSlots;
