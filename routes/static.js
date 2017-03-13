'use strict';

const router = require('./router');
const staticHandler = require('../services/static');
const utils = require('../services/utils');

const methodHandlers = {
  GET(req, res) {
    let { url } = utils.normalizeUrl(req.url);
    staticHandler.serve(url, res, true);
  },
  HEAD(req, res) {
    let { url } = utils.normalizeUrl(req.url);
    staticHandler.serve(url, res, false);
  }
};



module.exports.handle = router.createHandler(methodHandlers);
