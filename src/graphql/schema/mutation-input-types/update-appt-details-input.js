module.exports = `
  input UpdateApptDetailsInput {
    id: ID!
    importFull: UpdateImportFullInput
    importEmpty: UpdateImportEmptyInput
    exportFull: UpdateExportFullInput
    exportEmpty: UpdateExportEmptyInput
  }
`;
