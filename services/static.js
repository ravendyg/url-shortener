'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');


module.exports = {
  serve(req, res, isGet) {
    let gzip = /gzip/.test(req.headers['accept-encoding']);
    let {targetFile, targetZipFile} = createPathToFileFromUrl(req.parsedUrl, gzip);

    let cb = isGet
      ? sendFile
      : () => {
        res.end();
        res._endHandler.resolve(200);
      };

    if (targetZipFile) {
      fs.exists(targetZipFile, exists => {
        if (exists) {
          targetFile = targetZipFile;
          res.setHeader('content-encoding', 'gzip');
        }
        fs.stat(targetFile, getFileStat(targetFile, res, cb));
      });
    } else {
      fs.stat(targetFile, getFileStat(targetFile, res, cb));
    }
  }
};


function getFileStat(targetFile, res, cb) {
  return function fileStat(err, stat) {
    if (err && err.code === 'ENOENT') {
      endResponse(res, 404);
    } else if (err) {
      endResponse(res, 500);
    } else {
      res.setHeader('content-length', stat.size);
      cb(targetFile, res);
    }
  }
}

function endResponse(res, statusCode) {
  res.statusCode = statusCode;
  res.end();
  res._endHandler.resolve(statusCode);
}

function sendFile(targetFile, res) {
  let file = fs.createReadStream(targetFile);
  file.pipe(res);
  file.on('error', streamErrorHandler(file, res));
  file.on('end', fileFinishHandler(res));
  file.on('finish', fileFinishHandler(res));
  res.on('error', streamErrorHandler(file, res));
}


function createPathToFileFromUrl(url, gzip) {
  let pathChunks = url.split('/');
  let targetFile = [''].concat(pathChunks)
    .reduce((acc, e) => path.join(acc, e), '');
  let targetZipFile = gzip ? path.join(utils.rootDir, 'gzip', targetFile) + '.gz' : null;
  targetFile = path.join(utils.rootDir, targetFile);
  return {targetFile, targetZipFile};
}

function fileFinishHandler(res) {
  return function () {
    res._endHandler.resolve(200);
  }
}

function streamErrorHandler(file, res) {
  return function () {
    if (!res.finished) {
      res._endHandler.resolve(500);
    }
    file.destroy();
  }
}
