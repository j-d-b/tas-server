const Query = `
  input ApptsWhere {
    userEmail: String
    timeSlot: String
    block: String
    type: ApptType
  }

  input UsersWhere {
    email: String
    name: String
    role: UserRole
    company: String
  }

  type Query {
    myAppts: [Appointment]
    appt(id: ID!): Appointment
    appts(where: ApptsWhere): [Appointment]

    me: User
    user(email: String!): User
    users(where: UsersWhere): [User]
  }
`;

module.exports = Query;
