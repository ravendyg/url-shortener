'use strict';

import * as request from 'superagent';

var urlSubscribers = [];

export function subscribeToUrl(cb) {
  urlSubscribers.push(cb);
  return () => {
    urlSubscribers.filter(e => e !== cb);
  };
}

export function sendUrl(url) {
  request
  .post('/api/')
  .set('content-type', 'application/json; charset=utf-8;')
  .send(JSON.stringify({url}))
  .end((err, res) => {
    var hashUrl = res && res.body ? res.body.url : null;
    for (var cb of urlSubscribers) {
      cb(err ? err.message || 'Server error' : null, hashUrl);
    }
  });
}

export function copyToClipboard(value) {
  var oText = document.createElement('textarea');
    oText.style.position = 'absolute';
    oText.style.right = '-10000px';
    oText.value = value;
    document.body.parentElement.insertBefore(oText, document.body);
    oText.focus();
    oText.select();
    document.execCommand('Copy');
    oText.remove();
}