strict();
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable('laundry_users').then(attributes => {
      if (!attributes.id_upload) {
        queryInterface.addColumn('laundry_users', 'id_upload', {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
          after: 'phone_number'
        });
      }
      if (!attributes.two_step_auth_status) {
        queryInterface.addColumn('laundry_users', 'two_step_auth_status', {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
          comment: '1 - authenticated, null - pending, 0 - not authenticated',
          defaultValue: null,
          after: 'password'
        });
      }
      if (!attributes.two_step_auth_set) {
        queryInterface.addColumn('laundry_users', 'two_step_auth_set', {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          default: false,
          comment: '1 - two step auth enabled, 0 - two step auth disabled',
          after: 'password'
        });
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.describeTable('laundry_users').then(attributes => {
      if (attributes.id_upload) {
        queryInterface.removeColumn('laundry_users', 'id_upload');
      }
      if (attributes.two_step_auth_status) {
        queryInterface.removeColumn('laundry_users', 'two_step_auth_status');
      }
      if (attributes.two_step_auth_set) {
        queryInterface.removeColumn('laundry_users', 'two_step_auth_set');
      }
    });
  }
};


function strict() {
  'use strict';
}
