// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const laundryEmailQueue = sequelizeClient.define('laundry_email_queue', {
    to_who: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    attachment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sent: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: false,
      comment: '0 - not sent, 1 - sent, 2 - failed'
    },
    processing_ready: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '1 - ready for sending, 0 - not ready for sending'
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  laundryEmailQueue.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    laundryEmailQueue.belongsTo(models.laundry_users, {
      as: 'user', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: 'user_id'
    });
  };

  return laundryEmailQueue;
};
