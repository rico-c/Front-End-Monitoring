'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _path = require('path');

var _fs = require('fs');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _mergeCustomConfig = require('./mergeCustomConfig');

var _mergeCustomConfig2 = _interopRequireDefault(_mergeCustomConfig);

var _getWebpackCommonConfig = require('./getWebpackCommonConfig');

var _getWebpackCommonConfig2 = _interopRequireDefault(_getWebpackCommonConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getWebpackConfig(args, cache) {
  var webpackConfig = (0, _getWebpackCommonConfig2.default)(args);

  webpackConfig.plugins = webpackConfig.plugins || [];

  // Config outputPath.
  if (args.outputPath) {
    webpackConfig.output.path = args.outputPath;
  }

  if (args.publicPath) {
    webpackConfig.output.publicPath = args.publicPath;
  }

  // Config if no --no-compress.
  if (args.compress) {
    webpackConfig.UglifyJsPluginConfig = {
      output: {
        ascii_only: true
      },
      compress: {
        warnings: false
      }
    };
    webpackConfig.plugins = [].concat(_toConsumableArray(webpackConfig.plugins), [new _webpack2.default.optimize.UglifyJsPlugin(webpackConfig.UglifyJsPluginConfig), new _webpack2.default.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })]);
  } else {
    if (process.env.NODE_ENV) {
      webpackConfig.plugins = [].concat(_toConsumableArray(webpackConfig.plugins), [new _webpack2.default.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })]);
    }
  }

  webpackConfig.plugins = [].concat(_toConsumableArray(webpackConfig.plugins), [new _webpack2.default.optimize.DedupePlugin(), new _webpack2.default.NoErrorsPlugin()]);

  // Output map.json if hash.
  if (args.hash) {
    var pkg = require((0, _path.join)(args.cwd, 'package.json'));
    webpackConfig.output.filename = webpackConfig.output.chunkFilename = '[name]-[chunkhash].js';
    webpackConfig.plugins = [].concat(_toConsumableArray(webpackConfig.plugins), [require('map-json-webpack-plugin')({
      assetsPath: pkg.name,
      cache: cache
    })]);
  }

  if (typeof args.config === 'function') {
    webpackConfig = args.config(webpackConfig) || webpackConfig;
  } else {
    webpackConfig = (0, _mergeCustomConfig2.default)(webpackConfig, (0, _path.resolve)(args.cwd, args.config || 'webpack.config.js'));
  }
  return webpackConfig;
}

function build(args, callback) {
  // Get config.
  var webpackConfig = getWebpackConfig(args, {});
  webpackConfig = Array.isArray(webpackConfig) ? webpackConfig : [webpackConfig];

  var fileOutputPath = void 0;
  webpackConfig.forEach(function (config) {
    fileOutputPath = config.output.path;
  });

  if (args.watch) {
    webpackConfig.forEach(function (config) {
      config.plugins.push(new _webpack.ProgressPlugin(function (percentage, msg) {
        var stream = process.stderr;
        if (stream.isTTY && percentage < 0.71) {
          stream.cursorTo(0);
          stream.write('\uD83D\uDCE6  ' + _chalk2.default.magenta(msg));
          stream.clearLine(1);
        } else if (percentage === 1) {
          console.log(_chalk2.default.green('\nwebpack: bundle build is now finished.'));
        }
      }));
    });
  }

  function doneHandler(err, stats) {
    if (args.json) {
      var filename = typeof args.json === 'boolean' ? 'build-bundle.json' : args.json;
      var jsonPath = (0, _path.join)(fileOutputPath, filename);
      (0, _fs.writeFileSync)(jsonPath, JSON.stringify(stats.toJson()), 'utf-8');
      console.log('Generate Json File: ' + jsonPath);
    }

    var _stats$toJson = stats.toJson(),
        errors = _stats$toJson.errors;

    if (errors && errors.length) {
      process.on('exit', function () {
        process.exit(1);
      });
    }
    // if watch enabled only stats.hasErrors would log info
    // otherwise  would always log info
    if (!args.watch || stats.hasErrors()) {
      var buildInfo = stats.toString({
        colors: true,
        children: true,
        chunks: !!args.verbose,
        modules: !!args.verbose,
        chunkModules: !!args.verbose,
        hash: !!args.verbose,
        version: !!args.verbose
      });
      if (stats.hasErrors()) {
        console.error(buildInfo);
      } else {
        console.log(buildInfo);
      }
    }

    if (err) {
      process.on('exit', function () {
        process.exit(1);
      });
      console.error(err);
    }

    if (callback) {
      callback(err);
    }
  }

  // Run compiler.
  var compiler = (0, _webpack2.default)(webpackConfig);

  // Hack: remove extract-text-webpack-plugin log
  if (!args.verbose) {
    compiler.plugin('done', function (stats) {
      stats.stats.forEach(function (stat) {
        stat.compilation.children = stat.compilation.children.filter(function (child) {
          // eslint-disable-line
          return child.name !== 'extract-text-webpack-plugin';
        });
      });
    });
  }

  if (args.watch) {
    compiler.watch(args.watch || 200, doneHandler);
  } else {
    compiler.run(doneHandler);
  }
}
module.exports = exports['default'];