'use strict';

const router = require('./router');
const link = require('../repository/link');

const methodHandlers = {
  POST(req, res, config) {
    if (!req.body.url) {
      endResponse(res, 400, 'bad url');
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
          endResponse(res, 400, 'bad url');
        } else {
          console.error(err.stack);
          endResponse(res, 500);
        }
      });
    }
  }
};

function endResponse(res, statusCode, message) {
  res.statusCode = statusCode;
  res.end(message ? message : '');
  res._endHandler.resolve(statusCode);
}



module.exports.handle = router.createHandler(methodHandlers);
