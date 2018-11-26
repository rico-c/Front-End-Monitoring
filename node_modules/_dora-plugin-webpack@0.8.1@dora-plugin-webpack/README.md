# dora-plugin-webpack


dora plugin for webpack.


[![NPM version](https://img.shields.io/npm/v/dora-plugin-webpack.svg?style=flat)](https://npmjs.org/package/dora-plugin-webpack)
[![Build Status](https://img.shields.io/travis/dora-js/dora-plugin-webpack.svg?style=flat)](https://travis-ci.org/dora-js/dora-plugin-webpack)
[![Coverage Status](https://img.shields.io/coveralls/dora-js/dora-plugin-webpack.svg?style=flat)](https://coveralls.io/r/dora-js/dora-plugin-webpack)
[![NPM downloads](http://img.shields.io/npm/dm/dora-plugin-webpack.svg?style=flat)](https://npmjs.org/package/dora-plugin-webpack)


----

## Usage

```bash
$ dora --plugins webpack
```

with options:

```bash
$ dora --plugins webpack?publicPath=/${npm_pkg_name}&verbose
```

with options in Object:

```bash
$ dora --plugins webpack?{"watchOptions":{"poll":true}}
```

### Options

- `cwd` -- default from dora
- `publicPath` -- default '/', http://webpack.github.io/docs/configuration.html#output-publicpath
- `config` -- default 'webpack.config.js'
- `verbose` -- more logs
- `disableNpmInstall` -- disable NpmInstallPlugin
- `physcisFileSystem` -- write output files to disk 

And other webpack options, like `watchOptions`, `headers`, `stats`, ...


## Plugins

- `atool-build.updateWebpackConfig` -- update webpack config for development

