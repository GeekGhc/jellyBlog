---
layout: post
title: API文档编写-apidocJs
description: 
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
```php?start_inline=1
{
  "name": "codespace",
  "private": true,
  "version": "1.0.0",
  "description": "test project",
  "apidoc": {
    "title": "codespace"
  },
  ...
}
```