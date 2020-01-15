module.exports = `
  input UpdateImportFullInput {
    formNumber705: String
    containerId: String
    containerType: ContainerType
  }

  input UpdateStorageEmptyInput {
    containerType: ContainerType
    emptyForCityFormNumber: String
  }

  input UpdateExportFullInput {
    containerId: String
    containerWeight: String
    containerType: ContainerType
    bookingNumber: String
    shippingLine: String
  }

  input UpdateExportEmptyInput {
    containerId: String
    containerType: ContainerType
  }

  input UpdateActionDetailsInput {
    id: ID!
    importFull: UpdateImportFullInput
    storageEmpty: UpdateStorageEmptyInput
    exportFull: UpdateExportFullInput
    exportEmpty: UpdateExportEmptyInput
  }

  input UpdateApptDetailsInput {
    id: ID!
    comment: String
    licensePlateNumber: String
    notifyMobileNumber: String
    actionDetails: [UpdateActionDetailsInput]!
  }
`;
