// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { tokenUrl, logErrors } = require('./env');

module.exports = (app) => {
  function getLink(type, hash) {
    const url = tokenUrl + type + '?token=' + hash;
    return url;
  }

  function sendEmail(email) {
    email.action = 'userRegistration';
    return app.service('email').create(email).catch(error => logErrors('error', error));
  }

  return {
    notifier: function(type, user, notifierOptions) {
      let tokenLink;
      let email;
      let template;

      switch(type) {
      case 'resendVerifySignup': 
        tokenLink = getLink('verify', user.verifyToken);
        if('sendEmailConfig' in notifierOptions) {
          template = 'admin_user_add';
        } else {
          template = 'email_verification';
        }

        email = {
          userId: user.id,
          email: user.email,
          subject: 'Verify Signup',
          first_name: user.first_name,
          html_link: tokenLink,
          email_template: template,
          options: notifierOptions 
        };

        return sendEmail(email);

      case 'verifySignup': 
        tokenLink = getLink('verify', user.verifyToken);
        email ={
          userId: user.id,
          email: user.email,
          first_name: user.first_name,
          subject: 'Email Verified',
          html_backup: 'Thank you for verifying your email',
          email_template: 'mass_account_confirm',
          options: notifierOptions
        };

        return sendEmail(email);

      default:
        break;

      }
    }
  };
};
