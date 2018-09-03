const Sequelize = require('sequelize');

module.exports = sequelize.define('restriction', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  timeSlotHour: {
    type: Sequelize.INTEGER,
    field: 'time_slot_hour',
    allowNull: false
  },
  timeSlotDate: {
    type: Sequelize.DATEONLY,
    field: 'time_slot_date',
    allowNull: false
  },
  allowedAppts: {
    type: Sequelize.INTEGER,
    field: 'allowed_appts',
    allowNull: false
  },
  block: Sequelize.STRING // if null, is total/hr
},
{
  getterMethods: {
    timeSlot: function() {
      return { hour: this.timeSlotHour, date: this.timeSlotDate };
    }
  },
  setterMethods: {
    timeSlot: function(slot) {
      this.setDataValue('timeSlotHour', slot.hour);
      this.setDataValue('timeSlotDate', slot.date);
    },
  },
  underscored: true
});
