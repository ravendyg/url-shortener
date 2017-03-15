'use strict';

const router = require('./router');
const utils = require('../services/utils');

const methodHandlers = {
  POST(req, res) {
    let { url } = utils.normalizeUrl(req.url);
    staticHandler.serve(url, res, true);
  },
  HEAD(req, res) {
    let { url } = utils.normalizeUrl(req.url);
    staticHandler.serve(url, res, false);
  }
};



module.exports.handle = router.createHandler(methodHandlers);
