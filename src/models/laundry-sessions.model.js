// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const laundrySessions = sequelizeClient.define('laundry_sessions', {
    session_expiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    access_token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '1 - terminated by user/admin, 0 - logout'
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  laundrySessions.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    laundrySessions.belongsTo(models.laundry_users, { as: 'user', foreignKey: 'user_id' });
  };

  return laundrySessions;
};
