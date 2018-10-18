module.exports = `
  input AddLinkedApptPairSingleApptInput {
    type: ApptType!
    importFull: AddImportFullInput
    importEmpty: AddImportEmptyInput
    exportFull: AddExportFullInput
    exportEmpty: AddExportEmptyInput
  }

  input AddLinkedApptPairInput {
    timeSlot: TimeSlotInput!
    licensePlateNumber: String
    notifyMobileNumber: String
    apptOne: AddLinkedApptPairSingleApptInput!
    apptTwo: AddLinkedApptPairSingleApptInput!
  }
`;
