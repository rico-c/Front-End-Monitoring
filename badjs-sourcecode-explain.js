var BJ_REPORT = (function (global) {
    if (global.BJ_REPORT) return global.BJ_REPORT;

    var _log_list = [];
    var _log_map = {};
    var _config = {
        id: 0, // 上报 id
        uin: 0, // user id
        url: "", // 上报 接口
        ext: null, // 扩展参数 用于自定义上报
        level: 4, // 错误级别 1-debug 2-info 4-error
        ignore: [], // 忽略某个错误, 支持 Regexp 和 Function
        random: 1, // 抽样 (0-1] 1-全量
        delay: 1000, // 延迟上报 combo 为 true 时有效
        submit: null, // 自定义上报方式
        repeat: 5, // 重复上报次数(对于同一个错误超过多少次不上报),
    };

    var T = {
        // 判断数据类型
        isOBJByType: function (o, type) {
            return Object.prototype.toString.call(o) === "[object " + (type || "Object") + "]";
        },
        // 数据类型为对象
        isOBJ: function (obj) {
            var type = typeof obj;
            return type === "object" && !!obj;
        },
        // 判断空对象
        isEmpty: function (obj) {
            if (obj === null) return true;
            if (T.isOBJByType(obj, "Number")) {
                return false;
            }
            return !obj;
        },
        // 复制对象
        extend: function (src, source) {
            for (var key in source) {
                src[key] = source[key];
            }
            return src;
        },

        /** 
         * 整理error对象，如果没问题直接走return errObj通过
        */
        processError: function (errObj) {
            try {
                if (errObj.stack) {
                    var url = errObj.stack.match("https?://[^\n]+");
                    url = url ? url[0] : "";
                    var rowCols = url.match(":(\\d+):(\\d+)");
                    if (!rowCols) {
                        rowCols = [0, 0, 0];
                    }

                    var stack = T.processStackMsg(errObj);
                    return {
                        msg: stack,
                        rowNum: rowCols[1],
                        colNum: rowCols[2],
                        target: url.replace(rowCols[0], ""),
                        _orgMsg: errObj.toString()
                    };
                } else {
                    //ie 独有 error 对象信息，try-catch 捕获到错误信息传过来，造成没有msg
                    if (errObj.name && errObj.message && errObj.description) {
                        return {
                            msg: JSON.stringify(errObj)
                        };
                    }
                    return errObj;
                }
            } catch (err) {
                return errObj;
            }
        },

        /** 
         * onerror中的msg参数只有简单的错误信息描述，类似：'Uncaught Error: 抛出click错误'
         * error参数为包含堆栈信息的对象，需要使用该方法将error对象的堆栈转为字符串输出
        */
        processStackMsg: function (error) {
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
            return stack;
        },
        // 是否超过配置的最多重复上报次数
        isRepeat: function (error) {
            if (!T.isOBJ(error)) return true;
            var msg = error.msg;
            var times = _log_map[msg] = (parseInt(_log_map[msg], 10) || 0) + 1;
            return times > _config.repeat;
        }
    };

    // 保存原有全局onerror方法
    var orgError = global.onerror;
    // 使用window.onerror全局监听error
    global.onerror = function (msg, url, line, col, error) {
        var newMsg = msg;
        // 使用 T.processStackMsg将error的堆栈信息转为字符串并缓存到newMsg
        if (error && error.stack) {
            newMsg = T.processStackMsg(error);
        }

        if (T.isOBJByType(newMsg, "Event")) {
            newMsg += newMsg.type ?
                ("--" + newMsg.type + "--" + (newMsg.target ?
                    (newMsg.target.tagName + "::" + newMsg.target.src) : "")) : "";
        }
        // 将错误推到缓存池
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
    // 将错误对象生成字符串，返回将三种不同格式的转译字符串的接口的数组
    var _report_log_tostring = function (error, index) {
        var param = [];
        var params = [];
        var stringify = [];
        if (T.isOBJ(error)) {
            error.level = error.level || _config.level;
            for (var key in error) {
                var value = error[key];
                if (!T.isEmpty(value)) {
                    if (T.isOBJ(value)) {
                        try {
                            value = JSON.stringify(value);
                        } catch (err) {
                            value = "[BJ_REPORT detect value stringify error] " + err.toString();
                        }
                    }
                    stringify.push(key + ":" + value);
                    param.push(key + "=" + encodeURIComponent(value));
                    params.push(key + "[" + index + "]=" + encodeURIComponent(value));
                }
            }
        }
        return [params.join("&"), stringify.join(","), param.join("&")];
    };

    var submit_log_list = [];
    var comboTimeout = 0;

    /** 
     * 上报异常队列
    */
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

    /** 
     * 将_log_list中的错误对象队列依次字符串化
     * 并调用_submit_log方法拼接url提交错误给服务器
    */
    var _process_log = function (isReportNow) {
        // 是否设置了异常上班接口并完成初始化
        if (!_config._reportUrl) return;
        // 根据设置的采样值随机生成是否忽略本次异常
        var randomIgnore = Math.random() >= _config.random;

        while (_log_list.length) {
            var isIgnore = false;
            // 取出上报队列首位
            var report_log = _log_list.shift();
            // 保证msg错误信息字符不要过长
            report_log.msg = (report_log.msg + "" || "").substr(0, 500);
            // 重复上报
            if (T.isRepeat(report_log)) continue;
            // 将被取出的首位错误对象转为字符串
            var log_str = _report_log_tostring(report_log, submit_log_list.length);
            // 处理配置中已设置忽略的错误类型
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
                    // 在submit_log_list队列中推入URI编码后的字符串处理后的错误对象，准备作为url参数提交给服务器
                    submit_log_list.push(log_str[0]);
                    _config.onReport && (_config.onReport(_config.id, report_log));
                }

            }
        }
        // 立即上报，本套代码中只有在主动手动上报时可以设置立即上报参数，否则默认延迟上报
        if (isReportNow) {
            _submit_log();
        } else if (!comboTimeout) {
            // 延迟配置中设置的时延后上报
            comboTimeout = setTimeout(_submit_log, _config.delay);
        }
    };

    var report = global.BJ_REPORT = {
        /** 
         * 将错误推到_log_list缓存池
        */
        push: function (msg) {
            // onerror自动捕获时，进入processError，补齐error对象基本信息
            // 手动主动上报异常时，将手动输入的异常信息的字符串包裹至对象中形成data
            var data = T.isOBJ(msg) ? T.processError(msg) : {
                msg: msg
            };

            // ext 有默认值, 且上报不包含 ext, 使用默认 ext
            if (_config.ext && !data.ext) {
                data.ext = _config.ext;
            }
            // 在错误发生时获取页面链接
            if (!data.from) {
                data.from = location.href;
            }
            /**
             * 将Uncaught错误信息和处理过的错误信息同时推入_log_list，
             * 准备进入_process_log方法进行字符串化并拼接发送
             */
            if (data._orgMsg) {
                var _orgMsg = data._orgMsg;
                delete data._orgMsg;
                data.level = 2;
                var newData = T.extend({}, data);
                newData.level = 4;
                newData.msg = _orgMsg;
                _log_list.push(data);
                _log_list.push(newData);
            } else {
                _log_list.push(data);
            }

            _process_log();
            return report;
        },
        /** 
         * 手动主动上报错误
        */
        report: function (msg, isReportNow) {
            msg && report.push(msg);

            isReportNow && _process_log(true);
            return report;
        },
        /** 
         * info上报，用于记录操作日志
        */
        info: function (msg) { // info report
            if (!msg) {
                return report;
            }
            if (T.isOBJ(msg)) {
                msg.level = 2;
            } else {
                msg = {
                    msg: msg,
                    level: 2
                };
            }
            report.push(msg);
            return report;
        },

        /**
         * 可以结合实时上报，跟踪问题; 不存入存储
        */
        debug: function (msg) { // debug report
            if (!msg) {
                return report;
            }
            if (T.isOBJ(msg)) {
                msg.level = 1;
            } else {
                msg = {
                    msg: msg,
                    level: 1
                };
            }
            report.push(msg);
            return report;
        },

        /**
         * 初始化
        */
        init: function (config) {
            if (T.isOBJ(config)) {
                for (var key in config) {
                    _config[key] = config[key];
                }
            }
            // 没有设置id将不上报
            var id = parseInt(_config.id, 10);
            if (id) {
                // set default report url and uin
                if (/qq\.com$/gi.test(location.hostname)) {
                    if (!_config.url) {
                        _config.url = "//badjs2.qq.com/badjs";
                    }

                    if (!_config.uin) {
                        _config.uin = parseInt((document.cookie.match(/\buin=\D+(\d+)/) || [])[1], 10);
                    }
                }
                // 设置异常上报的接口地址
                _config._reportUrl = (_config.url || "/badjs") +
                    "?id=" + id +
                    "&uin=" + _config.uin +
                    // "&from=" + encodeURIComponent(location.href) +
                    "&";
            }

            // if had error in cache , report now
            // 初始化时如果队列中有异常立即上报
            if (_log_list.length) {
                _process_log();
            }

            return report;
        },
        __onerror__: global.onerror
    };

    typeof console !== "undefined" && console.error && setTimeout(function () {
        var err = ((location.hash || "").match(/([#&])BJ_ERROR=([^&$]+)/) || [])[2];
        err && console.error("BJ_ERROR", decodeURIComponent(err).replace(/(:\d+:\d+)\s*/g, "$1\n"));
    }, 0);

    return report;

}(window));

if (typeof module !== "undefined") {
    module.exports = BJ_REPORT;
}
