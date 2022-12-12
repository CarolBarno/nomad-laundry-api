// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { logErrors, siteUrl } = require('../common/env');
const { formatEmailTemplate } = require('../common/shared-util');
const { decryptPassword } = require('../smtp/hash-password');
const sendEmail = require('../communications/email');

module.exports = () => {
  return async context => {
    const { app, result } = context;
    const queueEmail = async (email) => {
      return app.service('laundry-email-queue').create(email).catch(error => logErrors('error', error));
    };

    try {
      const template = await app.service('email-template').find({
        query: {
          template_code: 'password_change_ack',
          $limit: 1
        }
      }).catch(error => logErrors('error', error));

      const siteSettings = await app.service('laundry-site-settings').find({
        query: {
          is_host: 1,
          $limit: 1
        },
        paginate: false
      });

      const [{ site_name, company_name, contact_email, contact_phone, site_logo }] = siteSettings;
      let rawHtml = template.data[0].email_content;
      let replacements = {
        username: result.first_name,
        this_year: new Date().getFullYear(),
        site_url: siteUrl,
        site_name,
        company: company_name,
        contact_email,
        contact_phone,
        site_logo,
        updated_date: new Date(result.updatedAt).toLocaleString()
      };

      let html = formatEmailTemplate(rawHtml, replacements);
      let smtpSettings = siteSettings[0];

      let password = decryptPassword(smtpSettings.smtp_password);
      smtpSettings.smtp_password = password;
      smtpSettings = { smtp_settings: smtpSettings };

      const emailData = {
        to_who: result.email,
        subject: template.data[0].subject || 'Password Changed',
        message: html,
        user_id: result.id,
        sent: false,
        email_template_id: template.data[0].id
      };

      sendEmail(emailData, smtpSettings).then(() => {
        emailData.sent = true;
        queueEmail(emailData).catch(error => logErrors('error', error));
      }).catch(error => {
        queueEmail(emailData).catch(e => logErrors('error', e));
        logErrors('error', error);
      });
    } catch(error) {
      logErrors('error', error);
    }
    
    return context;
  };
};
