'use strict';

const Bluebird = require('bluebird');
const db = require('../db/link');
const hash = require('../services/hash');

module.exports = {
  createRecord, getRecord
};


function createRecord(url) {
  return new Bluebird(function createRecordPromised(resolve, reject) {
    url = url.replace(/\?.*/, '');
    if (!/^http/.test(url)) {
      url = 'http://' + url;
    }
    let temp = url.replace(/^https?\:\/\//, '');
    if (/[^a-zA-Z0-9\_\-\.]/.test(temp)) {
      reject('bad url');
    } else {
      resolve(db.createRecord(url));
    }
  })
  .then(hash.numberToHash);
}

function getRecord(hashCode) {
  return db.findRecord(
    hash.hashToNumber(hashCode)
  );
}