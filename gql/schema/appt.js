const Appt = `
  type Appt {
    id: ID! # uses $loki, but is this a good idea?
    timeSlot: String!
    block: String!
    user: User!
    type: ApptType!
    typeDetails: TypeDetails!
  }
`;

module.exports = Appt;
