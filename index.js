'use strict';

const db = require('./db');
require('./config').init({});

const server = require('./services/server');

db.connectToDb(function dbConnectSuccessHandler() {
  server.start();
});