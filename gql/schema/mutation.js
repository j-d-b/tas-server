const Mutation = `
  input AddUserInput {
    email: String!
    name: String!
    role: UserRole!
    company: String!
    mobileNumber: String
  }

  input UpdateUserInput {
    name: String
    role: UserRole
    company: String
    mobileNumber: String
  }

  input AddImportFullInput {
    containerID: String!
    formNumber705: String!
  }

  input AddImportEmptyInput {
    containerID: ContainerSize!
    emptyForCityFormNum: String!
  }

  input AddExportFullInput {
    containerID: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    bookingNum: Int!
    vesselName: String!
    vesselETA: String!
    destinationPort: String!
    firstPortOfDischarge: String!
  }

  input AddExportEmptyInput {
    containerID: String!
    containerSize: ContainerSize!
  }

  input UpdateImportFullInput {
    containerID: String
    formNumber705: String
  }

  input UpdateImportEmptyInput {
    containerID: ContainerSize
    emptyForCityFormNum: String
  }

  input UpdateExportFullInput {
    containerID: String
    containerSize: ContainerSize
    containerWeight: Int # might be float
    bookingNum: Int
    vesselName: String
    vesselETA: String
    destinationPort: String
    firstPortOfDischarge: String
  }

  input UpdateExportEmptyInput {
    containerID: String
    containerSize: ContainerSize
  }

  input AddApptInput {
    timeSlot: String!
    block: String!
    userEmail: String!
    type: ApptType!
    importFull: AddImportFullInput
    importEmpty: AddImportEmptyInput
    exportFull: AddExportFullInput
    exportEmpty: AddExportEmptyInput
  }

  input UpdateApptInput {
    timeSlot: String
    block: String
    userEmail: String
    type: ApptType
    importFull: UpdateImportFullInput
    importEmpty: UpdateImportEmptyInput
    exportFull: UpdateExportFullInput
    exportEmpty: UpdateExportEmptyInput
  }

  type Mutation {
    addAppt(details: AddApptInput!): Appt
    updateAppt(id: ID!, details: UpdateApptInput!): Appt
    deleteAppt(id: ID!): String

    addUser(password: String!, details: AddUserInput!): User
    updateUser(email: String!, details: UpdateUserInput!): User
    deleteUser(email: String!): String
    confirmUser(email: String!): User

    login(email: String!, password: String!): String
    changePassword(currPassword: String!, newPassword: String!): String
    changeEmail(currEmail: String!, newEmail: String!): String
    resetPassword(resetToken: String!, newPassword: String!): String
    sendResetPassLink(email: String!): String
  }
`;

module.exports = Mutation;
