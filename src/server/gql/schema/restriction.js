const Restriction = `
  type Restriction {
    timeSlot: TimeSlot!
    type: RestrictionType!
    block: Block
    plannedActivities: Int
    gateCapacity: Int
  }
`;

module.exports = Restriction;
