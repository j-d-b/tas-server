const Restriction = `
  type Restriction {
    id: ID!
    timeSlot: TimeSlot!
    type: RestrictionType!
    block: Block
    plannedActivities: Int
    gateCapacity: Int
  }
`;

module.exports = Restriction;
