const { createLogger, format, transports } = require('winston');

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();
// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.File({
      filename: `error-logs/${year}/${month}/${day}/syatem-logs.log`,
      level: 'info'
    })
  ],
});

module.exports = logger;
