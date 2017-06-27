---
layout: post
title: 今日头条资讯APP
description: 类似于今日头条的新闻App 
tags:
     Android
     App
     Java
class: post-five
comments: true
poster: /attachments/images/articles/2017-06-20/poster.jpg
---

## 简介

类似今日头条的新闻资讯`app` 采用`MVP+[RxJava]`模式  用户部分采用本地接口

最近学校在开`Android`的实训课 实验课题就是开发一款类似今日头条的新闻资讯`App` 当然乘着这些时间
 
自己也学到了不少安卓的网络请求和移动开发的知识 新闻接口采用[网易新闻](http://c.m.163.com/)的接口 

对于用户的登录等操作我以`laravel`开发的服务端的接口

## 项目地址

Github项目地址 [GeekGhc/TopNews](https://github.com/GeekGhc/TopNews)

## 预览

![1](/attachments/images/articles/2017-06-20/1.gif)![2](/attachments/images/articles/2017-06-20/2.gif)
![3](/attachments/images/articles/2017-06-20/01.png)![4](/attachments/images/articles/2017-06-20/02.png)
![5](/attachments/images/articles/2017-06-20/03.png)![6](/attachments/images/articles/2017-06-20/04.png)
![7](/attachments/images/articles/2017-06-20/05.png)![8](/attachments/images/articles/2017-06-20/06.png)
![9](/attachments/images/articles/2017-06-20/07.png)![10](/attachments/images/articles/2017-06-20/08.png)
![11](/attachments/images/articles/2017-06-20/09.png)![12](/attachments/images/articles/2017-06-20/10.png)

## 要点摘要

* 使用RxJava配合Retrofit2做网络请求
* 使用RxUtil对线程操作和网络请求结果处理做了封装
* 使用RxPresenter对订阅的生命周期做管理
* 使用RxBus来方便组件间的通信
* 使用RxJava其他操作符来做延时、轮询、转化、筛选等操作
* 使用okhttp3对网络返回内容做缓存，还有日志、超时重连、头部消息的配置
* 使用Material Design控件和动画
* 使用MVP架构整个项目，对应于model、ui、presenter三个包
* 使用Glide做图片的处理和加载
* 使用GreenDao存储删除添加频道信息
* 使用Fragmentation简化Fragment的操作和懒加载
* 使用RecyclerView实现下拉刷新、上拉加载、侧滑删除、长按拖曳
* 使用x5WebView做阅览页，比原生WebView体验更佳
* 使用原生的夜间模式、分享、反馈
* 使用MaterialCalendarview实现日历查看
* 使用ShareSdk的第三方登录QQ和微博
* 使用ShareSdk的分享到第三方
* 包含收藏等功能

## 项目Api

- `Api`文档地址 [topnew-api](https://www.eolinker.com/#/share/index?shareCode=URBGwr)

- 图片api [干货集中营](http://gank.io/api)
- 新闻api [网易新闻](http://c.m.163.com/)
- 用户信息 [topnews-api](https://github.com/GeekGhc/topnews-api)

> 欢迎提出`issue`和`star` :bowtie:

