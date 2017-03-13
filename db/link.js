'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Link =
  mongoose.model(
    'Link',
    new Schema({
      url: String
    })
  );

function createLink(url) {
  let linkItem = new Link({url});
  Link.findOne({url}, )
  return linkItem.save(saveHandler);
}

function saveHandler(err, product, numAffected) {

}

function findLink()

