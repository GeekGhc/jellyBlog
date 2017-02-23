---
layout: post
title: Webpack基本使用
description: webPack作为目前非常受欢迎的前端构建工具,相比于gulp和require构建工具自然有他存在的优势
tags:
     webpack
     前端构建工具
     vueJs
class: post-four
comments: true
poster: /attachments/images/articles/2017-02-19/poster.png
---

## 1.webpack安装
1.首先确保你已经正确安装了nodejs环境。然后可以全局方式安装webpack:
```
$ npm install -g webpack
```
我们可以检查一下`webpack`版本
```
$ webpack -v
```
这样就完成了对全局的安装

2.接下来我们可以在根目录下创建一个`index.html`并引入一个`app.js`

接着可以在根目录下的**js**文件夹下创建**part-one.js**和**part-two.js**以及我们的**entry.js**

其中**entry.js**里我们引入其他两个`js`文件
```php?start_inline=1
require('./part-one.js')
require('./part-two.js')
```
当然这个时候如果我们引入`entry.js`是没有用的 `require`这种写法是类似`nodejs`里服务端里的写法

我们终端运行
```
$ webpack js/entry.js app.js
```
> 这里的`app.js`就相当于我们的入口文件

这个时候我们在`index.html`里引入我们的`app.js`就可以成功执行到**js文件夹**下的`part-one.js`和`part-two.js`里的业务逻辑了

和**npm**的`package.json` **composer**的`composer.json` **bower**的`bower.json` 一样

**webpack**也有自己的相应的配置文件 执行：
```
$ touch webpack.config.js
```
## 2.webpack配置使用
1.在**webpack**配置文件里进行相应的配置
这是一个简单的配置:
```php?start_inline=1
module.exports = {
    devtool: "sourcemap",
    entry: "./js/entry.js",
    output: {
        filename: "app.js"
    }
}
```
- **sourcemap** 指定了生成文件间的对应关系 
- **entry.js** 指明了入口文件
- **app.js** 指明了最后打包生成的文件
回到我们的命令行我们就可以直接执行

```
$ webpack
```

这样就生成了我们需要的**app.js**文件 当然还有我们的`map`文件 在这里指明了文件之间的映射关系

当然这个时候我们需要更多的业务更多的需求 如我们需要引入`jquery`这样的库 其实这时候也和`gulp`差不多
我们在命令行中执行:
```
$ npm init
```
来生成我们的`package.json`
接下来我们开始引入`jquery` 命令行中执行
```
$ npm install jquery --save-dev
```

接下来我们就可以在我们的**js文件**里使用`jquery`了
```php?start_inline=1
var $ = require('jquery');
$("p").css("background-color","yellow");
```