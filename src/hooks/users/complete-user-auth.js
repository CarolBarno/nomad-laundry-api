// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { GeneralError } = require('@feathersjs/errors');

module.exports = () => {
  return async context => {
    const { id, params } = context;
    const { user } = params;

    if(!user) throw new GeneralError('Unauthorized');

    if(id !== user.id) throw new GeneralError('Unauthorized');

    const { two_step_auth_set } = user;

    if(!two_step_auth_set) throw new GeneralError('Two step auth is not enabled. Please login and enable id under profile>security');

    const newData ={
      two_step_auth_status: true
    };

    context.data = { ...newData };
    return context;
  };
};
