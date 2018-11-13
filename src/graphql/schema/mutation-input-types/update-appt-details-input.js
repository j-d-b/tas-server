module.exports = `
  input UpdateImportFullInput {
    formNumber705: String
  }

  input UpdateStorageEmptyInput {
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
    storageEmpty: UpdateStorageEmptyInput
    exportFull: UpdateExportFullInput
    exportEmpty: UpdateExportEmptyInput
  }
`;
