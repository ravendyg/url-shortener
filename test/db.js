/* global before, describe, it */
'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

const configApi = require('../config');
let config;
const hash = require('../services/hash');
let linkRepo;

before(
  function before(done) {
    config = configApi.init({
      TABLE_NAME: 'links_test',
      PORT: 3036
    }, 'test');
    let {connectToDb, resetTable} = require('../db');
    connectToDb(function setupDb() {
      linkRepo = require('../repository/link');
      resetTable()
      .then(function () {
        require('../services/server').start()
        .then(done)
      })
    });
  }
);

describe('hash conversion',
  function hashConversion() {
    it('calculate hash from number', function calculateHash() {
      assert.equal('a', hash.calculateDigit(0));
      assert.equal('Z', hash.calculateDigit(51));

      assert.equal('aaaaa', hash.numberToHash(0));
      assert.equal('aaaab', hash.numberToHash(1));
      assert.equal('aaaaz', hash.numberToHash(25));
      assert.equal('aAaaZ', hash.numberToHash(3655859));
    });

    it('calculate number from hash', function calculateHash() {
      assert.equal(0, hash.digitToDecimal('a'));
      assert.equal(51, hash.digitToDecimal('Z'));

      assert.equal(1, hash.hashToNumber('aaaab'));
      assert.equal(25, hash.hashToNumber('aaaaz'));
      assert.equal(3655859, hash.hashToNumber('aAaaZ'));
    });

    it('throw error with bad args', function calculateHash() {
      expect(hash.calculateDigit.bind(this, 54)).to.throw('argument out of range');
      expect(hash.calculateDigit.bind(this, -1)).to.throw('argument out of range');
    });
  }
);


describe('repository',
  function repositoryOperations() {
    it('create record and return hash', function createRecord(done) {
      linkRepo.createRecord('https://maps.nskgortrans.info')
      .then(function (_hash) {
        assert.equal(_hash, 'aaaab');
        done();
      });
    });

    it('create record with the same url and return another hash',
      function createRecord(done) {
        linkRepo.createRecord('https://maps.nskgortrans.info')
        .then(function (_hash) {
          assert.equal(_hash, 'aaaac');
          done();
        });
      }
    );

    it('return not found when given wrong hash', function getWrongRecord(done) {
      linkRepo.getRecord('aaaaD')
      .catch(function (reason) {
        assert.equal(reason, 'not found');
        done();
      });
    });

    it('return url when given correct hash', function getRecord(done) {
      linkRepo.getRecord('aaaab')
      .then(function (url) {
        assert.equal(url, 'https://maps.nskgortrans.info');
        done();
      });
    });

    it('reject an url with some xss', function rejectBadUrl(done) {
      linkRepo.createRecord('www.dsfsdf.com<script%20type="text/javascript">alert("xss");</script>')
      .catch(function (err) {
        assert.equal(err, 'bad url')
        done();
      });
    });
  }
);

describe('http endpoints',
  function repositoryOperations() {
    it('create record and return an url with a hash', function createRecord(done) {
      this.timeout(5000);
      chai.request(config.HOST)
      .post('/api')
      .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36')
      .set('content-type', 'application/json; charset=utf-8')
      .send({url: 'https://maps.nskgortrans.info'})
      .end(function responseHandler(err, res) {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.url, config.HOST + '/aaaad');
        done();
      });
    });

    it('redirect given valid hash', function createRecord(done) {
      this.timeout(5000);
      chai.request(config.HOST)
      .get('/aaaac')
      .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36')
      .end(function responseHandler(err, res) {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.isTrue(/maps\.nskgortrans\.info/.test(res.text));
        done();
      });
    });

    it('return 404 given wrong hash', function getWrongRecord(done) {
      this.timeout(5000);
      chai.request(config.HOST)
      .get('/aaaaZ')
      .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36')
      .end(function responseHandler(err, res) {
        assert.isNotNull(err);
        assert.equal(res.status, 404);
        done();
      });
    });

    it('return 400 given no url', function createRecord(done) {
      this.timeout(5000);
      chai.request(config.HOST)
      .post('/api')
      .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36')
      .set('content-type', 'application/json; charset=utf-8')
      .send({})
      .end(function responseHandler(err, res) {
        assert.isNotNull(err);
        assert.equal(res.status, 400);
        assert.equal(res.text, 'bad url');
        done();
      });
    });

    it('return 400 given some xss in the url', function createRecord(done) {
      this.timeout(5000);
      chai.request(config.HOST)
      .post('/api')
      .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36')
      .set('content-type', 'application/json; charset=utf-8')
      .send({url: 'https://maps.nskgortrans.info<script>alert("hello")</scipt>'})
      .end(function responseHandler(err, res) {
        assert.isNotNull(err);
        assert.equal(res.status, 400);
        assert.equal(res.text, 'bad url');
        done();
      });
    });

    it('create record and return an url with a hash given russian website url', function createRecord(done) {
      this.timeout(5000);
      chai.request(config.HOST)
      .post('/api')
      .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36')
      .set('content-type', 'application/json; charset=utf-8')
      .send({url: 'http://президент.рф'})
      .end(function responseHandler(err, res) {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.url, config.HOST + '/aaaae');
        done();
      });
    });

    it('redirect to a website with a russian url given valid hash', function createRecord(done) {
      this.timeout(5000);
      chai.request(config.HOST)
      .get('/aaaae')
      .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36')
      .end(function responseHandler(err, res) {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.isTrue(/Президент\sРоссии/.test(res.text));
        done();
      });
    });
  }
);