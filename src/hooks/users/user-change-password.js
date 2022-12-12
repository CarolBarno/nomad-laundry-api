// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { GeneralError } = require('@feathersjs/errors');
const { comparePasswords } = require('./compare-hash');


module.exports = () => {
  return async context => {
    const { data, id, app, params } = context;

    if(!data.new_password) throw new GeneralError('Password field cannot be empty');

    let currentTime = new Date();
    currentTime.setMonth(currentTime.getMonth() + 3);
    data.password_expiry = currentTime;

    const { user } = params;
    if(id === user.id) {
      let { current_password, new_password } = data;
      current_password = current_password.trim();
      new_password = new_password.trim();

      const savedUser = await app.service('users').get(id);
      const passwordData = {
        old_password: savedUser.password,
        new_password: current_password
      };

      const passwordMatch = await comparePasswords(passwordData).catch(error => error);
      if(passwordMatch === true) {
        if(Object.is(current_password, new_password)) {
          throw new GeneralError('Your current password should not be the same as the new one');
        } else {
          data.password = new_password;
        }
      } else {
        throw new GeneralError('Current password provided is incorrect');
      }
    }

    context.ackUserPasswordChange = true;
    return context;
  };
};
