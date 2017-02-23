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
1.和其他的构建工具一样`gulpjs`也需要一个相应的配置文件`gulpfile.js` 执行
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
```
$ gulp
```
这里默认的名为 default 的任务（task）将会被运行，但是这个任务并未做任何事情。
如果想要单独执行特定的任务，请输入 
```
gulp <task> <othertask>
```
## 3.gulp API使用

> gulp只有五个方法:task run watch src dest

1.**gulp.src(globs[, options])**

**globs**参数是文件匹配模式(类似正则表达式),他的类型是`String`或`Array`,用来匹配文件路径(包括文件名)，当然这里也可以直接指定某个具体的文件路径。当有多个匹配模式时，该参数可以为一个数组。

**options**为可选参数。通常情况下我们不需要用到。

***

我们这里简单可以理解为这个方法就是读取你需要操作的文件的

**Gulp**内部使用了`node-glob`模块来实现其文件匹配功能。
```php?start_inline=1
* 匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾
** 匹配路径中的0个或多个目录及其子目录,需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
? 匹配文件路径中的一个字符(不会匹配路径分隔符)
[...] 匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为^或!时，则表示不匹配方括号中出现的其他字符中的任意一个，类似js正则表达式中的用法
!(pattern|pattern|pattern) 匹配任何与括号中给定的任一模式都不匹配的
?(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或1次，类似于js正则中的(pattern|pattern|pattern)?
+(pattern|pattern|pattern) 匹配括号中给定的任一模式至少1次，类似于js正则中的(pattern|pattern|pattern)+
*(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或多次，类似于js正则中的(pattern|pattern|pattern)*
@(pattern|pattern|pattern) 匹配括号中给定的任一模式1次，类似于js正则中的(pattern|pattern|pattern)
```
当有多个匹配规则时 可以传入数组 如:
```php?start_inline=1
//使用数组的方式来匹配多种文件
gulp.src(['js/*.js','css/*.css','*.html'])
```
除此之外 数组还可以进行排除的匹配(ps:数组的第一个元素不能进行排除模式)
```php?start_inline=1
gulp.src([*.js,'!a*.js']) //    匹配所有js文件，但排除掉以a开头的js文件

gulp.src(['!a*.js',*.js]) //不会排除任何文件，因为排除模式不能出现在数组的第一个元素中
```

2.**gulp.dest(path[, options])**
简单的说**gulp.dest()**是用来写文件的

**path**为写入文件的路径

**options**为一个可选的参数对象，通常我们不需要用到

***

**gulp**的运行流程大致是这样的:

**gulp**的使用流程一般是这样子的：首先通过`gulp.src()`方法获取到我们想要处理的文件流，

然后把文件流通过pipe方法导入到gulp的插件中，最后把经过插件处理后的流再通过`pipe`方法导入到`gulp.dest()`中，

`gulp.dest()`方法则把流中的内容写入到文件中，这里首先需要弄清楚的一点是，

我们给`gulp.dest()`传入的路径参数，只能用来指定要生成的文件的目录，而不能指定生成文件的文件名，

它生成文件的文件名使用的是导入到它的文件流自身的文件名，所以生成的文件名是由导入到它的文件流决定的，

即使我们给它传入一个带有文件名的路径参数，然后它也会把这个文件名当做是目录名，例如：
```php?start_inline=1
var gulp = require('gulp');
gulp.src('script/jquery.js')
    .pipe(gulp.dest('dist/foo.js'));
//最终生成的文件路径为 dist/foo.js/jquery.js,而不是dist/foo.js

```