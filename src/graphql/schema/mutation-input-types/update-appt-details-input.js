module.exports = `
  input UpdateImportFullInput {
    formNumber705: String
  }

  input UpdateImportEmptyInput {
    shippingLine: String
    emptyForCityFormNumber: String
  }

  input UpdateExportFullInput {
    containerId: String
    containerWeight: String
    bookingNumber: Int
    shippingLine: String
  }

  input UpdateExportEmptyInput {
    containerId: String
    shippingLine: String
  }

  input UpdateApptDetailsInput {
    id: ID!
    importFull: UpdateImportFullInput
    importEmpty: UpdateImportEmptyInput
    exportFull: UpdateExportFullInput
    exportEmpty: UpdateExportEmptyInput
  }
`;
