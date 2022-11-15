// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { Forbidden, GeneralError } = require('@feathersjs/errors');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const { data, app, params } = context;
    const { user } = await params;
    const { isVerified } = user;

    if(!isVerified) {
      throw new Forbidden('You need to validate your email address in order to continue.');
    }

    let phoneTaken = await app.service('users').find({
      query: {
        $limit: 0,
        email: data.phone_number
      }
    });

    if(phoneTaken.total > 0) {
      throw new GeneralError('Phone number already registered');
    }

    return context;
  };
};

