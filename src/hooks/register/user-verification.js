// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { logErrors, siteUrl } = require('../common/env');
const { formatEmailTemplate } = require('../common/shared-util');
const { decryptPassword } = require('../smtp/hash-password');
const sendEmail = require('../communications/email');

module.exports = () => {
  return async context => {
    const { app, data } = context;
    const htmlBackup = `Hello ${data.user}, your One Time Pin is ${data.code}`;

    const queueEmail = async (email) => {
      return await app.service('laundry-email-queue').create(email).catch((error) => logErrors('error', error));
    };

    const template = await app.service('email-template').find({ query: { template_code: 'password_verification_code', $limit: 1 } }).catch(error => logErrors('error', error));
    const siteSettings = await app.service('laundry-site-settings').find({ query: { is_host: true, $limit: 1 }, paginate: false });
    const [{ site_name, company_name,  contact_email, contact_phone, site_logo }] = siteSettings;

    let rawHtml = template.data[0].email_content;
    let replacemets = {
      code: data.code,
      username: data.user,
      this_year: new Date().getFullYear(),
      site_url: siteUrl,
      site_name,
      company: company_name,
      contact_email,
      contact_phone,
      site_logo
    };

    let html = formatEmailTemplate(rawHtml, replacemets);
    let smtpSettings = siteSettings[0];
    let password = decryptPassword(smtpSettings.smtp_password);
    smtpSettings.password = password;
    smtpSettings = { smtp_settings: smtpSettings };

    const emailData = {
      to_who: data.email,
      subject: template.data[0].subject || 'Verification Code',
      message: html || htmlBackup,
      user_id: data.id,
      sent: true,
      email_template_id: template.data[0].id
    };

    sendEmail(emailData, smtpSettings).then(() => {
      emailData.sent = true;
      queueEmail(emailData).catch(error => logErrors('error', error));
    }).catch(error => {
      emailData.sent = false;
      queueEmail(emailData).catch(error => logErrors('error', error));
      logErrors('error', error);
    });

    return context;
  };
};
