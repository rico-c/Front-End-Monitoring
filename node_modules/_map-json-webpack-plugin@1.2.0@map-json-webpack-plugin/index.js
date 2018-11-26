var path = require('path');
var cwd = process.cwd();
var fs = require('fs-extra');

module.exports = function (config) {
  config = config || {};
  var appName = config.appName || '';
  var assetsPath = config.assetsPath || '';
  var output = config.output;
  return function () {
    this.plugin('done', function (stats) {
      var json = stats.toJson();
      var assets = json.assets;
      var cache = config.cache || {};
      var map = {};

      function processFile(a) {
        var name = a.name;
        var finalHashName = name;
        var extname = path.extname(name);
        if (extname !== '.js' && extname !== '.css') {
          return;
        }
        var dirname = path.dirname(name);
        var basename = path.basename(name, extname);
        var basenames = basename.split(/-/);
        if (basenames.length > 1) {
          basenames.pop();
        }
        var nameWithoutHash = basenames.join('-') + extname;
        map[path.join(assetsPath, dirname, nameWithoutHash)] = path.join(appName, assetsPath, finalHashName);
      }

      assets.forEach(processFile);

      var webpackOutputFile = path.join(this.outputPath, 'map.json');
      var outputFile = output ? path.resolve(cwd, output) : webpackOutputFile;
      var outputDir = path.dirname(outputFile);
      fs.mkdirsSync(outputDir);
      Object.assign(cache, map);
      fs.writeFileSync(outputFile, JSON.stringify(cache, null, 2));
    });
  }
};
