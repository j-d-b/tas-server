const Appt = `
  type Appt {
    id: ID!
    user: User!
    timeSlot: TimeSlot!
    arrivalWindow: String!
    actions: [Action!]!
    licensePlateNumber: String
    notifyMobileNumber: String
    comment: String
  }
`;

module.exports = Appt;
