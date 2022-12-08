// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const logger = require('../../logger');
const { BadRequest } = require('@feathersjs/errors');
const { isProd } = require('../common/env');
const crypto = require('crypto');

function generateOtp() {
  let otp = 100000 + Math.floor(Math.random() * 900000);
  return otp;
}

function sendSms() {
  return async context => {
    const { app, data } = context;
    data.otp = generateOtp();

    if(!data.otp) {
      let error = new BadRequest('Field cannot be empty');
      return Promise.reject(error);
    }

    let userInfo = {
      destination: data.phone_number,
      message: isProd ? `Dear ${data.first_name}, your OTP is xxxxxx` : `Dear ${data.first_name}, your OTP is ${data.otp}`,
      otp: true
    };

    if(data.action === 'resendPassword') {
      userInfo.action = 'resendPassword';
    }

    if(data.phone_number) {
      data.userMessage = userInfo;
    }

    if(data.sendEmail) {
      const emailData = {
        code: data.otp,
        user: data.first_name,
        id: data.id,
        email: data.email,
        action: 'sendOTP'
      };

      await app.service('email').create(emailData).catch(error => logger.log('error', error));
    }

    return context;
  };
}

function hashOtp() {
  return async context => {
    const { app, data } = context;
    const algorithm = 'aes-256-cbc';
    const password = 'eAuqtion==!203sIEnsj2021..4s566s';
    const iv = 'abd88a893f0bc4b5';

    const cipher = crypto.createCipheriv(algorithm, password, iv);

    cipher.update(String(data.otp), 'utf-8', 'base64');
    const encrypted = cipher.final('base64');

    data.otp = encrypted;

    let userInfo = data.userMessage;
    userInfo.otp = encrypted;
    await app.service('sms').create(userInfo).catch(e => logger.log('error', e));

    return context;
  };
}

function decipherOtp() {
  return context => {
    const { id } = context;
    const algorithm = 'aes-256-cbc';
    const password = 'eAuqtion==!203sIEnsj2021..4s566s';
    const iv = 'abd88a893f0bc4b5';

    const decipher = crypto.createDecipheriv(algorithm, password, iv);

    decipher.update(id, 'base64', 'utf-8');
    const decrypted = decipher.final('utf-8');
    context.result = {
      otp: decrypted
    };
    return context;
  };
}

module.exports =  { generateOtp, sendSms, hashOtp, decipherOtp };
