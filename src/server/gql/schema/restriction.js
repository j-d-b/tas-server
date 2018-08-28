const Restriction = `
  type Restriction {
    timeSlot: TimeSlot!
    block: String
    allowedAppts: Int!
  }
`;

module.exports = Restriction;
