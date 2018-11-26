'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (id, _resolveDir) {
  var resolveDir = _resolveDir;
  if (!Array.isArray(resolveDir)) {
    resolveDir = [resolveDir];
  }

  var result = void 0;
  resolveDir.some(function (dirname) {
    result = tryResolve('dora-plugin-' + id, dirname) || tryResolve(id, dirname);
    return result;
  });
  return result;
};

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tryResolve(id, dirname) {
  var result = void 0;
  try {
    result = _resolve2.default.sync(id, {
      basedir: dirname
    });
  } catch (e) {} // eslint-disable-line no-empty
  return result;
}

module.exports = exports['default'];