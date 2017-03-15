'use strict';

module.exports = {
  createHandler(methodHandlers) {
    return function handle(req, res, config) {
      let handler = methodHandlers[req.method];
      if (handler) {
        handler(req, res, config);
      } else {
        res._endHandler.resolve(405);
      }
    }
  }
};