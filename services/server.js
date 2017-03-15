'use strict';

const http = require('http');
const Bluebird = require('bluebird');
const utils = require('./utils');

module.exports.start = function startServer(config) {

  const urlParser = require('./url-parser');
  const bodyParser = require('./body-parser');

  return new Bluebird(function startServerPromised(resolve) {
    const server = http.createServer(
      function requestListener(req, res) {

        urlParser.parseUrl(req);

        bodyParser.parseJson(req)
        .then(() => handlePath(req, res, config))
        .then(result => {
          if (result >= 400) {
            endResponse(res, result);
          }
          if (config.INFO) {
            utils.logRequest(req, result);
          }
        })
        .catch(err => {
          if (!err._ok) {
            console.error(err.stack ? err.stack : err);
          }
          endResponse(res, err.statusCode || 500, err._ok ? err.message : '');
          if (config.INFO) {
            utils.logRequest(req, err.statusCode || 500);
          }
        });
      }
    );

    server.listen(config.PORT, function listenCb() {
      console.log('Listen on ' + config.PORT);
      resolve();
    });
  })
}

function handlePath(req, res, config) {

  const staticRoute = require('../routes/static');
  const api = require('../routes/api');
  const redirect = require('../routes/redirect');

  return new Bluebird(resolve => {
    res._endHandler = {resolve};

    if (/(\/$|\/index.html?)/.test(req.parsedUrl)) {
      staticRoute.handle(req, res, config);
    } else if (/^\/static/.test(req.parsedUrl)) {
      staticRoute.handle(req, res, config);
    } else if (/^\/api\/?$/.test(req.parsedUrl)) {
      api.handle(req, res, config);
    } else if (/^\/[a-zA-Z]*\/?$/.test(req.parsedUrl)) {
      redirect.handle(req, res);
    } else {
      resolve(404);
    }
  });
}


function endResponse(res, statusCode, message) {
  res.statusCode = statusCode;
  res.end(message ? message : '');
}

