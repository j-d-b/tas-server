const User = `
  type User {
    email: String! # unique ID
    name: String!
    role: UserRole!
    company: String!
    mobileNumber: String
    appts: [Appt]
  }
`;

module.exports = User;
