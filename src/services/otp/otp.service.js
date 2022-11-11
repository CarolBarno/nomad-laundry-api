// Initializes the `otp` service on path `/otp`
const { Otp } = require('./otp.class');
const hooks = require('./otp.hooks');

module.exports = function (app) {

  // Initialize our service with any options it requires
  app.use('/otp', new Otp());

  // Get our initialized service so that we can register hooks
  const service = app.service('otp');

  service.hooks(hooks);
};
