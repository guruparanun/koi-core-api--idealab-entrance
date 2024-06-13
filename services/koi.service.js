const { Service } = require('feathers-mongoose');

class KoiService extends Service { }

module.exports = function (app) {
  const Model = require('../models/koi.model');
  app.use('/koi', new KoiService({ Model }));
};
