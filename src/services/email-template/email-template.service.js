// Initializes the `email-template ` service on path `/email-template`
const { EmailTemplate } = require('./email-template.class');
const createModel = require('../../models/email-template.model');
const hooks = require('./email-template.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['create']
  };

  // Initialize our service with any options it requires
  app.use('/email-template', new EmailTemplate(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('email-template');

  service.hooks(hooks);
};
