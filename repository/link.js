'use strict';

const Bluebird = require('bluebird');
const db = require('../db/link');
const hash = require('../services/hash');

module.exports = {
  createRecord, getRecord
};


function createRecord(url) {
  return new Bluebird(function createRecordPromised(resolve, reject) {
    if (!url) {
      reject('bad url');
    } else {
      if (!/^http/.test(url)) {
        url = 'http://' + url;
      }
      if (/(\<|\>)/.test(url)) {
        reject('bad url');
      } else {
        resolve(db.createRecord(url));
      }
    }
  })
  .then(hash.numberToHash);
}

function getRecord(hashCode) {
  return db.findRecord(
    hash.hashToNumber(hashCode)
  );
}