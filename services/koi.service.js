const { Service } = require('feathers-mongoose');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-hooks-common');

class KoiService extends Service {}

module.exports = function (app) {
  const Model = require('../models/koi.model');
  app.use('/koi', new KoiService({ Model }));

  const service = app.service('koi');

  service.hooks({
    before: {
      all: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'params.query.createdBy'
        })
      ],
      create: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'data.createdBy'
        })
      ]
    }
  });

  service.docs = {
    description: 'Koi service',
    definitions: {
      koi: {
        type: 'object',
        required: ['name', 'platform', 'sex', 'categories', 'tel', 'link', 'followers', 'photoCost', 'videoCost', 'er', 'createdBy'],
        properties: {
          name: { type: 'string' },
          platform: { type: 'string' },
          sex: { type: 'string' },
          categories: { type: 'array', items: { type: 'string' } },
          tel: { type: 'string' },
          link: { type: 'string' },
          followers: { type: 'number' },
          photoCost: { type: 'number' },
          videoCost: { type: 'number' },
          er: { type: 'string' },
          createdBy: { type: 'string' }
        }
      },
      'koi list': {
        type: 'array',
        items: { $ref: '#/definitions/koi' }
      }
    }
  };
};
