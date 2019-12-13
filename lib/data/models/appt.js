const Sequelize = require('sequelize');
const { format, addMinutes } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
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
      const zonedTime = utcToZonedTime(this.timeSlotDateUTC, TIMEZONE);
      return { 
        hour: Number(format(zonedTime, 'HH')),
        date: format(zonedTime, 'yyyy-MM-dd')
      };
    },
    arrivalWindow: function() {
      const startTimeUTC = addMinutes(this.timeSlotDateUTC, this.arrivalWindowSlot * this.arrivalWindowLength);
      const endTimeUTC = addMinutes(this.timeSlotDateUTC, (this.arrivalWindowSlot + 1) * this.arrivalWindowLength);

      const startTimeZoned = format(utcToZonedTime(startTimeUTC, TIMEZONE), 'HH:mm');
      const endTimeZoned = format(utcToZonedTime(endTimeUTC, TIMEZONE), 'HH:mm');

      return `${startTimeZoned} - ${endTimeZoned}`;
    }
  },
  setterMethods: {
    timeSlot: function(slot) {
      const getHourString = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;
      const utcTime = moment.tz(`${slot.date} ${getHourString(slot.hour)}:00`, TIMEZONE);
      this.setDataValue('timeSlotDateUTC', utcTime);
    }
  }
});

module.exports = Appt;
