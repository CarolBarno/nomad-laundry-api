// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = async (app, token) => {

  if (!token) {
    return;
  }

  let time = new Date();
  const userSession = await app.service('laundry-sessions').find({
    query: {
      access_token: token,
      session_expiry: { $gte: time },
      $limit: 0
    }
  });

  return userSession.total > 0 ? true : false;
};
