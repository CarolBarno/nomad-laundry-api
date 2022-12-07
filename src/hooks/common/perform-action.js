// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// this function check whether to perform some function on hooks or skip them;

module.exports = (...args) => context => args.includes(context.data.action);

