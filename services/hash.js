'use strict';

const config = require('../config');

module.exports = {
  numberToHash, hashToNumber,
  calculateDigit, digitToDecimal
};

/**
 * use letters a-zA-Z
 * @param id: number - table id
 * @return hash: string
 */
function numberToHash(id) {
  let counter = 0;
  let temp = id;
  let out = '';
  while (id / Math.pow(config.BASE, counter) >= 1) {
    temp = Math.floor(temp / config.BASE) * config.BASE;
    counter++;
  }
  counter--;
  temp = id;
  while (counter >= 0) {
    let exp = Math.pow(config.BASE, counter)
    out += calculateDigit(Math.floor(temp / exp));
    temp = temp - Math.floor(temp / exp) * exp;
    counter--;
  }
  while (out.length < config.HASH_LENGTH) {
    out = 'a' + out;
  }
  return out;
}

/**
 * @param hash: string
 * @return id: number
 */
function hashToNumber(hash) {
  let digits = hash.split('').reverse();
  let out = 0;
  for (let i = 0; i < digits.length; i++) {
    out += digitToDecimal(digits[i]) * Math.pow(config.BASE, i);
  }
  return out;
}

/**
 * @param num: number
 * @return digit: string
 */
function calculateDigit(num) {
  if (num >= 0 && num < 26) {  // a-z
    return String.fromCharCode(num + 97);
  } else if (num >= 26 && num < config.BASE) { // A-Z
    return String.fromCharCode(num + 65 - 26);
  } else {
    throw new Error('argument out of range');
  }
}

/**
 * @param digit: string
 * @return num: number
 */
function digitToDecimal(digit) {
  let code = digit.charCodeAt(0);
  if (code >= 97 && code <= 122) {
    return code - 97;
  } else if (code >= 65 && code <= 90) {
    return code - 65 + 26;
  } else {
    throw new Error('argument out of range');
  }
}