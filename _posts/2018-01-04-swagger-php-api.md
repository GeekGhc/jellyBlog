---
layout: post
title: Swagger 构建项目中Api文档
description: 作为一个后端程序员,在编辑后台接口时,我们可以有多种选择,当然在此之前介绍过apidocJs,这里再介绍一个目前在用的接口管理工具Swagger
tags:
     PHP
     Swagger
     Api
class: post-nine
comments: true
poster: /attachments/images/articles/2018-01-04/poster.jpg
---

## 简介
在后端提供的前端的接口时，以前可能以一分`md`形式的文档提供给前端，现在开发对于前后台的交互很是常见，在编写我们后台的文档时，再遵循一定的规范即`OpenAPI`规范，根据这样的规范我们可以更加准确快速的描述`api`
而和`swagger`这些文档描述一样 ，你可以理解成一种独立与程序语言的注释性语言，因为他们不会随着最后程序而编译，而是单独的独立出来，根据自身的解释器而转换成一种格式文档，最后再加以渲染，比如`swagger`由`swagger-ui`渲染之后，前端程序员就可以直观的指导`api`的作用，并提供了交换测试的方式，这样的话很是方便

## 使用
这里以`laravel`项目为例，对于`swagger`已有先人帮我们集成好了，这里我们使用的是`zircote/swagger-php`,和`laravel`的扩展一样通过`composer`安装
```shell
$ composer require zircote/swagger-php
```

安装完毕之后 我们可以在应用的目录`App/Http`下新建`Api`目录用来存放我们的`Api`接口

新建一个`BaseController`来写基本的返回信息格式 当然在这个控制器里也会标注我们接口的版本信息

在`BaseController`里去定义接口的版本等信息
```php?start_inline=1
/**
 * @SWG\Swagger(
 *   host="www.geekghc.com",
 *   schemes={"http", "https"},
 *   basePath="/api/",
 *   @SWG\Info(
 *     version="1.0.0",
 *     title="codespace API文档",
 *     description="codespace community description...",
 *   )
 * )
 */
```
这里指明了`host` `version` `title` `description`这些描述信息 在接下来的接口类中都会继承这个父类

在解释器最终形成文档时也只会去解析这样的非代码的解释语言 最终就是得我们的`Api`文档

在这里我们最终生成的是`json`组成的文件信息,那么如果只是这样留给我们的前端相比会一脸懵逼,作为接口文档我们

希望其他人可以在线执行模拟接口信息并提供一定的`UI`这样看起来才是友好的

接下来新建一个路由用来展示最终的`Api`文档

## 相关链接
- [swagger官网](https://swagger.io/)
- [zircote/swagger-php插件地址](https://github.com/zircote/swagger-php)
- [如何编写 Swagger-PHP 的 API 文档](https://laravel-china.org/index.php/topics/7430/how-to-write-api-documents-based-on-swagger-php)
