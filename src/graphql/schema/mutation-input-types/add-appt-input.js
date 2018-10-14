module.exports = `
  input AddApptInput {
    timeSlot: TimeSlotInput!
    userEmail: String!
    type: ApptType!
    licensePlateNumber: String
    notifyMobileNumber: String
    importFull: AddImportFullInput
    importEmpty: AddImportEmptyInput
    exportFull: AddExportFullInput
    exportEmpty: AddExportEmptyInput
  }
`;
