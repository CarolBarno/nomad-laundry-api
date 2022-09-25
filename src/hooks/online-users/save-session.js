// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = async (app, payload) => {

  if (!payload.accessToken) {
    return;
  }

  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 2);
  let data = {
    session_expiry: expiry,
    user_id: payload.user.id,
    access_token: payload.accessToken
  };

  return await app.service('laundry-users-online')._create(data);
};
