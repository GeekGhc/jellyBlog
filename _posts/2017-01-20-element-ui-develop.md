---
layout: post
title: ElementUI 集成组件化开发
description: Element，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的组件库，提供了配套设计资源，使用起来还是很方便的。
tags:
     Vue2.0
     Element
     Components
class: post-three
comments: true
poster: /attachments/images/articles/2017-01-20/poster.png
---

## 介绍
寒假期间正在学习用脚手架来进行`vue`的**组件化开发** 之前的话因为是期初阶段 每一个组件用起来就感觉把一个个的盒子去拆分

特别是在打包时多多少少会有一些尴尬的事情 在接触也就是我要介绍的[element](http://element.eleme.io/#/zh-CN/component/installation)组件解决方案后这个项目进行起来就很舒服了

其实用起来真的很是方便 因为本身就是基于`vue 2.0`开发的 知道最近在写自己的项目时想想还是记录一下  确实是一个很好的解决方案
## 1.安装
我们可以采取`CDN`以及`npm`安装的方式
因为我是集成在用脚手架搭建的`vue`项目里的 我自然选择了`npm`安装的方式:
```
$ npm i element-ui -S
```
安装完成后会在`package.json`里看到已经成功安装:
```php?start_inline=1
"dependencies": {
    "axios": "^0.15.3",
    "element-ui": "^1.2.3",
    "vue": "^2.1.10",
    "vue-axios": "^1.2.2",
    "vue-router": "^2.2.0",
    "vuex": "^2.1.3"
},
```
## 2.组件引入
1.在引入我们的`Element`时 我们可以选择完整引入和按需引入(如果你想省些事的话就完整引入吧)

完整引入时只需要在`main.js`里`import`后`use`声明下 这和我们去引用其他类似`vue-axios`是一样的

> 这些在官方文档里都有介绍

为实现按需引入我们需要去安装`babel-plugin-component`这个`plugin`:
```
$ npm install babel-plugin-component -D
```
安装完毕后我们需要去修改一下我们的`babel`配置文件`.babelrc`:
```php?start_inline=1
{
  "presets": [
    ["es2015", { "modules": false }]
  ],
  "plugins": [["component", [
    {
      "libraryName": "element-ui",
      "styleLibraryName": "theme-default"
    }
  ]]]
}
```

> 接下来就是引入我们需要的组件 具体的文档也有介绍

## 3.项目里使用
使用起来的话其实就和其他的`UI`框架差不多(也是支持响应式的) 不过你可以在组件里定义一些`element`特性

这里的UI框架诸如我们经常用到的`BootStrap`以及`SemanticUI`之类的

使用的话关注一些表单验证 组合的属性使用 布局 其余和我们结合文档还是很容易使用的

## 其他的组件UI推荐
- MuseUI-[https://museui.github.io/#/index](https://museui.github.io/#/index)
- IView-[https://www.iviewui.com/](https://www.iviewui.com/)
- Mint Ui(移动端)-[http://mint-ui.github.io/#!/en](http://mint-ui.github.io/#!/en)

##### 相关材料链接
- [element组件网址](http://element.eleme.io/#/zh-CN/component/installation)
