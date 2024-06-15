const { Service } = require('feathers-mongoose');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField, validateSchema } = require('feathers-hooks-common');
const { koiCreateRequestSchema, koiPatchRequestSchema, koiResponseSchema } = require('./schemas');

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
        }),
        validateSchema(koiCreateRequestSchema, { abortEarly: false })
      ],
      update: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'params.query.createdBy'
        }),
        setField({
          from: 'params.user._id',
          as: 'data.updatedBy'
        }),
        validateSchema(koiCreateRequestSchema, { abortEarly: false })
      ],
      patch: [
        authenticate('jwt'),
        setField({
          from: 'params.user._id',
          as: 'params.query.createdBy'
        }),
        setField({
          from: 'params.user._id',
          as: 'data.updatedBy'
        }),
        validateSchema(koiPatchRequestSchema, { abortEarly: false })
      ]
    },
    after: {
      all: [validateSchema(koiResponseSchema, { abortEarly: false, context: 'response' })]
    }
  });

  service.docs = {
    description: 'Koi service',
    definitions: {
      koi: {
        type: 'object',
        required: ['name', 'platform', 'sex', 'categories', 'tel', 'link', 'followers', 'photoCost', 'videoCost', 'er', 'createdBy', 'updatedBy'],
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
          createdBy: { type: 'string' },
          updatedBy: { type: 'string' }
        }
      },
      'koi list': {
        type: 'array',
        items: { $ref: '#/definitions/koi' }
      }
    }
  };
};
