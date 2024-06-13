const { Service } = require('feathers-mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const postmark = require('postmark');
const User = require('../models/user.model');

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

class UserService extends Service {
  async create(data, params) {
    const { email, name } = data;
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = await User.create({ email, name, verificationToken });

    await client.sendEmailWithTemplate({
      From: 'no-reply@yourdomain.com',
      To: email,
      TemplateAlias: 'email-verification',
      TemplateModel: {
        product_url: 'http://yourdomain.com',
        name: name,
        action_url: `http://yourdomain.com/verify-email?token=${verificationToken}`,
        product_name: 'Your Product Name',
        company_name: 'Your Company Name',
        company_address: 'Your Company Address',
      },
    });

    return user;
  }

  async verifyEmail(token) {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      throw new Error('Invalid or expired token.');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return user;
  }

  async setPassword(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found.');
    }

    if (!user.isVerified) {
      throw new Error('Email not verified.');
    }

    user.password = password;
    await user.save();

    return user;
  }

  async find(params) {
    return super.find(params);
  }

  async get(id, params) {
    return super.get(id, params);
  }

  async update(id, data, params) {
    return super.update(id, data, params);
  }

  async patch(id, data, params) {
    return super.patch(id, data, params);
  }

  async remove(id, params) {
    return super.remove(id, params);
  }
}

module.exports = function (app) {
  const Model = require('../models/user.model');
  app.use('/users', new UserService({ Model }));

  const service = app.service('users');
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
