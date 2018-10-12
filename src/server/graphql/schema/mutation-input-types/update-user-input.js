module.exports = `
  input UpdateUserInput {
    email: String!
      name: String
      role: UserRole
      company: String
      mobileNumber: String
      companyType: String
      companyRegNum: String
      reminderSetting: ReminderSetting
  }
`;
