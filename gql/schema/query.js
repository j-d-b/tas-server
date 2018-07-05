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
    confirmed: Boolean
  }

  type Query {
    myAppts: [Appt]
    appt(id: ID!): Appt
    appts(where: ApptsWhere): [Appt]

    me: User
    user(email: String!): User
    users(where: UsersWhere): [User]
  }
`;

module.exports = Query;
