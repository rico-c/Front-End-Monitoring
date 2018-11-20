<h1>前端监控知识点</h1>

### 我们的目标是什么？
将用户在使用网页服务时产生的影响用户体验的异常通过网络请求传回服务器，并进行可视化的展现，整个过程要求我们回传的错误信息包含错误类型、调用堆栈等错误信息以便开发人员定位错误。

### 需上报的错误类型有几种？
1. 静态资源加载失败
2. AJAX请求失败
3. JavaScript异常
    - 运行时报错
      - 同步错误
      - 异步错误
    - 语法错误
4. promise异常

### 捕获错误有几种方式？
这里我总结了几种，分别是：

- onerror全局监听
- addEventListener全局监听
- try...catch主动捕获
- promise...catch主动捕获
- 重写`XMLHttpRequest`对象方法
- MVVM框架例如VUE和React中的官方错误处理方法

下面分别介绍：

#### try catch

使用方法大家应该都知道，使用try...catch可以主动的处理异常，养成在关键操作处写try…catch的习惯可以非常好的帮助后续判断线上遇到的各种异常。

这里需要指出try catch需要注意的几点：

1. try-catch 只能捕获到同步的运行时错误，其他类型无法捕获

   **解决方案：** onerror都可以捕获到运行时的同步/异步错误

#### onerror
>当JavaScript运行时错误（包括语法错误）发生时，window会触发一个ErrorEvent接口的error事件，并执行window.onerror()。

window.error可以用于全局捕获JavaScript产生的错误，使用方式如下：

```javascript
window.onerror = function(message, source, lineno, colno, error) { 
   // message：错误信息（字符串）。
   // source：发生错误的脚本URL（字符串）
   // lineno：发生错误的行号（数字）
   // colno：发生错误的列号（数字）
   // error：Error对象（对象）
}
```

但是使用时需要注意几点：

1. **Script Error** 

   在单页面应用中，当我们使用script标签引入了JS文件，当该JS文件的来源域名和网页的域名不同时，这时如果该JS文件内部报错，则我们只能捕获到Script Error，而不是详细的错误信息，这是由于浏览器的跨域限制。

   **解决方案：**

    - 需要在跨域的script标签中加入`crossorigin`属性，例如`<script type="text/javascript" src="example.js" crossorigin></script>`
    - 需要给跨域资源的服务器的response header设置允许跨域：`Access-Control-Allow-Origin:*`

2. 不能全局捕获到资源（如图片或脚本）的加载失败

   **解决方案：** 使用`window.addEventListener`捕获。

3. onerror无法捕获语法错误

4. onerror最好写在所有 JS 脚本的前面，否则有可能捕获不到错误

#### addEventListener

> 当一项资源（如图片或脚本）加载失败，加载资源的元素会触发一个Event接口的error事件，并执行该元素上的onerror()处理函数。这些error事件不会向上冒泡到window，不过（至少在Firefox中）能被单一的window.addEventListener捕获。

使用方式如下：

```javascript
window.addEventListener('error', (error) => {
  console.log(error);
}, true)
```

`window.addEventListener`在运行时错误和资源加载错误时返回的错误对象不同，可以参考下面两图：

运行时错误：

