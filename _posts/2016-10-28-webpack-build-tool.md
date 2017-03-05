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
poster: /attachments/images/articles/2016-10-28/poster.png
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
## 3.webpack 进行Vue的组件化开发
1.下载相关的package
```
$ npm install vue vue-loader vue-html-loader vue-style-loader --save-dev
```
安装完毕后 我们去配置我们的`loader`(这在之前已经给出了)
```php?start_inline=1
{
    test:/\.vue$/,
    loader:"vue",
}
```

2.创建我们的vue组件
在根目录的js/components文件夹下创建h`heading.vue` 具体内容:
```php?start_inline=1
<template>
    <div>
        {{ message }}
    </div>
</template>

<script>
    export default{
        data(){
            return{
                message:'hello vueJs'
            }
        },
    }
</script>
```
写完后我们还需要在之前的入口文件`entry.js`里包含进来这个`vue`组件
```php?start_inline=1
import Heading from "./components/heading.vue"

//初始化一个vue 需要在视图文件里指定我们的app
new Vue({
    el:'#app',
    components:{Heading}
    /*
       * 当然我们也可以在初始化之前这样注册
       * Vue.component('Heading',require('./components/heading.vue'))
       */
})
```

这时在视图里我们就可以指定我们的组件了:
```php?start_inline=1
<div id="app">
    <Heading></Heading>
</div>
```
命令行再次执行
```
$ webpack
```
当然我们的`vue`由于是通过`npm`安装的 我们他会给出一个错误就是`Failed to mount component`
如果我们需要使用常规模式 这需要我们通过一个script标签进行引入或者添加一个[配置](https://vuejs.org/v2/guide/installation.html#Standalone-vs-Runtime-only-Build)
```php?start_inline=1
resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js'
        }
},
```
再去执行`webpack`就可以看到**hello vueJs**了 说明我们成功引入了`vue`组件

## 4.webpack hot reload(热加载)
1.webpack 有用的flag
- `webpack --display-modules`: 你可以看到各个`modules`的情况
- `webpack --display-modules --display-reasons`: 除此之外我们还可以清楚看出每个`module`的包含情况
-  `webpack -p`: 这会对打包的文件进行优化和压缩 特别的这对我们线上部署是很有用的
- `webpack -w`(webpack --watch): 这会执行一个watch的状态 不用我们每次修改文件之后再回来执行`webpack` 这和`gulp watch`是一个道理

2.`webpack`在`watch`机制上引进了`hot reload`机制

在引入hot reload 机制后我们不仅不需要再次执行`webpack` 每次修改文件后也不用刷新我们的浏览器
这对每个开发人员来说肯定是非常好的事情

开始安装:
```
$ npm install webpack-dev-server -g
```
安装完毕之后理论上我们就可以使用了:
这时候我们并不是去执行`webpack` 而是去命令行执行:
```
$ webpack-dev-server --inline --hot
```
`webpack-dev-server`会启动一个**web服务器** 默认端口是**8080**而`--hot`则是代表我们去执行一个热加载

> 如果没有启动成功 你需要考虑下有没有其他程序占用这个**8080**端口 这个就和我们最常见的**80**端口被占用是一样的

在这之后如果你去修改你的诸如`js文件` `css文件` `vue文件`  那么浏览器会同时执行了修改 这真的是件非常cool的事情

## 5.webpack 插件配置
1.针对线上还是线下环境的处理

和很多框架一样(如我们的`laravel`框架 会在`.env`读取对是否是线上还是线下的变量)在开发和上线是两种不同的工作环境
而在`webpack`里面是根据`env.NODE_ENV`进行判断的 这里会有`production`和`local`两个选择

我们可以这样获取(这就和我们框架中`debug`模式是否开启是一样的)
```php?start_inline=1
var debug = process.env.NODE_ENV !== "production";
```
有了我们的debug变量我们就可以获取到是否是线下环境 然后在我们的`webpack.config.json`可以这样写：
```php?start_inline=1
module.exports = {
devtool: debug?"sourcemap":null,
...
}
```
这个就是如果是线下环境我们就生成一个`sourcemap`如果是线上环境就不需要

2.**plugins**(插件)配置
我们在配置我们的插件的时候我们就需要把我们的插件放到我们的`webpack.config.json`一个`plugins`声明当中：
```php?start_inline=1
module.exports = {
devtool: debug?"sourcemap":null,
...
//这些是你需要一些plugins
plugins:debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    ...
]
}
```
这里是`webpack`的插件说明和相应的配置[https://github.com/webpack/docs/wiki/list-of-plugins](https://github.com/webpack/docs/wiki/list-of-plugins)

你可以去了解去使用你需要的`plugins`

下面提供一个`webpack`官方提供的`analyse`功能 [http://webpack.github.io/analyse/](http://webpack.github.io/analyse/)

> 他会根据你的js文件分析你的项目的package和文件之间的关系

这会需要我们上传一个json文件 我们可以在项目中去生成这个json文件:
```
$ webpack --profile --json > status.json
```
这会将我们`webpack`整个`profile`生成一个`status.json`
到时我们上传这个`status.json`文件就可以分析我们整个项目的结构了 :bowtie:
