'use strict';

const router = require('./router');
const staticHandler = require('../services/static');

const methodHandlers = {
  GET(req, res) {
    staticHandler.serve(req, res, true);
  },
  HEAD(req, res) {
    staticHandler.serve(req, res, false);
  }
};



module.exports.handle = router.createHandler(methodHandlers);
