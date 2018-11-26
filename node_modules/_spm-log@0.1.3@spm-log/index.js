'use strict';

var util = require('util');
var color = require('colorful');

var log = module.exports = {};

var levels = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

log.quiet = false;
log.width = 15;

var SPM_LOG = process.env.SPM_LOG;
if (SPM_LOG && levels[SPM_LOG.toLowerCase()]) {
  log.level = SPM_LOG.toLowerCase();
} else {
  log.level = 'info';
}

log.log = function(level, msg) {
  if (levels[level] >= levels[log.level] && log.quiet === false) {
    if (console[level]) {
      console[level](msg);
    } else {
      console.log(msg);
    }
  }
};

log.debug = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('debug', getMsg(category, msg, color.blue));
};

log.info = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('info', getMsg(category, msg, color.cyan));
};

log.warn = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('warn', getMsg(category, msg, color.yellow));
};

log.error = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  args = args.map(function(arg) {
    if (arg.message) {
      return arg.message;
    } else if (arg.code) {
      return arg.code;
    } else {
      return arg;
    }
  });
  var msg = util.format.apply(this, args);

  log.log('error', getMsg(category, msg, color.red));
};

log.config = function(options) {
  if (options.verbose) {
    log.level = 'debug';
  }
  if (options.quiet) {
    log.level = 'warn';
  }
  if (options.color === false) {
    require('colorful').disabled = true;
    require('colorful').isatty = false;
  }
  if (options.color === true) {
    require('colorful').disabled = false;
    require('colorful').isatty = true;
  }
};


function getMsg(category, msg, fn) {
  var len = Math.max(0, log.width - category.length);
  var pad = new Array(len + 1).join(' ');
  msg = msg.replace(process.cwd(), '$CWD');
  msg = msg.replace(process.env.HOME, '~');
  if (~msg.indexOf('\x1b[')) {
    msg = pad + fn(category) + ': ' + msg;
  } else {
    msg = pad + fn(category) + ': ' + msg;
  }
  return msg;
}
