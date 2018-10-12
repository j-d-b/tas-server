module.exports = `
  input UpdateApptInput {
    id: ID!
    timeSlot: TimeSlotInput
    importFull: UpdateImportFullInput
    importEmpty: UpdateImportEmptyInput
    exportFull: UpdateExportFullInput
    exportEmpty: UpdateExportEmptyInput
  }
`;
