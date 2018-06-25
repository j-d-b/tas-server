const TypeDetails = `
  type ImportFull {
    containerID: String!
    formNumber705: String!
  }

  type ImportEmpty {
    containerSize: ContainerSize!
    emptyForCityFormNum: String!
  }

  type ExportFull {
    containerID: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    bookingNum: Int!
    vesselName: String!
    vesselETA: String!
    destinationPort: String!
    firstPortOfDischarge: String!
  }

  type ExportEmpty {
    containerID: String!
    containerSize: ContainerSize!
  }

  union TypeDetails = ImportFull | ImportEmpty | ExportFull | ExportEmpty
`;

module.exports = TypeDetails;
