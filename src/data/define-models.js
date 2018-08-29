const Sequelize = require('sequelize');

module.exports = (sequelize) => {
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
    notifyMobileNumber: {
      type: Sequelize.STRING,
      field: 'notify_mobile_number'
    },
    licensePlateNumber: {
      type: Sequelize.STRING,
      field: 'license_plate_number'
    }, // type specific details below
    containerId: {
      type: Sequelize.STRING,
      field: 'container_id'
    },
    containerSize: {
      type: Sequelize.ENUM,
      values: ['TWENTYFOOT', 'FORTYFOOT'],
      field: 'container_size'
    },
    containerWeight: {
      type: Sequelize.INTEGER,
      field: 'container_weight'
    },
    containerType: {
      type: Sequelize.STRING,
      field: 'container_type'
    },
    block: Sequelize.STRING,
    formNum705: {
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
    shippingLine: {
      type: Sequelize.STRING,
      field: 'shipping_line'
    }
  },
  {
    getterMethods: {
      timeSlot: function() {
        return { hour: this.timeSlotHour, date: this.timeSlotDate };
      },
      typeDetails: function() {
        return {
          containerId: this.containerId,
          containerSize: this.containerSize,
          containerWeight: this.containerWeight,
          containerType: this.containerType,
          block: this.block,
          formNum705: this.formNum705,
          emptyForCityFormNum: this.emptyForCityFormNum,
          bookingNum: this.bookingNum,
          vesselName: this.vesselName,
          vesselETA: this.vesselETA,
          shippingLine: this.shippingLine
        };
      }
    },
    setterMethods: {
      timeSlot: function(slot) {
        this.setDataValue('timeSlotHour', slot.hour);
        this.setDataValue('timeSlotDate', slot.date);
      },
      typeDetails: function(details) {
        details.containerId && this.setDataValue('containerId', details.containerId);
        details.containerSize && this.setDataValue('containerSize', details.containerSize);
        details.containerWeight && this.setDataValue('containerWeight', details.containerWeight);
        details.containerType && this.setDataValue('containerType', details.containerType);
        details.block && this.setDataValue('block', details.block);
        details.formNum705 && this.setDataValue('formNumber705', details.formNum705);
        details.emptyForCityFormNum && this.setDataValue('emptyForCityFormNum', details.emptyForCityFormNum);
        details.bookingNum && this.setDataValue('bookingNum', details.bookingNum);
        details.vesselName && this.setDataValue('vesselName', details.vesselName);
        details.vesselETA && this.setDataValue('vesselETA', details.vesselETA);
        details.shippingLine && this.setDataValue('shippingLine', details.shippingLine);
      }
    },
    underscored: true
  });

  const Restriction = sequelize.define('restriction', {
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

  const Block = sequelize.define('block', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    maxAllowedApptsPerHour: {
      type: Sequelize.INTEGER,
      field: 'max_allowed_appts_per_hour',
      allowNull: false
    }
  });

  // single row config table
  const Config = sequelize.define('config', {
    maxAllowedApptsPerHour: {
      type: Sequelize.INTEGER,
      field: 'max_allowed_appts_per_hour',
      allowNull: false
    },
    maxTFUPerAppt: {
      type: Sequelize.INTEGER,
      field: 'max_tfu_per_appt',
      allowNull: false
    }
  }, { timestamps: false, freezeTableName: true, underscored: true });

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
    company: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mobileNumber: {
      type: Sequelize.STRING,
      field: 'mobile_number'
    },
    companyType: {
      type: Sequelize.STRING,
      field: 'company_type'
    },
    companyRegNum: {
      type: Sequelize.STRING,
      field: 'company_reg_num'
    }
  }, { underscored: true });

  // associations
  Block.hasMany(Appt, { foreignKey: 'block' });
  Block.hasMany(Restriction, { foreignKey: 'block' });
  User.hasMany(Appt, { foreignKey: 'userEmail' });

  return {
    Appt,
    Restriction,
    Block,
    Config,
    User
  };
};
