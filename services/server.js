'use strict';

const http = require('http');
const staticRoute = require('../routes/static');
const utils = require('./utils');
const Bluebird = require('bluebird');

const headersParser = require('./headers-parser');
const urlParser = require('./url-parser');
const bodyParser = require('./body-parser');


module.exports.start = function startServer(config) {
  const server = http.createServer(
    function requestListener(req, res) {

      urlParser.parseUrl(req);
      headersParser.parseHeaders(req);
      bodyParser.parseJson(req);

      new Bluebird(resolve => {
        res._endHandler = {resolve};

        if (/(\/|\/index.html?)/.test(req.parsedUrl)) {
          staticRoute.handle(req, res);
        } else if (/^\/static/.test(req.parsedUrl)) {
          staticRoute.handle(req, res);
        } else {
          resolve(404);
        }
      })
      .then(result => {
        if (result >= 400) {
          endResponse(res, result);
        }
        if (config.INFO) {
          utils.logRequest(req, result);
        }
      })
      .catch(err => {
        console.error(err.stack ? err.stack : err);
        endResponse(res, err.statusCode || 500);
        if (config.INFO) {
          utils.logRequest(req, err.statusCode || 500);
        }
      });
    }
  );

  server.listen(config.PORT, function listenCb() {
    console.log('Listen on ' + config.PORT);
  });
}

function endResponse(res, statusCode) {
  res.statusCode = statusCode;
  res.end();
}

