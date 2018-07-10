const TimeSlot = `
  type TimeSlot {
    hour: Hour! # 0-23
    date: ISODate! # YYYY-MM-DD
  }
`;

module.exports = TimeSlot;
