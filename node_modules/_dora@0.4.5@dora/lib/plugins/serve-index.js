'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  middleware: function middleware() {
    return require('koa-serve-index')(this.cwd, {
      hidden: true,
      view: 'details'
    });
  }
};
module.exports = exports['default'];