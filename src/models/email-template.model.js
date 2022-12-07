// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const emailTemplate = sequelizeClient.define('laundry_email_template', {
    email_from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_content: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    template_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    template_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: '1 - approved, 0 - disapproved, null - pending'
    },
    approval_ready: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: null,
      comment: '1 - ready, 0 - not ready'
    }
  },
  // {
  //   indexes: [
  //     {
  //       unique: true,
  //       fields: ['template_code']
  //     }
  //   ]
  // },
  {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  emailTemplate.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    emailTemplate.belongsTo(models.laundry_users, {
      as: 'user_created', onDelate: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: 'created_by'
    });
    emailTemplate.belongsTo(models.laundry_users, {
      as: 'user_updated', onDelate: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: 'updated_by'
    });
  };

  return emailTemplate;
};
