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

  input ImportFullInput {
    containerID: String
    formNumber705: String
  }

  input ImportEmptyInput {
    containerID: ContainerSize
    emptyForCityFormNum: String
  }

  input ExportFullInput {
    containerID: String
    containerSize: ContainerSize
    containerWeight: Int # might be float
    bookingNum: Int
    vesselName: String
    vesselETA: String
    destinationPort: String
    firstPortOfDischarge: String
  }

  input ExportEmptyInput {
    containerID: String
    containerSize: ContainerSize
  }

  input AddApptInput {
    timeSlot: String!
    block: String!
    userEmail: String!
    type: ApptType!
    importFull: ImportFullInput
    importEmpty: ImportEmptyInput
    exportFull: ExportFullInput
    exportEmpty: ExportEmptyInput
  }

  input UpdateApptInput {
    timeSlot: String
    block: String
    userEmail: String
    type: ApptType
    importFull: ImportFullInput
    importEmpty: ImportEmptyInput
    exportFull: ExportFullInput
    exportEmpty: ExportEmptyInput
  }

  type Mutation {
    addAppt(details: AddApptInput!): Appointment
    updateAppt(id: ID!, details: UpdateApptInput!): Appointment
    deleteAppt(id: ID!): String

    addUser(password: String!, details: AddUserInput!): User
    updateUser(email: String!, details: UpdateUserInput!): User
    deleteUser(email: String!): String

    login(email: String!, password: String!): String
    changePassword(currPassword: String!, newPassword: String!): String
    changeEmail(currEmail: String!, newEmail: String!): String
    resetPassword(resetToken: String!, newPassword: String!): String
    sendResetPassLink(email: String!): String
  }
`;

module.exports = Mutation;
