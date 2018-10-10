const Sequelize = require('sequelize');

module.exports = sequelize => (sequelize.define('restriction', {
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
  type: {
    type: Sequelize.ENUM,
    values: ['GATE_CAPACITY', 'PLANNED_ACTIVITIES'],
    allowNull: false
  },
  blockId: Sequelize.STRING,
  gateCapacity: {
    type: Sequelize.INTEGER,
    field: 'gate_capacity'
  },
  plannedActivities: {
    type: Sequelize.INTEGER,
    field: 'planned_activities'
  }
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
}));
