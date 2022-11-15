// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require('@feathersjs/errors');
const logger = require('../../logger');
let clientValidations = {};

clientValidations.signup = values => {
  const errors = {};
  checkEmail(values.email, errors);
  checkIdNumber(values.id_number, errors);
  checkPassword(values.password, errors);
  checkConfirmPassword(values.password, values.confirm_password, errors);

  return errors;
};

clientValidations.signupAsync = ({ email, id_number }, context) =>
  new Promise((resolve, reject) => {
    const errs = {};
    // set a error message
    context.app.service('users').find({
      query: {
        $or: [
          email,
          id_number
        ],
        $limit: 1
      }
    }).then(
      ({ total, data }) => {
        if (total > 0) {
          let userInformation = data[0];
          for (let i in userInformation) {
            if (userInformation[i] === email) {
              errs.user_email = 'Email already taken.';
            } else if (userInformation[i] === id_number) {
              errs.id_number = 'ID number already registered';
            }
          }
        }
        if (!Object.keys(errs).length) {
          resolve(null);
        }
        reject(new errors.BadRequest('Values already taken.', { errors: errs }));
      }
    ).catch(err => {
      logger.error(err.message, { time: `${new Date().toLocaleTimeString()}`, user: {}, data: {}, userAgent: '', requestUrl: '' });
      return new errors.Unavailable('Actions could not be completed at the moment try again later', { errors: errs });
    });

  });

module.exports = clientValidations;

function checkEmail(email, fieldName = 'email') {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let test = regex.test(String(email).toLowerCase());
  if (!test) {
    errors[fieldName] = 'Wrong email format';
  }
}

function checkConfirmPassword(password, confirm_password, errors, fieldName = 'Password') {
  if (!Object.is(password.trim(), confirm_password.trim())) {
    errors[fieldName] = 'Password do not match';
  }

}

function checkIdNumber(idNumber, errors, fieldName = 'id_number') {
  if (!/^[a-z0-9]+$/i.test((idNumber || '').trim())) {
    errors[fieldName] = 'Wrong id/passport format';
  }
}

function checkPassword(password, errors, fieldName = 'password') {
  if (!/(?=.{5,})/.test((password || '').trim())) {
    errors[fieldName] = 'Password must be at least 5 characters.';
  }
}

