'use strict';

const router = require('./router');
const utils = require('../services/utils');

const methodHandlers = {
  POST(req, res) {
    let { url } = utils.normalizeUrl(req.url);
    staticHandler.serve(url, res, true);
  }
};



module.exports.handle = router.createHandler(methodHandlers);
