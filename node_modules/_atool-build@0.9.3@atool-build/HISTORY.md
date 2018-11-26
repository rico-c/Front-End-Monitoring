# History

---

## 0.9.0

- upgrade typescript to 2. Ref. #221

## 0.8.1

- fix: css minimize bug with postcss plugin autoprefix and postcss-loader not found. Ref. #212

## 0.8.0

- enhance autoprefix for mobile. Ref. #190

## 0.7.17

- support import less by transformLess, Ref. [pr](https://github.com/ant-tool/atool-build/pull/188)

## 0.7.16

- adding ".json" to the extensions under resolve
- fix cwd
- upgrade babel-* version

## 0.7.15

- enhancement theme

## 0.7.14

- add cacheDirectory, Close https://github.com/ant-design/antd-init/issues/78
- support theme config, Close #176

## 0.7.13

- fix: args.config is absolute path
- fix: test error

## 0.7.6

- compatibility: 0.7.4 before about babelQuery

## 0.7.5

- support: typescript
- fix: process exit when watch

## 0.7.4

- fix: when build is done but process does not exit, Close #165

## 0.7.3

- support: .web.js

## 0.7.2

- fix: should check package.json before require it

## 0.7.1

- fix class inherit problem in IE9 and IE10, #126, #148
- remove typecheck plugin, #149

## 0.7.0

- add lib/transformLess

## 0.6.0

- 构建日志不输出 uglifyjs 的 warning 信息，#50
- 修改 babel 和 UglifyJsPluginConfig 配置更简单，直接通过 `webpackConfig.babel` 调用，#58
- js 里 require 的 html 文件会被复制到输出目录，#53
- 通过匹配 `*.module.css` 支持 `css-modules`，一种更好的 css 组织方式
- 添加 NoErrorsPlugin 插件，构建出错时不生成文件
- 支持 rucksack，详见 http://simplaio.github.io/rucksack/
- 支持 webpackConfig 处理了 i18n 后是数组的场景，#98
- watch 模式下精简日志信息，#86
- 支持 decorator，#65

## 0.5.0

采用 postcss-loader

解决 map.json bug

## 0.4.3

jsx 全部转换

## 0.4.0

更新 webpack 相关依赖

## 0.3.0

支持 less 变量

## 0.2.0

react 不 external 了

## 0.1.0

初始版本

