---
layout: post
title: 传统Ajax到Fetch
description: 页面中需要向服务器请求数据时，基本上都会使用Ajax来实现。Ajax的本质是使用XMLHttpRequest对象来请求数据
                不过还有就是基于Promise来处理数据 这种技术就是Fetch
tags:
     Javascript
     Ajax
     Fetch
     Async
class: post-three
comments: true
poster: /attachments/images/articles/2016-11-09/poster.jpg
---

## 介绍
最近还在学习`vueJs` 在进行前端页面开发时 涉及了用户的状态管理 官方也提供了`vuex`这样的解决方案 在解决与后端的`api`请求时

集成了`javascript`的新特性`async/await` 对于之前一直用的`ajax`的我来说 感觉有必要去了解学习下了

## 传统的ajax
