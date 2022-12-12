// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const bcrypt = require('bcryptjs');

const comparePasswords = ({ old_password, new_password }) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(new_password, old_password, (error, same) => {
      if(error || !same) reject(false);
      return resolve(true);
    });
  });
};
module.exports = { comparePasswords };
