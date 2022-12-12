// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { logErrors, siteUrl } = require('../common/env');
const { formatEmailTemplate } = require('../common/shared-util');
const { decryptPassword } = require('../smtp/hash-password');
const sendEmail = require('../communications/email');

module.exports = () => {
  return async context => {
    const { app, data } = context;
    const { action, userId, email, subject, html_link, html_backup, first_name, email_template } = data;

    if(action !== 'userRegistration' || !email) return context;

    const queueEmail = async (email) => {
      return await app.service('laundry-email-queue').create(email).catch(error => logErrors('error', error));
    };

    const emailTemplate = await app.service('email-template').find({ query: { template_code: email_template, $limit: 1 } }).catch(
      error => { 
        logErrors('error', error); 
        const alternate = 'Dear user, welcome to Nomad Laundry platform. Thank you!';
        return { data: alternate };
      }
    );

    const siteSettings = await app.service('laundry-site-settings').find({ query: { is_host: true, $limit: 1 }, paginate: false });
    const [{ site_name, company_name,contact_emai, contact_phone, site_logo }] = siteSettings;

    const replacements = {
      link: html_link,
      username: `${first_name}`,
      this_year: new Date().getFullYear(),
      site_url: siteUrl,
      site_name,
      company: company_name,
      contact_emai,
      contact_phone,
      site_logo
    };

    let html = formatEmailTemplate(emailTemplate.data[0].email_content, replacements);
    const emailData = {
      to_who: email,
      message: html || html_backup,
      subject: emailTemplate.data[0].email_subject || subject,
      user_id: userId,
      sent: false,
      email_template_id: emailTemplate.data[0].id
    };

    let smtpSettings = siteSettings[0];
    let password = decryptPassword(smtpSettings.smtp_password);
    smtpSettings.smtp_password = password;
    smtpSettings = { smtp_settings: smtpSettings };

    sendEmail(emailData, smtpSettings).then(() => {
      emailData.sent = true;
      queueEmail(emailData).catch(e => logErrors('error', e));
    }).catch(e => {
      queueEmail(emailData).catch(e => logErrors('error', e));
      logErrors('error', e);
    });

    return context;
  };
};
