// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = () => {
  return async context => {
    const { app, result } = context;
    let { email } = result;
    const changeData = { action: 'resendVerifySignup', value: { email } };
    app.service('authManagement').create(changeData);
    return context;
  };
};
