// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const logger = require('../../logger');

const isProd = process.env.NODE_ENV === 'production';
const siteUrl = isProd ? 'https://test.nomadLaundry.com' : 'http://localhost:4200';
const tokenUrl = isProd ? 'https://test.nomadLaundry.com/verification/' : 'http://localhost:4200/verification/';

function logErrors(level, error) {
  const currentTime = new Date().toLocaleTimeString();
  logger.log(level, `${error}`, { currentTime });
}

module.exports =  { isProd, logErrors, siteUrl, tokenUrl };
