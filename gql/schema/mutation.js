const Mutation = `
  input UserInput {
    email: String
    name: String
    role: UserRole
    company: String
    mobileNumber: String
  }

  input ImportFullInput {
    containerID: String!
    formNumber705: String!
  }

  input ImportEmptyInput {
    containerID: ContainerSize!
    emptyForCityFormNum: String!
  }

  input ExportFullInput {
    containerID: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    bookingNum: Int!
    vesselName: String!
    vesselETA: String!
    destinationPort: String!
    firstPortOfDischarge: String!
  }

  input ExportEmptyInput {
    containerID: String!
    containerSize: ContainerSize!
  }

  input ApptInput {
    timeSlot: String
    block: String
    email: String
    type: ApptType
    importFull: ImportFullInput
    importEmpty: ImportEmptyInput
    exportFull: ExportFullInput
    exportEmpty: ExportEmptyInput
  }

  type Mutation {
    addAppt(details: ApptInput!): Appointment
    updateAppt(id: ID!, details: ApptInput!): Appointment
    deleteAppt(id: ID!): String

    addUser(password: String!, details: UserInput!): User
    updateUser(email: String!, details: UserInput!): User
    deleteUser(email: String!): String

    login(email: String!, password: String!): String
    changePassword(email: String, newPassword: String!, currPassword: String): String
    resetPassword(token: String!, newPassword: String!): String
    sendResetPassLink(email: String!): String
  }
`;

module.exports = Mutation;
