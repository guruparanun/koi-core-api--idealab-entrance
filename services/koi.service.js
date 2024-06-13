const { Service } = require('feathers-mongoose');

class KoiService extends Service {}

module.exports = function (app) {
  const Model = require('../models/koi.model');
  app.use('/koi', new KoiService({ Model }));

  // Add this line to integrate with Swagger
  const service = app.service('koi');
  service.docs = {
    description: 'Koi service',
    definitions: {
      koi: {
        type: 'object',
        required: ['name', 'platform', 'sex', 'categories', 'tel', 'link', 'followers', 'photoCost', 'videoCost', 'er'],
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
          er: { type: 'string' }
        }
      },
      'koi list': {
        type: 'array',
        items: { $ref: '#/definitions/koi' }
      }
    }
  };
};
