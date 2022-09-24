// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = async (app, auth) => {

  const authentication = app.get('authentication');
  let expiryPeriod = authentication.jwtOptions.expiresIn;
  expiryPeriod = expiryPeriod.replace(/\D/g, '');
  expiryPeriod = Number(expiryPeriod);
  expiryPeriod = expiryPeriod || 1;

  let expiry = new Date();
  expiry.setDate(expiry.getDate() + expiryPeriod);
  let data = {
    session_expiry: expiry,
    user_id: auth.user.id,
    access_token: auth.accessToken,
    type: 0
  };

  return await app.service('laundry-sessions').create(data);
};
