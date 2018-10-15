module.exports = `
  input AddApptInput {
    timeSlot: TimeSlotInput!
    type: ApptType!
    licensePlateNumber: String
    notifyMobileNumber: String
    importFull: AddImportFullInput
    importEmpty: AddImportEmptyInput
    exportFull: AddExportFullInput
    exportEmpty: AddExportEmptyInput
  }
`;
