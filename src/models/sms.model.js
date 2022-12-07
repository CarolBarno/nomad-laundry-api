// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const sms = sequelizeClient.define('laundry_sms_queue', {
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    originator: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 22141
    },
    message_timestamp: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    message_direction: {
      type: DataTypes.STRING(5),
      defaultValue: 'OUT'
    },
    smscid: {
      type: DataTypes.STRING(20),
      defaultValue: 'Nomad Laundry'
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  sms.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return sms;
};
