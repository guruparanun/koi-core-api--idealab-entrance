const { Service } = require('feathers-mongoose');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow, setField } = require('feathers-hooks-common');

class UserService extends Service {}

module.exports = function (app) {
  const Model = require('../models/user.model');
  app.use('/users', new UserService({ Model }));

  const service = app.service('users');

  service.hooks({
    before: {
      all: [authenticate('jwt')],
      find: [disallow('external')],
      get: [authenticate('jwt')],
      create: [],
      update: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'params.query._id'
        })
      ],
      patch: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'params.query._id'
        })
      ],
      remove: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'params.query._id'
        })
      ]
    }
  });

  service.docs = {
    description: 'User service',
    definitions: {
      users: {
        type: 'object',
        required: ['email', 'name'],
        properties: {
          email: { type: 'string' },
          name: { type: 'string' },
          password: { type: 'string' },
          googleId: { type: 'string' },
          isVerified: { type: 'boolean' },
          verificationToken: { type: 'string' }
        }
      },
      'users list': {
        type: 'array',
        items: { $ref: '#/definitions/users' }
      }
    }
  };
};
