// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { logErrors } = require('./env');

function addCreatedUpdatedBy(object, { id }, method) {
  for(let i in object) {
    if(typeof object[i] === 'object' && object[i] !== null && !Array.isArray(object[i])) {
      if(method === 'create') {
        object[i].created_by = id;
        object[i].updated_by = id;
      } else if(method === 'update' || method === 'patch') {
        object[i].updated_by = id;
      }
    }
  }
  return object;
}

module.exports = () => {
  return async context => {
    const { params, data, method, path } = context;
    const { user } = params;
    const allowedServices = ['email-template'];

    try {
      const status = method === 'create' || method === 'update' || method === 'patch';
      const statusTwo = allowedServices.includes(path);
      const statusThree = typeof user === 'object';

      if(!status || !statusTwo || !statusThree) return context;
      if(user.user_type === 1) return context;

      context.data = addCreatedUpdatedBy(data, user, method);
    } catch(error) {
      logErrors('error', error);
    }
    return context;
  };
};
