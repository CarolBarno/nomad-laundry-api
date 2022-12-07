// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const handlebars = require('handlebars');

const sharedUtil = {};

sharedUtil.formatEmailTemplate = (emailTemplate, data) => {
  const html = handlebars.compile(emailTemplate);
  const replacements = data;
  const htmlToSend = html(replacements);
  return htmlToSend;
};

module.exports =  sharedUtil;
