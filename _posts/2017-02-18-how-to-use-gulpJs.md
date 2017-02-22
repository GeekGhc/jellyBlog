---
layout: post
title: gulpJs使用技巧介绍
description: gulpjs是一个前端构建工具，与gruntjs相比，gulpjs无需写一大堆繁杂的配置参数，API也非常简单，学习起来也相对容易
tags:
     gulpJs
     前端构建工具
     插件
class: post-two
comments: true
poster: /attachments/images/articles/2017-02-24-how-to-use-gulpJs/poster.png
---

## 1.gulp安装
1.首先确保你已经正确安装了nodejs环境。然后可以全局方式安装gulp：
```
$ npm install -g gulp
```
我们可以检查一下`gulp`版本
```
$ gulp -v
```
这样就完成了对全局的安装
2.如果想在安装的时候把gulp写进项目package.json文件的依赖中，则可以加上--save-dev：
```
$ npm install --save-dev gulp
```
其中`--save-dev`和`--save`的区别这里也有清楚的[解释](https://segmentfault.com/q/1010000005163089/a-1020000005164220)
> 这其实在composer安装依赖包是一样的 一个存在`require`一个存在`require-dev`

## 2.开始使用gulp
1.
和其他的构建工具一样`gulpjs`也需要一个相应的配置文件`gulpfile.js` 执行
```
$ touch gulpfile.js
```

2.首先是一个简单的e`gulpfile.js`内容:
{% highlight ruby%}
var gulp = require('gulp');
gulp.task('default',function(){
    // 将你的默认的任务代码放在这
});
{% endhighlight %}
3.运行**gulp**
```apacheconfig
$ gulp
```
这里默认的名为 default 的任务（task）将会被运行，但是这个任务并未做任何事情。
如果想要单独执行特定的任务，请输入 
```
gulp <task> <othertask>
```
## 3.gulp API使用
1.**gulp.src(globs[, options])**

**globs**参数是文件匹配模式(类似正则表达式),他的类型是`String`或`Array`,用来匹配文件路径(包括文件名)，当然这里也可以直接指定某个具体的文件路径。当有多个匹配模式时，该参数可以为一个数组。

**options**为可选参数。通常情况下我们不需要用到。
