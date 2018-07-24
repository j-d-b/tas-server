const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    email: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM,
      values: ['CUSTOMER', 'OPERATOR', 'ADMIN'],
      defaultValue: 'CUSTOMER',
      allowNull: false
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verified'
    },
    company: Sequelize.STRING,
    mobileNumber: {
      type: Sequelize.STRING,
      field: 'mobile_number'
    }
  }, { underscored: true });

  const Block = sequelize.define('block', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    maxAllowedApptsPerHour: {
      type: Sequelize.INTEGER,
      field: 'max_allowed_appts_per_hour',
      allowNull: false
    },
    currAllowedApptsPerHour: {
      type: Sequelize.INTEGER,
      field: 'curr_allowed_appts_per_hour',
      allowNull: false
    }
  });

  const Appt = sequelize.define('appt', {
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
      values: ['IMPORTFULL', 'IMPORTEMPTY', 'EXPORTFULL', 'EXPORTEMPTY'],
      allowNull: false
    },
    containerId: {
      type: Sequelize.STRING,
      field: 'container_id'
    },
    containerSize: {
      type: Sequelize.STRING,
      field: 'container_size'
    },
    containerWeight: {
      type: Sequelize.INTEGER,
      field: 'container_weight'
    },
    formNumber705: {
      type: Sequelize.STRING,
      field: 'form_num_705'
    },
    emptyForCityFormNum: {
      type: Sequelize.STRING,
      field: 'empty_for_city_form_num'
    },
    bookingNum: {
      type: Sequelize.STRING,
      field: 'booking_num'
    },
    vesselName: {
      type: Sequelize.STRING,
      field: 'vessel_name'
    },
    vesselETA: {
      type: Sequelize.DATE,
      field: 'vessel_eta'
    },
    destinationPort: {
      type: Sequelize.STRING,
      field: 'desintation_port'
    },
    firstPortOfDischarge: {
      type: Sequelize.STRING,
      field: 'first_port_of_discharge'
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
      }
    },
    underscored: true
  });

  // single row config table
  const Config = sequelize.define('config', {
    totalAllowedApptsPerHour: {
      type: Sequelize.INTEGER,
      field: 'total_allowed_appts_per_hour',
      allowNull: false
    },
    maxTFUPerAppt: {
      type: Sequelize.INTEGER,
      field: 'max_tfu_per_appt',
      allowNull: false
    }
  }, { timestamps: false, freezeTableName: true, underscored: true });

  // associations
  Block.hasMany(Appt, { foreignKey: 'block' });
  User.hasMany(Appt, { foreignKey: 'userEmail' });

  return { User, Appt, Block, Config };
};
