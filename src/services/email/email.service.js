// Initializes the `email` service on path `/email`
const { Email } = require('./email.class');
const hooks = require('./email.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/email', new Email(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('email');

  service.hooks(hooks);
};