![](https://ricardocao-biker.github.io/IMGS/err2.jpg)

资源加载错误：

![](https://ricardocao-biker.github.io/IMGS/err3.jpg)

使用时需要注意的点：

1. 不同浏览器下返回的error对象可能不同，需要注意兼容处理。
2. 需要注意避免addEventListener重复监听。

#### promise catch

在promise中使用catch可以非常方便的捕获到异步error，使用方法大家也应该都了解了。

这里说一下需要注意的点:

没有写catch的Promise中抛出的错误无法被onerror 或 try-catch捕获到，所以我们务必要在Promise中不要忘记写catch处理抛出的异常。

   **解决方案：** 为了防止有漏掉的Promise异常，建议在全局增加一个对`unhandledrejection`的监听，用来全局监听Uncaught Promise Error。使用方式：

   ```javascript
   window.addEventListener("unhandledrejection", function(e){ 
   	console.log(e);
   });
   ```

#### 重写`XMLHttpRequest`对象的方法

该方法主要针对AJAX请求异常,附上参考代码：

```javascript
function () {
        var _self = this;

        // 重写 open
        XMLHttpRequest.prototype.open = function(){
            // 先在此处取得请求的url、method
            _self.reqUrl = arguments[1];
            _self.reqMethod = arguments[0];
            // 在调用原生 open 实现重写
            _self.xhrOpen.apply(this, arguments);
        }

        // 重写 send
        XMLHttpRequest.prototype.send = function () {
            // 记录xhr
            var xhrmsg = {
                'url': _self.reqUrl,
                'type': _self.reqMethod,
                // 此处可以取得 ajax 的请求参数
                'data': arguments[0] || {}
            }

            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    // 此处可以取得一些响应信息
                    // 响应信息
                    xhrmsg['res'] = this.response;
                    xhrmsg['status'] = this.status;
                    this.status >= 200 && this.status < 400 ?
                        xhrmsg['level'] = 'success' : xhrmsg['level'] = 'error';
                    xhrArray.push(xhrmsg);
                }
            });

            _self.xhrSend.apply(this, arguments);
        }
    }
```

#### MVVM框架提供的错误处理钩子

VUE和React都分别提供了对应的错误处理钩子，由于笔者使用VUE多一些，这里介绍一下VUE的错误处理：

**VUE官方文档介绍：**

> 指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。
>
>  从 2.2.0 起，这个钩子也会捕获组件生命周期钩子里的错误。同样的，当这个钩子是 `undefined` 时，被捕获的错误会通过 `console.error` 输出而避免应用崩溃。
>
>  从 2.4.0 起这个钩子也会捕获 Vue 自定义事件处理函数内部的错误了。

下面我们看一下实际情况：

```javascript
<template>
	<div @click="clickerror">error</div>
</template>

export default {
  mounted() {
    this.mounterror();
  },
  methods: {
    mounterror() {
    	throw new Error("抛出mount错误");
    },
    clickerror() {
		throw new Error("抛出click错误");
    }
  }
};
```

```javascript
Vue.config.errorHandler = (err, vm, info) => {
  console.error('通过vue errorHandler捕获的错误');
  console.error(err);
  console.error(vm);
  console.error(info);
}
```

![](https://ricardocao-biker.github.io/IMGS/err1.jpg)

可以看到生命周期钩子里的错误是可以被errorHandler捕获到，但是当我们主动点击div触发clickerror时，会发现这时错误并没有被errorHandler捕获到，控制台输出的是Uncaught Error，也就是没有被捕获到的错误，所以需要注意的是，errorHandler方法目前还捕获不到绑定监听事件触发的异常，但是可以捕获到在生命周期钩子中调用的方法的错误。

**解决方案** ：使用window.onerror

```javascript
window.onerror = function (message, source, lineno, colno, error) {
  console.error('通过onerror捕获到的错误');
  console.error(message);
  console.error(source);
  console.error(lineno);
  console.error(colno);
  console.error(error);
}
```

在MVVM框架中使用onerror监听全局异常会发现并不能捕获到绑定事件的详细错误信息，只会输出Script Error，

![](https://ricardocao-biker.github.io/IMGS/err5.jpg)

这时我们可以尝试进入webpack配置，设置`devtool:"source-map"`,这时在控制台再次打印可以看见成功捕获到绑定事件的错误。

![](https://ricardocao-biker.github.io/IMGS/err4.jpg)

### 错误上报

两种主流上报方式：

1. 通过Ajax发送数据

   因为Ajax请求本身也有可能会发生异常，而且有可能会引发跨域问题，一般情况下更推荐使用动态创建img标签的形式进行上报。

2. 动态创建 img 标签的形式

`new Image().src = reportUrl + '?msg=' + msg;`

