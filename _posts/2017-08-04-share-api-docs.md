---
layout: post
title: API文档编写-apidocJs
description: 在后台编写api文档时  我们如果希望自己的文档注释就可以自动解析成接口文档 那么改完注释代码 
            接口文档也会更新 这样就不十分方便
tags:
     API
     docs
class: post-three
comments: true
poster: /attachments/images/articles/2017-08-04/poster.jpg
---

## 简介

在开发后台 需要`api`的编写 那么在提供给web端和移动客户端的开发者时需要给他们提供必要的`api`文档  那么今天就来介绍

一个文档编写工具 [apidocjs](http://apidocjs.com/)  整个语法还是遵循`markdown`的语法

当然`apidoc`支持`Grunt`，主页 `https://github.com/apidoc/grunt-apidoc`

其实这样类似的工具还有很多  但目的只有一个就是提供给其他开发者更好的说明  所以说文档的编写和规范都是十分重要的


## 安装
在命令行全局安装
```shell
$ npm install apidoc -g
```

`apidoc`支持`Grunt`，主页[https://github.com/apidoc/grunt-apidoc](https://github.com/apidoc/grunt-apidoc)

在项目中可以使用`npm install grunt-apidoc --save-dev`安装

添加`grunt.loadNpmTasks('grunt-apidoc')`到`Gruntfile.js`

添加`grunt task` 这里面包含了输出目录等信息
```php?start_inline=1
apidoc: {
      myapp: {
        src: "app/",
        dest: "apidoc/"
      }
}
```

```php?start_inline=1
module.exports = function(grunt) {
    grunt.config.set('clean', {
      apidoc: {
        myapp: {
          src: "app/",
          dest: "apidoc/"
        }
      }
    });
    grunt.loadNpmTasks('grunt-apidoc');
};
```


安装完毕之后可以查看一下命令
```shell
$ apidoc -h
```

下面会看到一些参数  这里简单介绍几个

| 标题 | 地址 |
| ------ | ------ |
| -o | 指定文档的输出目录 |
| -i | 输入文件夹 这里包含了|
| -t | 指定输出文件的模板 |
| -c | 指定配置文件的文件目录 |

接下来就是配置文件`appidoc.json`的定义  实例如下
```php?start_inline=1
{
  "name" : "codespace",
  "version": "1.0.0",
  "title": "codespace",
  "description": test project"
}
```
当然配置文件的内容放入`package.json`也是可以的(相同的字段就和`package.json`一样 而不一样的就放在`apidoc`下)

比如正在终端执行
```shell
$ npm init
```

填写你的项目信息即可 最后别忘了加上`apidoc`这个配置项

```php?start_inline=1
{
  "name": "codespace",
  "version": "1.0.0",
  "description": "test for codespace",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "api"
  ],
  "author": "jellybean",
  "license": "MIT",
  "apidoc":{
    "title":"codespace"
  }
}
```

当然为了生成最后的文档文件  我们还需要生成我们的代码文件  当然在实际项目中可以新建一个文档的文件

我们在`myapp`文件目录下新建生成`doc.php`  具体内容如下(文档的语法格式在接下来会介绍)
```php?start_inline=1
/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
```
来到`myapp`的上级目录(当然也可以在当前目录 看具体执行的命令)
```shell
$  apidoc -i myapp/ -o apidoc/
```
这样的话会在当前目录生成`apidoc`的文件目录 里面就包含了最后文档的样式和内容  这样的话我们可以将文档直接部署到服务器
或者一些托管平台了

对于文档的语法当然具体的还是看 [官方文档](http://apidocjs.com) 这里就先介绍几个

首先文档的代码块是以`/**`和`*/`开始和结束 这个从上面的事例就可以看出来

### @api
定义接口的形式和地址 包括具体的请求类型和参数等
```php?start_inline=1
@api {method} path [title]
```
### @apiName
定义接口名

### @apiGroup
定义接口所属组  因为接口可能会分类 比如书籍类接口和评论类接口

### @apiDefine
定义一组接口返回实例  这和`@apiUse`对应起来用(你可以理解为在这声明了一个`function`)  

然后再需要的地方再使用  如我们现在定义一组错误提示
```php?start_inline=1
/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
```

这样的话我们可能在某个接口部分会使用到差找不到用户这个错误返回时可以加上
```php?start_inline=1
@apiUse UserNotFoundError
```

### @apiHeader
定义了接口请求的头部信息 如
```php?start_inline=1
/**
 * @api {get} /user/:id
 * @apiHeader {String} access-key Users unique access-key.
 */
```

### @apiParam
接口的请求参数 列举出接口的请求参数 类型 是否可选等(可选的话`[]`包含参数名)  如
```php?start_inline=1
@apiParam {Number} id Users unique ID.
@apiParam {String} [firstname] Firstname of the User.
```
### @apiSuccess
接口成功返回的字段信息  包括接口类型 描述
```php?start_inline=1
@apiSuccess {String} firstname Firstname of the User.
@apiSuccess {String} lastname  Lastname of the User.
```

### @apiSuccessExample Success-Response:
接口请求成功返回的形式事例  如
```php?start_inline=1
HTTP/1.1 200 OK
      {
        "firstname": "John",
        "lastname": "Doe"
      }
```

### @apiError
定义接口的错误信息  包含错误类型和描述

### @apiErrorExample Error-Response:
定义接口错误返回实例 如
```php?start_inline=1
HTTP/1.1 404 Not Found
      {
        "error": "UserNotFound"
      }
```

事例效果图
![1](/attachments/images/articles/2017-08-04/1.png)