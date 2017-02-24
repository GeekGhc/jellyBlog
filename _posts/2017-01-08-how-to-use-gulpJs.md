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
poster: /attachments/images/articles/2017-01-08/poster.png
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
```php?start_inline=1
var gulp = require('gulp');
gulp.task('default',function(){
    // 将你的默认的任务代码放在这
});
```
3.运行**gulp**
```
$ gulp
```

要运行**gulp**任务，只需切换到存放`gulpfile.js`文件的目录，然后在命令行中执行`gulp`命令就行了，`gulp`后面可以加上要执行的任务名，例如`gulp task1`，如果没有指定任务名，则会执行任务名为`default`的默认任务

这里默认的名为 default 的任务（task）将会被运行，但是这个任务并未做任何事情。
如果想要单独执行特定的任务，请输入 
```
gulp <task> <othertask>
```

## 3.gulp API使用

> gulp只有五个方法:task run watch src dest

1.**gulp.src(globs[, options])**

- **globs**参数是文件匹配模式(类似正则表达式),他的类型是`String`或`Array`,用来匹配文件路径(包括文件名)，当然这里也可以直接指定某个具体的文件路径。当有多个匹配模式时，该参数可以为一个数组。
- **options**为可选参数。通常情况下我们不需要用到。

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
***

2.**gulp.dest(path[, options])**
简单的说**gulp.dest()**是用来写文件的

- **path**为写入文件的路径
- **options**为一个可选的参数对象，通常我们不需要用到

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

通过指定`gulp.src()`方法配置参数中的`base`属性，我们可以更灵活的来改变`gulp.dest()`生成的文件路径。
当我们没有在`gulp.src()`方法中配置`base`属性时，`base`的默认值为通配符开始出现之前那部分路径，例如：
```php?start_inline=1
gulp.src('app/src/**/*.css') //此时base的值为 app/src
```
> gulp.src()的bade属性可以在options里指定

```php?start_inline=1
gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  // 写入 'build/js/somedir/somefile.js'
  
gulp.src(script/lib/*.js, {base:'script'}) //配置了base参数，此时base路径为script
   //假设匹配到的文件为script/lib/jquery.js
   .pipe(gulp.dest('build')) //此时生成的文件路径为 build/lib/jquery.js    
```

我们可以这样理解:
上面我们说的`gulp.dest()`所生成的文件路径的规则，其实也可以理解成，用我们给`gulp.dest()`传入的路径替换掉`gulp.src()`中的`base`路径，最终得到生成文件的路径。

***

3.**gulp.task(name[, deps], fn)**
- **name** 为任务名(请不要在名字中使用空格)
- **deps** 是当前定义的任务需要依赖的其他任务，为一个数组。当前定义的任务会在所有依赖的任务执行完毕后才开始执行。如果没有依赖，则可省略这个参数
- **fn** 为任务函数，我们把任务要执行的代码都写在里面。该参数也是可选的。

**gulp**中执行多个任务，我们的项目里肯定会有处理类似`css` `js` `images` `fonts` 这样的静态文件的几个任务
可以通过任务依赖来实现。例如我想要执行**one**,**two**,**three**这三个任务，那我们就可以定义一个空的任务，然后把那三个任务当做这个空的任务的依赖就行了：

```php?start_inline=1
//只要执行default任务，就相当于把css,images,scripts这三个文件任务执行了
gulp.task('default',['css','images','scripts']);
```
如果任务相互之间没有依赖，任务会按你书写的顺序来执行，如果有依赖的话则会先执行依赖的任务。

