const Restriction = `
  type Restriction {
    timeSlot: TimeSlot!
    type: RestrictionType!
    block: String
    plannedActivities: Int
    gateCapacity: Int
  }
`;

module.exports = Restriction;
