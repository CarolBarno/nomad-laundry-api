// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = async (app, user) => {

  let time = new Date();
  const userSession = await app.service('laundry-users-online').find({
    query: {
      user_id: user.id,
      session_expiry: { $gte: time },
      $limit: 0
    }
  });

  try {
    await app.service('laundry-users-online')._remove(null, {
      query: {
        session_expiry: { $lt: time }
      }
    });
  } catch (error) {
    return null;
  }

  return userSession.total > 0 ? true : false;
};
