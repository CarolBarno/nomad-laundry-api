// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { GeneralError } = require('@feathersjs/errors');
const { comparePasswords } = require('./compare-hash');


module.exports = () => {
  return async context => {
    const { data, id, app, params } = context;

    if(data.action === 'enforcePasswordChange' || 'password' in data) {
      let { password } = data;
      password = password.trim();
     
      if(!password) throw new GeneralError('Pasword field cannot be empty');

      const { user } = params;
      let currentTime = new Date();
      currentTime.setMonth(currentTime.getMonth() + 3);
      data.password_expiry = currentTime;

      if(id === user.id) {
        const savedUser = await app.service('users').get(id);

        const passwordData = {
          old_password: savedUser.password,
          new_password: password
        };

        const passwordMatch = await comparePasswords(passwordData).catch(error => error);

        if(passwordMatch === true) throw new GeneralError('Your new password should not be the same as the old one.');
      }

      context.ackUserPasswordChange = true;
    }

    return context;
  };
};
