'use strict';

const Bluebird = require('bluebird');
const punycode = require('punycode');
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
      if (/(\<|\>)/.test(url)) {
        reject('bad url');
      } else {
        let prefix = /^https/.test(url) ? 'https://' : 'http://';
        url = url.replace(prefix, '');
        url = punycode.toASCII(url);
        url = prefix + url;
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