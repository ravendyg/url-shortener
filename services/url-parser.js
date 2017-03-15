'use strict';


module.exports = {
  parseUrl
};

function parseUrl(req) {
  let urlParts = req.url.split('?');
  let parsedUrl = urlParts[0];
  let query = {};
  try {
    if (urlParts[1]) {
      for (let queryItem of urlParts[1].split('&')) {
        let [key, value] = queryItem.split('=');
        query[key] = value;
      }
    }
  } catch (err) {
    //
  }

  if (parsedUrl === '/' || parsedUrl === '/index.htm') {
      parsedUrl = '/static/index.html';
    }

  Object.assign(req, {parsedUrl, query});
}