// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// this function check whether to perform some function on hooks or skip them;
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => (...args) => (context) => args.includes(context.data.action);
