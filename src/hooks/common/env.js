// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const isProd = process.env.NODE_ENV === 'production';

module.exports =  { isProd };
