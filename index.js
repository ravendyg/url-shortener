'use strict';

const config = require('./config');
const db = require('./db');

const server = require('./services/server');

db.connectToDb(config, function dbConnectSuccessHandler() {
  server.start(config);
});