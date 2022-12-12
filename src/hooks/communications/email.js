// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { isProd } = require('../common/env');
const { filterEmails } = require('./filter-test-email');
const nodemailer = require('nodemailer');

module.exports = async function sendNotificationToUsers(emailData, client, attachment)  {
  if(filterEmails(emailData.to_who)) return { sent: true };

  let { smtp_settings } = client;
  let tlsSettings = {};
  if(smtp_settings.layer_security === 'tls') {
    tlsSettings.secure = false;
    tlsSettings.tls = { rejectUnauthorized: false };
  } else {
    tlsSettings.secure = true;
  }

  let transport;
  if(isProd) {
    transport = nodemailer.createTransport({
      host: smtp_settings.smtp_host,
      port: smtp_settings.smtp_port,
      ...tlsSettings,
      auth: {
        user: smtp_settings.smtp_username,
        pass: smtp_settings.smtp_password
      }
    });
  } else {
    let testAccount = await nodemailer.createTestAccount();
    transport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      },
      debug: false
    });
  }

  let info = await transport.sendMail({
    from: `${client.name || smtp_settings.site_name || 'Nomad Laundry'} <${smtp_settings.smtp_username}>`,
    to: emailData.to_who,
    attachments: attachment,
    subject: emailData.subject,
    html: emailData.message,
    bcc: emailData.bcc
  });

  console.log('Email sent', info.accepted);
  console.log('Preview', nodemailer.getTestMessageUrl(info));
};