在处理所依赖的任务是异步的这样的应用场景也是有几种解决方案的：
- [依赖任务异步执行](http://www.gulpjs.com.cn/docs/api/)

4.**gulp.watch(glob [, opts], tasks) 或 gulp.watch(glob [, opts, cb])**
> **gulp.watch()**用来监视文件的变化，当文件发生变化后，我们可以利用它来执行相应的任务，例如文件压缩等。

- **glob** 为要监视的文件匹配模式，规则和用法与**gulp.src()**方法中的**glob**相同。
- **opts** 为一个可选的配置对象，通常不需要用到
- **tasks** 为文件变化后要执行的任务，为一个数组

每当监视的文件发生变化时，就会调用这个函数,并且会给它传入一个对象，该对象包含了文件变化的一些信息，**type**属性为变化的类型，可以是`added`,`changed`,`deleted`；**path**属性为发生变化的文件的路径
```php?start_inline=1
gulp.watch('js/**/*.js', function(event){
    console.log(event.type); //变化类型 added为新增,deleted为删除，changed为改变 
    console.log(event.path); //变化的文件的路径
}); 

gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type);
});
```

## 4.gulp 插件使用
> [gulp 插件库](http://gulpjs.com/plugins/)

1.自动加载 **gulp-load-plugins**

安装: `npm install --save-dev gulp-load-plugins`

在使用**gulp插件**时都需要`require`进来 而这个插件很好的解决了这个问题

**gulp-load-plugins**并不会一开始就加载所有`package.json`里的`gulp`插件，而是在我们需要用到某个插件的时候，才去加载那个插件。

因为**gulp-load-plugins**是通过你的`package.json`文件来加载插件的，所以必须要保证你需要自动加载的插件已经写入到了`package.json`文件里，并且这些插件都是已经安装好了的

下面这是一段一段很方便使用其他插件的**load-plugins**代码(其实就是匹配到`package.json`里的插件):

```php?start_inline=1
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
```
这样就可以通过 **plugins.name()**来使用我们的插件 举一个简单的使用**gulp-rename**这个插件的例子
```php?start_inline=1
gulp.task('one',function () {
    gulp.src(paths.styles.src+'/one.css')
        .pipe(plugins.rename('new.css')) //而不用声明类似var rename = require('gulp-rename')
        .pipe(gulp.dest(paths.styles.dest));
});
```
2.重命名**gulp-rename**

安装：`npm install --save-dev gulp-rename`

```php?start_inline=1
var rename = require('gulp-rename');
//最后将src/styles/one.css 生成到 assets/styles/new.css
gulp.task('one',function () {
    gulp.src('src/styles/one.css')
        .pipe(rename('new.css'))
        .pipe(gulp.dest('asstes/styles'));
});
```

3.js文件压缩 **gulp-uglify**

安装：`npm install --save-dev gulp-uglify`

```php?start_inline=1
var gulp = require('gulp'),
    uglify = require("gulp-uglify");
 
gulp.task('minify-js', function () {
    gulp.src('src/scripts/*.js') // 要压缩的js文件
    .pipe(uglify())  //使用uglify进行压缩
    .pipe(gulp.dest('assets/js')); //压缩后的路径
});
```

4.文件合并 **gulp-concat**

安装：`npm install --save-dev gulp-concat`

```php?start_inline=1
var gulp = require('gulp'),
    concat = require("gulp-concat")
    uglify = require("gulp-uglify");
 
//如果src/scripts下有one.js two.js three.js  那么最后合并到assets/js/all.js
gulp.task('concat', function () {
    gulp.src('src/scripts/*.js')  //要合并的文件
    .pipe(uglify())  //使用uglify进行压缩
    .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
    .pipe(gulp.dest('assets/js'));
});
```

5.less和sass的编译

安装：`npm install --save-dev gulp-less` `npm install --save-dev gulp-sass`

```php?start_inline=1
var gulp = require('gulp'),
    less = require("gulp-less");
 
gulp.task('compile-less', function () {
    gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('assets/css'));
});
```
> 当然还有其他非常有用插件 [gulp 插件库](http://gulpjs.com/plugins/)

### 相关资料参考于:
- [gulp Api文档](http://www.gulpjs.com.cn/docs/api/)
- [前端构建工具gulp](http://www.cnblogs.com/2050/p/4198792.html)
