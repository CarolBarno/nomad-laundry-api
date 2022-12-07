// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const filterEmails = (email = '') => {
  const mailPart = email.split('@');
  const domain = mailPart[1];
  let isTestMail = false;
  const domainParts = domain.split('.');

  if((domainParts[0] || '').toLowerCase().trim() === 'test') {
    isTestMail = true;
  } else if((domainParts[1] || '').toLowerCase().trim() === 'nomadlaundry') {
    isTestMail = true;
  }

  return isTestMail;
};

module.exports =  { filterEmails };
