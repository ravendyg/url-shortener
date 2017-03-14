'use strict';

const Bluebird = require('bluebird');
const db = require('../db/link');
const hash = require('../services/hash');

module.exports = {
  createRecord, getRecord
};


function createRecord(url) {
  return new Bluebird(function createRecordPromised(resolve) {
    if (!/^http/.test(url)) {
      url = 'http://' + url;
    }
    url = url.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
    resolve(db.createRecord(url));
  })
  .then(hash.numberToHash);
}

function getRecord(hashCode) {
  return db.findRecord(
    hash.hashToNumber(hashCode)
  );
}