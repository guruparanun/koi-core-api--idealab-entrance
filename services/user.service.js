const { Service } = require('feathers-mongoose');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { disallow, setField, validateSchema } = require('feathers-hooks-common');
const { userCreateRequestSchema, userPatchRequestSchema, userResponseSchema } = require('./schemas');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const postmark = require('postmark');

class UserService extends Service {
  async create(data, params) {
    // Check if email or googleId exists
    const existingUser = await this.Model.findOne({ 
      $or: [
        { email: data.email },
        { googleId: data.googleId }
      ]
    });
    if (existingUser) {
      throw new Error('Email or Google ID already exists');
    }

    // Set default name with email if not provided
    if (!data.name) {
      data.name = data.email;
    }

    // Generate verification token if email signup
    if (!data.googleId) {
      data.verificationToken = crypto.randomBytes(20).toString('hex');
      
      // Send verification email
      const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
      await client.sendEmail({
        From: 'your-email@example.com',
        To: data.email,
        Subject: 'Verify your email',
        TextBody: `Please verify your email using this token: ${data.verificationToken}`
      });
    }

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return super.create(data, params);
  }

  async verifyEmail(token) {
    const user = await this.Model.findOne({ verificationToken: token });

    if (!user) {
      throw new Error('Invalid or expired token.');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Generate JWT token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return {
      message: 'Email verified successfully.',
      accessToken
    };
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
