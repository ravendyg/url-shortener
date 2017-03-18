'use strict';

const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const gzip = zlib.createGzip();

const staticDir = path.join(__dirname, '..', 'static');
const zipDir = path.join(__dirname, '..', 'gzip');
const staticZipDir = path.join(zipDir, 'static');
const bundle = path.join(staticDir, 'bundle.js');
const bundleZip = path.join(staticZipDir, 'bundle.js.gz');

if (!fs.existsSync(zipDir)) {
  fs.mkdirSync(zipDir);
}
if (!fs.existsSync(staticZipDir)) {
  fs.mkdirSync(staticZipDir);
}

exec('./node_modules/.bin/webpack -p', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
  } else {
    console.log(stdout);
    console.error(stderr);

    let src = fs.createReadStream(bundle);
    let target = fs.createWriteStream(bundleZip);
    src.pipe(gzip).pipe(target);

    target.on('finish', () => {
      console.log('done');
      process.exit(0);
    })

    src.on('error', errorHandler);
    target.on('error', errorHandler);
  }
});

function errorHandler(err) {
  console.error(err);
}