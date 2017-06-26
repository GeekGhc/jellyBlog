---
layout: post
title: APP微信支付宝支付服务端接口
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

对于移动端开发来说 `app`集成支付服务对很多软件来说是必不可少的  其实整个过程描述起来就是在服务端用户在`app`上发起支付请求  

在这个过程中看起来只是一个支付密码的确认的过程 但是这其中包括微信服务商 客户端 服务端的后台服务这些都经历了几个很重要的过程

而在服务端我们需要对请求进行操作 返回和处理相应的数据  当然这些数据可能是用户发起来的也有可能是微信或者支付宝回馈给我们的

## 选择
对于服务端`api`的请求 我们完全可以使用`laravel`是处理这些接口  其实很多公司的接口大都`php`编写 不仅是因为`php`操作数据的简单方便

还有就是如今`php`对于处理`api`有完整的开源库 就比如对于`restful api`我们可以在`laravel`项目里集成`dingo Api`


> 这里的内容在我的另一篇博客 [Laravel API结合Dingo API和JWT](http://jellybook.me/articles/2017/03/laravel-jwt-api)

## 微信支付

#### 准备工作

一开始当然是去微信的开发文档 了解下一些接口的具体参数信息  [App开发者文档](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=8_1)

对于整个流程交互 先来一张微信提供的交互时序图
![1](/attachments/images/articles/2017-06-12/1.png)

#### 交互流程
理解这个交互流程还是很重要的  之前也提到过 无论是微信支付还是支付宝支付 有几个流程是不可少的

1.用户在客户端`APP`选择商品 生成订单信息 选择微信支付方式
2.商户后台收到用户支付单，调用微信支付统一下单接口。 参见[统一下单API]
3.统一下单接口返回正常的`prepay_id`，再按签名规范重新生成签名后，将数据传输给客户端`APP`。
  参与签名的字段名为`appId`，`partnerId`，`prepayId`，`nonceStr`，`timeStamp`，`package`。
  注意：`package`的值格式为`Sign=WXPay`
4.商户`APP`调起微信支付。`api` 参见[app端开发步骤说明](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=8_5)
5.商户后台接收支付通知。`api`参见 [支付结果通知API](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_7)
6.商户后台查询支付结果。参见[查询订单API](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_2)
7.商户后台回调支付结果等数据 参见[支付结果通知](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_7&index=3)

#### 开发


## 相关文档

- GitHub地址  [PayApi](https://github.com/GeekGhc/PayApi)



