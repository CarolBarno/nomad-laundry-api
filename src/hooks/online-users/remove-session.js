// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = async (app, user, counter = 0) => {

  if (!user || counter > 1) {
    return;
  }

  counter += 1;
  return await app.service('laundry-users-online')._remove(null, {
    query: {
      user_id: user.id,
      $limit: 1
    }
  });
};
