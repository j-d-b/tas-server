const TypeSpecific = `
  type ImportFull {
    containerId: String!
    formNumber705: String!
    containerSize: ContainerSize!
  }

  type StorageEmpty {
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
    emptyForCityFormNumber: String!
  }

  type ExportFull {
    containerId: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    containerType: String!
    shippingLine: String!
    bookingNumber: Int!
    vesselName: String!
    vesselETA: String!
  }

  type ExportEmpty {
    containerId: String!
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
  }

  union TypeSpecific = ImportFull | StorageEmpty | ExportFull | ExportEmpty
`;

module.exports = TypeSpecific;
