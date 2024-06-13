const { Service } = require('feathers-mongoose');

class UserService extends Service {}

module.exports = function (app) {
  const Model = require('../models/user.model');
  app.use('/users', new UserService({ Model }));

  // Add this line to integrate with Swagger
  const service = app.service('users');
  service.docs = {
    description: 'User service',
    definitions: {
      users: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          name: { type: 'string' },
          googleId: { type: 'string' }
        }
      },
      'users list': {
        type: 'array',
        items: { $ref: '#/definitions/users' }
      }
    }
  };
};
