---
layout: post
title: 微信支付宝App支付服务端接口
description: 作为App涉及到的支付业务 必然的也会需要服务端去操作相应的接口逻辑 
                当然服务端可以使用我们的laravel去完成这些接口的功能
tags:
     App
     Wechat
     Api
     Laravel
class: post-four
comments: true
poster: /attachments/images/articles/2017-06-12/poster.jpg
---

## 简介

对于移动端开发来说 app集成支付服务对很多软件来说是必不可少的  其实整个过程描述起来就是在服务端用户在app上发起支付请求  

在这个过程中看起来只是一个支付密码的确认的过程 但是这其中包括微信服务商 客户端 服务端的后台服务这些都经历了几个很重要的过程

而在服务端我们需要对请求进行操作 返回和处理相应的数据  当然这些数据可能是用户发起来的也有可能是微信或者支付宝回馈给我们的

## 选择
对于服务端api的请求 我们完全可以使用laravel是处理这些接口  其实很多公司的接口大都php编写 不仅是因为php操作数据的简单方便

还有就是如今php对于处理api有完整的开源库 就比如对于restful api我们可以在laravel项目里集成dingo Api

> 这里的内容在我的另一篇博客 [Laravel API结合Dingo API和JWT](http://jellybook.me/articles/2017/03/laravel-jwt-api)

