exports.Email = class Email {
  constructor (options) {
    this.options = options || {};
  }

  async find () {
    return [];
  }

  async get (id) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data) {
    return data;
  }

  async patch (id, data) {
    return data;
  }

  async remove (id) {
    return { id };
  }
};
