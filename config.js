'use strict';

const fs = require('fs');
const path = require('path');

const config = {
  PORT: 3035,

  DB_NAME: 'link_test',
  DB_HOST: '127.0.0.1',
  DB_USER: 'link_test',
  TABLE_NAME: 'links',

  URL_MAX_LENGTH: 300,

  INFO: true,

  BASE: 52,
  HASH_LENGTH: 5
};

// don't run if config is malformed
const ovewriteConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
if (ovewriteConfig.MONGO_NAME || ovewriteConfig.MONGO_PASSWORD
    && !(ovewriteConfig.MONGO_NAME && ovewriteConfig.MONGO_PASSWORD)) {
  throw new Error('bad mongo credentials');
}
Object.assign(config, ovewriteConfig);

module.exports = config;
