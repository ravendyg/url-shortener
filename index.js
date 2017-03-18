'use strict';

const dns = require('dns');

const db = require('./db');
const config = require('./config');

const server = require('./services/server');


const host = config.getConfig().DB_HOST;
if (host === 'localhost') {
  start(null, host);
} else {
  const options = {
    family: 4,
  };
  dns.lookup(host, options, start);
}

function start(err, address) {
  if (err) {
    console.error(err);
  } else {
    config.init({'DB_HOST': address});

    db.connectToDb(function dbConnectSuccessHandler() {
      server.start();
    });
  }
}