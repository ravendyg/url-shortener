'use strict';

const router = require('./router');
const utils = require('../services/utils');
const link = require('../repository/link');

const methodHandlers = {
  GET(req, res) {
    let hashMatch = req.parsedUrl.match('[a-zA-Z]*\/?$');

    if (!hashMatch.length) {
      utils.endResponse(res, 400, 'bad url');
      return;
    }

    let hash = hashMatch[0].replace(/\/$/, '');

    link.getRecord(hash)
    .then(url => {
      res.statusCode = 301;
      res.setHeader('location', url);
      res.end();
      res._endHandler.resolve(301);
    })
    .catch(err => {
      if (err === 'not found') {
        utils.endResponse(res, 404);
      } else {
        console.error(err.stack);
        utils.endResponse(res, 500);
      }
    });
  }
};



module.exports.handle = router.createHandler(methodHandlers);
