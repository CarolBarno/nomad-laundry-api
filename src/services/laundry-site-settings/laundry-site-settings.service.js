// Initializes the `laundry-site-settings` service on path `/laundry-site-settings`
const { LaundrySiteSettings } = require('./laundry-site-settings.class');
const createModel = require('../../models/laundry-site-settings.model');
const hooks = require('./laundry-site-settings.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/laundry-site-settings', new LaundrySiteSettings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('laundry-site-settings');

  service.hooks(hooks);
};
