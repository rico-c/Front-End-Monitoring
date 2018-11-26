<h1 align="center">bad.js源码解析</h1> 

> bad.js是国内优秀的前端监控开源方案，由于公司业务需要近期一直在研究前端监控方案，在查阅bad.js源码的同时，顺便将源码的解析记录在这里，希望能给大家更多的帮助，如果有解释错误的地方请在issue提出。

> 查看添加了完整注释的bad.js源代点击[这里](https://github.com/RicardoCao-Biker/Front-End-Monitoring/blob/master/badjs-sourcecode-explain.js)

> 了解更多关于bad.js可以点击[bad.js-Github主页](https://github.com/BetterJS)。

> 想了解笔者整理的[前端监控基础知识](https://github.com/RicardoCao-Biker/Front-End-Monitoring/blob/master/BasicKnowledge.md)可以点击查阅。

### 整体工作流程
![](https://ricardocao-biker.github.io/IMGS/badjs1.jpg)

### 1. 初始化配置

官方文档中有注明

> badjs-report 必须在所有类库之前加载并初始化

这里执行下述代码进行初始化

```
BJ_REPORT.init({
  id: 1,                                // 上报 id, 不指定 id 将不上报
  uin: 123,                             // 指定用户 id, (默认已经读取 qq uin)
  delay: 1000,                          // 当 combo 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
  url: "//badjs2.qq.com/badjs",         // 指定上报地址
  ignore: [/Script error/i],            // 忽略某个错误
  random: 1,                            // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
  repeat: 5,                            // 重复上报次数(对于同一个错误超过多少次不上报)
                                        // 避免出现单个用户同一错误上报过多的情况
  onReport: function(id, errObj){},     // 当上报的时候回调。 id: 上报的 id, errObj: 错误的对象
  submit: null,                         // 覆盖原来的上报方式，可以自行修改为 post 上报等
  ext: {},                              // 扩展属性，后端做扩展处理属性。例如：存在 msid 就会分发到 monitor,
});
```

init方法执行了一下几件事：

1. 判断关键参数是否设置
2. 拼接上报url
3. 处理还没有上报的缓存的上报队列

### 2. window.onerror监听全局异常

bad.js重写window.onerror如下：

```javascript
	global.onerror = function (msg, url, line, col, error) {
        var newMsg = msg;
        if (error && error.stack) {
            newMsg = T.processStackMsg(error);
        }

        if (T.isOBJByType(newMsg, "Event")) {
            newMsg += newMsg.type ?
                ("--" + newMsg.type + "--" + (newMsg.target ?
                    (newMsg.target.tagName + "::" + newMsg.target.src) : "")) : "";
        }
   
        report.push({
            msg: newMsg,
            target: url,
            rowNum: line,
            colNum: col,
            _orgMsg: msg
        });

        _process_log();
        orgError && orgError.apply(global, arguments);
    };
```

从onerror异常处理函数有5个参数，分别是：

- `message`：错误信息（字符串）。可用于HTML `onerror=""`处理程序中的`event`。
- `source`：发生错误的脚本URL（字符串）
- `lineno`：发生错误的行号（数字）
- `colno`：发生错误的列号（数字）
- `error`：[Error对象](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)（对象）

其中，error对象可以通过stack原型读取相应的异常堆栈信息，也就是我们在控制台看到的堆栈信息，详细资料可以查看MDN文档[`Error.prototype.stack`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack) 。

首先，我们需要搞清楚error和error.stack所表现的东西有什么不同，这里一张对比图：



这里，我们需要对error.stack进行字符串格式化处理，因为error.stack初始状态下是一个包换回车的字符串，便于服务器更好的读取错误信息。

```javascript
processStackMsg: function (error) {
    
    console.log('处理前')
    console.log(error);
    
    var stack = error.stack
        .replace(/\n/gi, "")
        .split(/\bat\b/)
        .slice(0, 9)
        .join("@")
        .replace(/\?[^:]+/gi, "");
    var msg = error.toString();
    if (stack.indexOf(msg) < 0) {
        stack = msg + "@" + stack;
    }
    
    console.log('处理后')
    console.log(stack);
    
    return stack;
}
```

这里直接上一张对比图：

![](https://github.com/RicardoCao-Biker/IMGS/blob/master/err6.jpg)

可以看到，这时我们就拿到了可以定位到错误来源的格式化的堆栈信息。



接下来执行将格式化后的异常信息推入异常队列

```javascript
report.push({
    msg: newMsg,
    target: url,
    rowNum: line,
    colNum: col,
    _orgMsg: msg
});
```



### 3. 上报队列处理

推入异常队列后执行`_process_log`处理队列

```javascript
var _process_log = function (isReportNow) {
        // 是否设置了异常上班接口并完成初始化
        if (!_config._reportUrl) return;
        // 根据设置的采样值随机生成是否忽略本次异常
        var randomIgnore = Math.random() >= _config.random;

        while (_log_list.length) {
            var isIgnore = false;
            // 读取上报队列首位
            var report_log = _log_list.shift();
            //有效保证字符不要过长
            report_log.msg = (report_log.msg + "" || "").substr(0, 500);
            // 重复上报
            if (T.isRepeat(report_log)) continue;
            var log_str = _report_log_tostring(report_log, submit_log_list.length);
            if (T.isOBJByType(_config.ignore, "Array")) {
                for (var i = 0, l = _config.ignore.length; i < l; i++) {
                    var rule = _config.ignore[i];
                    if ((T.isOBJByType(rule, "RegExp") && rule.test(log_str[1])) ||
                        (T.isOBJByType(rule, "Function") && rule(report_log, log_str[1]))) {
                        isIgnore = true;
                        break;
                    }
                }
            }
            if (!isIgnore) {
                _config.offlineLog && _save2Offline("badjs_" + _config.id + _config.uin, report_log);
                if (!randomIgnore && report_log.level != 20) {
                    submit_log_list.push(log_str[0]);
                    _config.onReport && (_config.onReport(_config.id, report_log));
                }

            }
        }
        // 立即上报
        if (isReportNow) {
            _submit_log();
        } else if (!comboTimeout) {
            // 延迟配置中设置的时延后上报
            comboTimeout = setTimeout(_submit_log, _config.delay);
        }
    };
```

这里主要做了一下几件事

1. 首先根据`_config`设置的采样率根据随机值判断是否忽略，随后裁掉过长的字符串。

2. 根据在`_config`中配置的忽略的错误类型，使用正则匹配是否将该异常忽略。

3. 将队列中的错误信息字符串进行URI编码。

4. 根据`_config`中配置的是否立即上报处理上报逻辑。


当进入上报方法`_submit_log`后:

```javascript
var _submit_log = function () {
        clearTimeout(comboTimeout);

        comboTimeout = 0;
        // 没有上报队列则退出函数
        if (!submit_log_list.length) {
            return;
        }
        // 拼接上报信息参数
        var url = _config._reportUrl + submit_log_list.join("&") + "&count=" + submit_log_list.length + "&_t=" + (+new Date);
        // 如果没有设置自定义上报方式，默认使用new Image方式上报
        if (_config.submit) {
            _config.submit(url, submit_log_list);
        } else {
            var _img = new Image();
            _img.src = url;
        }
        // 清空上报队列
        submit_log_list = [];
    };
```

将队列中的异常信息一次拼接在上报接口url中并默认通过new Image()后的参数进行上报。



如果需要手动上报，则直接调用:`BJ_REPORT.report`

```javascript
report: function (msg, isReportNow) {
    msg && report.push(msg);

    isReportNow && _process_log(true);
    return report;
}
```

手动将信息推入上报队列，并完成上报。


### 总结
bad.js除此之外还有离线上报功能，使用indexDB存储异常信息，这里不再分析，感兴趣的同学可以前往源码查阅[点这里看完整带注释的源码](https://github.com/RicardoCao-Biker/Front-End-Monitoring/blob/master/badjs-sourcecode-explain.js)

bad.js已经几乎实现了onerror监控的全部功能，除此之外，针对VUE和React等MVVM框架我们可以使用框架提供的错误处理钩子函数，类如VUE的配置Vue.config.errorHandler，

另外针对AJAX异常可以考虑重写XMLHttpRequest对象。

针对静态资源的异常，可以使用
```
window.addEventListener('error', (error) => {
  console.log(error);
}, true)
```
在实际的异常捕获场景中，可能还需要根据情况配置延时上报、限制重复上报的情况，否则大量的无用的异常上报不仅增加对用户流量和服务器的压力，同时也增加了我们分析问题的精力。
