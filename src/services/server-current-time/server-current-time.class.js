const { Service } = require('feathers-memory');

exports.ServerCurrentTime = class ServerCurrentTime extends Service {

  async get(id) {
    return {
      id,
      currentTime: new Date()
    };
  }

  async find(data) {
    return {
      data,
      currentTime: new Date()
    };
  }

  async create(data) {
    return data;
  }
};
