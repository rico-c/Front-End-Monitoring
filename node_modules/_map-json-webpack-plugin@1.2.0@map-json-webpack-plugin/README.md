# map-json-webpack-plugin
---

webpack plugin to generate map.json

[![NPM version][npm-image]][npm-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/map-json-webpack-plugin.svg?style=flat-square
[npm-url]: http://npmjs.org/package/map-json-webpack-plugin
[travis-image]: https://img.shields.io/travis/yiminghe/map-json-webpack-plugin.svg?style=flat-square
[travis-url]: https://travis-ci.org/yiminghe/map-json-webpack-plugin
[coveralls-image]: https://img.shields.io/coveralls/yiminghe/map-json-webpack-plugin.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yiminghe/map-json-webpack-plugin?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/yiminghe/map-json-webpack-plugin.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/yiminghe/map-json-webpack-plugin
[node-image]: https://img.shields.io/badge/node.js-%3E=_4.0.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/map-json-webpack-plugin.svg?style=flat-square
[download-url]: https://npmjs.org/package/map-json-webpack-plugin

## examples

```js
plugins: [
  ...,
  require('map-json-webpack-plugin')({
    // output file path, relative to process.cwd()
    output: 'dist/map.json'
  })
]
```

## history

### 1.2.0

- https://github.com/yiminghe/map-json-webpack-plugin/pull/2. support cache, across multiple build

### 1.1.0

- https://github.com/yiminghe/map-json-webpack-plugin/pull/1. Default `output` using webpack `output.path`

