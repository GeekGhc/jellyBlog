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
poster: /attachments/images/articles/2017-01-19/poster.png
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

## 2.webpack Loader机制
1.和其他构件工具一样`webpack`也可以将我们的静态文件进行打包 而有所不同的是

`webpack`采用**loader机制**将静态文件打包到一个**js文件**再通过不同`loader`进行加载使用

这样的话我们在项目里只需要加载**一个js文件**就可以达到应用的目的了

2.下面开始下载我们所需的`loader`
首先我们可以下载我们对样式处理的`loader`
```
$ npm install css-loader style-loader --save-dev
```

在我们先前的配置文件`webpack.config.json`里我们就需要声明`loader`对应的处理

```php?start_inline=1
module: {//在配置文件里添加JSON loader
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            }
        ]
},
```

> 配置里其实也就是通过正则表达式来匹配`.css`的文件 并且用`css loader`和`style loader`来进行处理

当然我们这时需要在入口文件`entry.js`里包含我们的`css`文件，
假使我们在根目录先的`css`文件夹创建了一个`style.css`，
我们需要在`entry.js`文件里包含进这个css文件
```php?start_inline=1
require("../css/style.css")
```
来到命令行执行:
```
$ webpack
```
我们就会看到`style.css`里的样式已经成功应用到我们的页面上了

3.将`js`交给我们的`babel`来进行处理
下载相关的`loader`：
```
$ npm install babel-core babel-loader babel-plugin-transform-runtime babel-preset-es2015 babel-preset-stage-0 babel-runtime --save-dev
```

下载完成之后在`webpack.config.json`里进行配置来进行`babel`编译
```php?start_inline=1
babel: {
        presets: ['es2015','stage-0'],
        plugins: ['transform-runtime']
}
```
接着就是添加对`js`文件的`loader`
```php?start_inline=1
module: {//在配置文件里添加JSON loader
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.js$/,
                loader:"babel",
                //忽略掉node_modules
                exclude: /node_modules/
            },
            {
                test:/\.vue$/,
                loader:"vue",
            }
        ]
    },
```

> 在这里也给出了对vue文件的loader处理 因为接下来我们还是要借助这个来进行vueJs的组件化开发

这样一来我们就可以在我们的`js`文件里使用`babel`语法
同样的我们也是在`entry.js`里去引入我们的`jquery`
这时我们就可以通过`import`进来  这在**vueJs组件化开发**时也是很常见的
```php?start_inline=1
import $ from 'jquery'

//如果你要引入Vue的话
import Vue from 'vue';
```