'use strict';

const path = require('path');

const rootDir = path.join(__dirname, '..');

module.exports = {
  normalizeUrl(url) {
    let urlChunks = url.split('?');
    url = urlChunks[0];
    if (url === '/' || url === '/index.htm') {
      url = '/static/index.html';
    }

    let query = {};
    if (urlChunks.length > 1) {
      let queryStr = urlChunks[1];
      let queryChunks = queryStr.split('&');
      for (let chunk of queryChunks) {
        let [key, val] = chunk.split('=');
        query[key] = val;
      }
    }
    return {url, query};
  },

  logRequest(req, code) {
    console.log(`${(new Date()).toLocaleString()} ${req.method} ${code} ${req.url}`);
  },

  endResponse(res, statusCode, message) {
    res.statusCode = statusCode;
    res.end(message ? message : '');
    res._endHandler.resolve(statusCode);
  },

  rootDir
};