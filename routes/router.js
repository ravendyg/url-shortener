'use strict';

module.exports = {
  createHandler(methodHandlers) {
    return function handle(req, res) {
      let handler = methodHandlers[req.method];
      if (handler) {
        handler(req, res);
      } else {
        res._endHandler.resolve(405);
      }
    }
  }
};