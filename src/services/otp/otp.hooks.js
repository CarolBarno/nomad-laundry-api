const { iff, validate } = require('feathers-hooks-common');
const performAction = require('../../hooks/common/perform-action');
const validations = require('../../hooks/validations/validate-register-details');
const validateEmail = require('../../hooks/validations/validate-email');
const validatePhoneNumber = require('../../hooks/validations/validate-phone-number');
const { sendSms, hashOtp, decipherOtp } = require('../../hooks/otp');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [decipherOtp()],
    create: [
      iff(performAction('sendEmail'), validate(validations.signup), validate((values, context) => validations.signupAsync(values, context))),
      iff(performAction('userUpdateEmail'), validateEmail()),
      iff(performAction('userUpdatePhone'), validatePhoneNumber()),
      sendSms(), hashOtp()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
