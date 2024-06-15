const { Service } = require('feathers-mongoose');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow, setField, validateSchema } = require('feathers-hooks-common');
const { userCreateRequestSchema, userPatchRequestSchema, userResponseSchema } = require('./schemas');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class UserService extends Service {
  async verifyEmail(token) {
    const user = await this.Model.findOne({ verificationToken: token });

    if (!user) {
      throw new Error('Invalid or expired token.');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return user;
  }

}

module.exports = function (app) {
  const Model = require('../models/user.model');
  app.use('/users', new UserService({ Model }));

  const service = app.service('users');

  service.hooks({
    before: {
      all: [authenticate('jwt')],
      find: [disallow('external')],
      get: [authenticate('jwt')],
      create: [validateSchema(userCreateRequestSchema, { abortEarly: false })],
      update: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'params.query._id'
        }),
        validateSchema(userCreateRequestSchema, { abortEarly: false })
      ],
      patch: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'params.query._id'
        }),
        validateSchema(userPatchRequestSchema, { abortEarly: false })
      ],
      remove: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'params.query._id'
        })
      ]
    },
    after: {
      all: [validateSchema(userResponseSchema, { abortEarly: false, context: 'response' })]
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
