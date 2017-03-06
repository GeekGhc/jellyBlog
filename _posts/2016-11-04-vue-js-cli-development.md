---
layout: post
title: Vue使用脚手架进行组件化开发
description: Vuejs 脚手架工具是 Vuejs 官方提供的一个命令行操作工具，我们可以初始化一个 Vuejs 项目来进行组件化开发
tags:
     vueJs
     组件化开发
     脚手架工具
class: post-three
comments: true
poster: /attachments/images/articles/2016-11-04/poster.png
---

## 1.vue-cli安装
1.首先确保你已经正确安装了**nodejs环境**以及**git** 然后可以全局方式安装**vue-cli**：

vue-cli github地址[https://github.com/vuejs/vue-cli](https://github.com/vuejs/vue-cli)

> 当然对`node` 和 `npm` 版本也有一定要求

```
$ npm install -g vue-cli
```

安装完毕之后我们可以在命令行执行一个vue的命令:
 ```
$ vue
```
2.初始化项目
```
$ vue init <template-name> <project-name>
```
现在我们开始创建我们的项目:
```
$ vue init webpack my-project
```

> 这里的`webpack`是指我们生成的`project`是使用`webpack`构建工具

当然也会有其他的选择 这在`github`上已经给出了:

- [webpack](https://github.com/vuejs-templates/webpack) - A full-featured Webpack + vue-loader setup with hot reload, linting, testing & css extraction.
- [webpack-simple](https://github.com/vuejs-templates/webpack-simple) - A simple Webpack + vue-loader setup for quick prototyping.
- [browserify](https://github.com/vuejs-templates/browserify) - A full-featured Browserify + vueify setup with hot-reload, linting & unit testing.
- [browserify-simple](https://github.com/vuejs-templates/browserify-simple) - A simple Browserify + vueify setup for quick prototyping.
- [simple](https://github.com/vuejs-templates/simple) - The simplest possible Vue setup in a single HTML file

在生成项目时我们都选择默认 同时也需要注意一下几点:

- 特别的在`Runtime + Compiler`和` Runtime-only`时我们还是选择`Runtime + Compiler`模式
- 在选择是否需要安装vue-router时 选择`N`为的是一开始我们更容易去学习和理解
- 然后会问你是否需要`ESLint`, 因为我们是刚开始我们选择`N`(因为`ESLint`语法要求比较严格)
- `unit tests`我们也不需要了

接下来我们进入到我们的项目`my-peoject`执行`npm install`以及我们的
```
$ npm run dev
```

> 如果你在npm install下载的时候发生错误 大都需要你升级nodejs和npm到最新的版本 之前我们也提到过就是在官方给出就是对版本也有一定要求

执行完`npm run dev`会启动一个服务器 并运行在我们的8080端口:
![one](/attachments/images/articles/2016-11-04/one.png)

用`phpstrom`打开我们的项目 可以看到我们的文件目录(而我们最需要关注的就是我们的`src`目录)

## 2.vue-cli 项目结构
1.**src**目录是我们的组件存放等文件的目录

![two](/attachments/images/articles/2016-11-04/two.png)
在`main.js`里定义了我们`vueJs`的一个实例:
```php?start_inline=1
import Vue from 'vue'
import App from './App'
import router from './router'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
```

> `router`是我在初始化项目时确认安装的 当然这在之后也可以进行安装引入 我们在接下来会用到这个(不过我觉得初始化时不用去安装vue-router 这样刚接触时会更容易理解)

除此之外我们可以看到这个`vue`实例包含了一个`App template` 而这个`template`就在我们的同级目录下的`App.vue`

来到我们的`App.vue` 可以看到在上面其实就是定义了一个`template` 下面是一个script标签用来指明这个`template`
然后就是我们的`style`标签定义的样式

可以想象得到的是因为我们我们是使用的`webpack`这个构建工具 所以`template`这个是交由我们的`html loader`去处理的
而`script`里的内容是由`script loader`  `style`标签里的内容是交由我们的`style loader`去处理的

在`App.vue`这个`template`里引入了在同级目录components下的`Hello`组件 它里面的内容就是我们一开始**8080**端口所看到的内容

在这之后我们就可以往用vue-cli构建的项目里面去添加我们需要的组件内容了

假使我们需要添加一个`Todo`组件
我们就可以在`src/components`下去创建`Todo.vue`
他的具体内容当然是根据自己的业务去写了 每个组件的组成形式也就是我们之前提到的`Hello.vue`这样的(学习过vueJs的应该很容易就能理解这些文件的内容了)

用`vue-cli`去构建我们的`vueJs`组件化开发大概就是这样 当然在这之后我们可以去利用`vueJs`官方推荐的`vue-router`
去构建我们的**SPA(单页面应用)**


