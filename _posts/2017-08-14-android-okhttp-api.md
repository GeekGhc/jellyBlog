---
layout: post
title: Android okhttp+retrofit+RxJava 网络接口请求
description: 利用okhttp+retrofit+RxJava网络架构请求网络接口 客户端解析数据并通过适配器渲染 
tags:
     android
     okhttp
     RxJava
     retrofit
class: post-five
comments: true
poster: /attachments/images/articles/2017-08-14/poster.jpg
---

## 简介
在`Android`中 我们在客户端需要去解析后台提供给我们的接口 而在对于需要解析的数据时  我们首先要确定我们需要什么的

数据形式和数据量 这样我们才可以确定数据结构的生成 那么在请求远程接口时我们现在更多的就是用到我们的网络三剑客

`okhttp+retrofit+RxJava` 那么接下来我们就去实现一个项目中的接口的解析 并封装好自己的客户端接口类

