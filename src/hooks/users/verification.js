// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { GeneralError } = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const {app, params, data} = context;
    delete data.action;
    let objKey = Object.keys(data).filter(o => o == 'email' || o == 'phone_number');
    let key = objKey.join();
    context.validation = true;

    switch(data[key]) {
    case data.email: {      
      const email = data.email;
      let found = await app.service('users')._find({query: {email}}, params);

      if(found.total) {
        throw new GeneralError('Email is already registered', {taken: true});
      }else {
        context.result = {taken: false};
        return context;
      }
    }
    case data.phone_number: {
      const phone_number = data.phone_number;
      let isPhone = await app.service('users')._find({query: {phone_number}}, params);

      if(isPhone.total) {
        throw new GeneralError('Phone number is already registered', {taken: true});
      }else {
        context.result = {taken: false};
        return context;
      }
    }

    default:
      break;
    }
    return context;
  };
};
