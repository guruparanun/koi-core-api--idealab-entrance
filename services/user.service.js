const { Service } = require('feathers-mongoose');

class UserService extends Service { }

module.exports = function (app) {
  const Model = require('../models/user.model');
  app.use('/users', new UserService({ Model }));
};
