'use strict';

const router = require('./router');
const utils = require('../services/utils');
const link = require('../repository/link');

const config = require('../config').getConfig();

const methodHandlers = {
  POST(req, res) {
    if (!req.body.url) {
      utils.endResponse(res, 400, 'bad url');
    } else {
      link.createRecord(req.body.url)
      .then(hash => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({url: config.HOST + '/' + hash}));
        res._endHandler.resolve(200);
      })
      .catch(err => {
        if (err === 'bad url') {
          utils.endResponse(res, 400, 'bad url');
        } else {
          console.error(err.stack);
          utils.endResponse(res, 500);
        }
      });
    }
  }
};





module.exports.handle = router.createHandler(methodHandlers);
