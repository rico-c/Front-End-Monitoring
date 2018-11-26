'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  middleware: function middleware() {
    return require('koa-static')(this.cwd);
  }
};
module.exports = exports['default'];