// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { GeneralError } = require('@feathersjs/errors');
const crypto = require('crypto');

function encryptPassword(field) {
  return context => {
    const { data } = context;
    const algorithm = 'aes-192-cbc';
    const password = crypto.randomBytes(32);
    const key = crypto.scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    if(data.stmp_password) {
      data.stmp_password = data.stmp_password.trim();
      let encrypted = cipher.update(String(data.stmp_password), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      data.stmp_password = encrypted;
    } else {
      let stmp_password = data.smtp_settings[field];
      if(!stmp_password) {
        throw new GeneralError('Smtp password field cannot be empty');
      }

      stmp_password = stmp_password.trim();
      let encrypted = cipher.update(String(stmp_password), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      data.smtp_settings[field] = encrypted;
    }

    return context;
  };
}

function decryptPassword(hashedPass) {
  const algorithm = 'aes-192-cbc';
  const password = crypto.randomBytes(32);
  const key = crypto.scryptSync(password, 'salt', 24);
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(hashedPass, 'hex', 'utf8');
  hashedPass = decrypted += decipher.final('utf8');
  return hashedPass;

}

function unprotect() {
  return context => {

    const { result } = context;
    let { stmp_password } = result;
    if(stmp_password) {
      let password = decryptPassword(stmp_password);
      result.stmp_password = password;
    }

    return context;
  };
}

module.exports = { encryptPassword, decryptPassword, unprotect };
