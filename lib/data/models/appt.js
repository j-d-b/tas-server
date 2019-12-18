const Sequelize = require('sequelize');
const moment = require('moment-timezone');

const sequelize = require('../sequelize');
const { TIMEZONE } = process.env;

const Appt = sequelize.define('appt', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  timeSlotDateUTC: {
    type: Sequelize.DATE,
    allowNull: false
  },
  arrivalWindowSlot: {
    type: Sequelize.INTEGER, // 0 to (60 / arrivalWindowLength)
    allowNull: false
  },
  arrivalWindowLength: {
    type: Sequelize.INTEGER, // when the appt was booked
    allowNull: false
  },
  notifyMobileNumber: Sequelize.STRING,
  licensePlateNumber: Sequelize.STRING,
  comment: Sequelize.STRING
},
{
  getterMethods: {
    timeSlot: function() {
      const zonedDate = moment(this.timeSlotDateUTC);
      return {
        hour: Number(zonedDate.format('H')),
        date: zonedDate.format('YYYY-MM-DD')
      };
    },
    arrivalWindow: function() {
      const startDateZoned = moment(this.timeSlotDateUTC).add(this.arrivalWindowSlot * this.arrivalWindowLength, 'minutes');
      const endTimeUTC = moment(this.timeSlotDateUTC).add((this.arrivalWindowSlot + 1) * this.arrivalWindowLength, 'minutes');
      return `${startDateZoned.format('HH:mm')} - ${endTimeUTC.format('HH:mm')}`;
    }
  },
  setterMethods: {
    timeSlot: function(slot) {
      const getHourString = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;
      const utcTime = moment.tz(`${slot.date} ${getHourString(slot.hour)}:00`, TIMEZONE);
      this.setDataValue('timeSlotDateUTC', utcTime.format());
    }
  }
});

module.exports = Appt;
