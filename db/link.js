'use strict';

const Bluebird = require('bluebird');
const db = require('./index').db;
const config = require('../config').getConfig()

module.exports = {
  createRecord, findRecord
};

const createRecordQuery =
  ' INSERT INTO ' + config.TABLE_NAME +
    ' SET url = ?' +
    ';';
function createRecord(url) {
  return new Bluebird(function createRecordPromised(resolve, reject) {
    db.connection.query(
      createRecordQuery,
      [url],
      function createResHandler(err, res) {
        if (err) {
          reject(err);
        } else if (!res.insertId) {
          reject('can\'t create a record');
        } else {
          resolve(res.insertId);
        }
      }
    );
  });
}

const findRecordQuery =
  ' SELECT url FROM '  + config.TABLE_NAME +
    ' WHERE id = ?' +
    ';';
function findRecord(id) {
  return new Bluebird(function findRecordPromised(resolve, reject) {
    db.connection.query(
      findRecordQuery,
      [id],
      function findRecordResHandler(err, res) {
        if (err) {
          reject(err);
        } else if (!(res.length > 0)) {
          reject('not found');
        } else {
          resolve(res[0].url);
        }
      }
    );
  });
}

