/* global before, describe, it */
'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

const config = require('../config');
const hash = require('../services/hash');

before(
  function before(done) {
    config.TABLE_NAME = 'links_test';
    let {connectToDb, resetTable} = require('../db');
    connectToDb(config, function setupDb() {
      resetTable(done);
    });
  }
);

describe('hash conversion',
  function hashConversion() {
    it('calculate hash from number', function calculateHash() {
      assert.equal(0, hash.digitToDecimal('a'));
      assert.equal(51, hash.digitToDecimal('Z'));

      assert.equal('a', hash.calculateDigit(0));
      assert.equal('Z', hash.calculateDigit(51));

      assert.equal('aaaaa', hash.numberToHash(0));
      assert.equal('aaaaz', hash.numberToHash(25));
      assert.equal('aAaaZ', hash.numberToHash(3655859));

      assert.equal(1, hash.hashToNumber('aaaab'));
      assert.equal(25, hash.hashToNumber('aaaaz'));
      assert.equal(3655859, hash.hashToNumber('aAaaZ'));

      expect(hash.calculateDigit.bind(this, 54)).to.throw('argument out of range');
      expect(hash.calculateDigit.bind(this, -1)).to.throw('argument out of range');
    });
  }
);