function useStrict() {
  'use strict';
}

useStrict();
const notify = require('./notify');
const authManagement = require('feathers-authentication-management');
const hooks = require('./auth.management.hook');
module.exports = function (app) {
  app.configure(authManagement(notify(app)));
  const service = app.service('authManagement');
  service.hooks(hooks);
};