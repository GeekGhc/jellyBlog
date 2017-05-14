---
layout: post
title: Laravel API结合Dingo API和JWT
description: 在Web开发，Api开发是一项非常重要的技术，这里就以Laravel项目实例来开发API 熟悉下API的具体的流程
tags:
     Laravel
     API
     JWT
     Dingo
class: post-seven
comments: true
poster: /attachments/images/articles/2017-03-19/poster.jpg
---

## 介绍
关于`API`的开发 不得不提的就是可以利用`Dingo`来构建更加强大的`API` 这样我们可以更好的去实现`API`认证和请求

## 安装
首先当然是去[安装页面](https://github.com/dingo/api/wiki/Installation) 根据提供的包进行下载 在`laravel`项目中就是`require`这个`package`
```php?start_inline=1
"dingo/api": "1.0.*@dev"
```
如果需要实现`jwt` 同样的也是去[安装页面](https://github.com/tymondesigns/jwt-auth/wiki/Authentication) 安装这个`package`
```php?start_inline=1
"require": {
    "tymon/jwt-auth": "0.5.*"
}
```
## 相关链接
- [Dingo/api](https://github.com/dingo/api)
- [tymondesigns/jwt-auth](https://github.com/tymondesigns/jwt-auth)
