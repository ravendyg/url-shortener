'use strict';

const Bluebird = require('bluebird');

module.exports = {
  setupParser,
  parseJson
};

let options = {};

/**
 * @param _options: {
 *  contentLength: number,  // in bytes
 * }
 */
function setupParser(_options) {
  options = _options;
}


function parseJson(req) {
  return new Bluebird(function parseJsonPromised(resolve, reject) {
    if (['POST', 'PUT'].indexOf(req.method) === -1) {
      resolve();
      return;
    }

    let len = +req.headers['content-length'];
    let body = '';
    if (!len && len !== 0) {
      sendError(reject, '"chunked" not implemented');
    } else if (!/(utf\-8|utf8)/.test(req.headers['content-type'].toLowerCase())) {
      sendError(reject, 'only utf8 implemented');
    } else {
      req.on('data', chunk => {
        if (len > 0) {
          let str = chunk.toString();
          if (str.length > len) {
            str = str.slice(0, len);
          }
          body += str;
          len -= str.length;
        }
      });
      req.on('end', () => {
        try {
          req.body = JSON.parse(body);
          resolve();
        } catch (err) {
          sendError(reject, 'malformed request', 400);
        }
      });
      req.on('error', () => {
        sendError(reject, '');
      });
      // timeout not implemented
    }
  });
}

function sendError(reject, message, code) {
  let err = new Error(message);
  if (code) {
    err.statusCode = code;
  }
  err._ok = true;
  reject(err);
}