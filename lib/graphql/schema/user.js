const User = `
  type User {
    email: String! # unique ID
    name: String!
    role: UserRole!
    company: String!
    confirmed: Boolean!
    emailVerified: Boolean!
    reminderSetting: ReminderSetting!
    companyType: String
    mobileNumber: String
    companyRegNumber: String
    appts: [Appt]
  }
`;

module.exports = User;
