'use strict';

const mysql = require('mysql');
const Bluebird = require('bluebird');

let config;

module.exports.connectToDb = function connectToDb(_config, cb) {
  config = _config;
  initQueryStrings();
  handleDisconnect(cb);
}


function handleDisconnect(cb) {
  const db = {};

  db.connection = mysql.createConnection({
    host     : config.DB_HOST,
    user     : config.DB_USER,
    password : config.DB_PAS,
    database : config.DB_NAME,
    charset  : 'utf8mb4'
  });

  db.connection.connect(
    err => {
      if (err) {
        console.error((new Date()).toLocaleString(), 'error connecting to db', err);
        setTimeout(() => { handleDisconnect(); }, 200);
      } else {
        console.log((new Date()).toLocaleString(), 'CONNECTED TO DB');
        if (cb) {
          ensureTableExists(db)
          .then(() => {
            module.exports.db = db;
            cb();
          })
          .catch(err2 => {
            console.error('can\'t connect');
            throw err2;
          })
        }
      }
    }
  );

  db.connection.on(
    'error',
    err => {
      console.error((new Date()).toLocaleString(), 'connection error', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
      } else {
        throw err;
      }
    }
  );
}



let checkTableExistsQuery;
let createLinkTable;
function ensureTableExists(db) {
  return new Bluebird((resolve, reject) => {
    db.connection.query(
      checkTableExistsQuery,
      [],
      err => {
        if (err && err.code === 'ER_NO_SUCH_TABLE') {
          resolve(
            initLinksTable(db)
          );
        } else if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

function initLinksTable(db) {
  return new Bluebird((resolve, reject) => {
    db.connection.query(
      createLinkTable,
      [],
      err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}


function initQueryStrings() {
  checkTableExistsQuery =
    ' SELECT * ' +
      ' FROM ' + config.TABLE_NAME +
      ' LIMIT 1' +
      ';';
  createLinkTable =
    ' CREATE TABLE ' + config.TABLE_NAME +
      ' (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,' +
      ' url VARCHAR(' + config.URL_MAX_LENGTH + ') NOT NULL,' +
      ' primary key(id)' +
    ' ) character set utf8;';
}