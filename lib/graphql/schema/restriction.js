const Restriction = `
  type Restriction {
    id: ID!
    timeSlot: TimeSlot
    dayOfWeek: DayOfWeek
    type: RestrictionType!
    gateCapacity: Int!
  }
`;

module.exports = Restriction;
