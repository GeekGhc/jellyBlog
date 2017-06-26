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

#### 统一下单

这里包括应用`ID`、商户号、设备号等等，我们只需向其传输必填项即可，选填数据可以根据自己的实际需求来决定

其中`appid` 和 `mch_id` 分别去到微信开放平台和微信商户平台中获取，`nonce_str` (随机字符串) 很随意了，不长于**32**位就好

这里给出一个随机字符串的返回方法
```php?start_inline=1
private function getNonceStr() {
    $code = "";
    for ($i=0; $i > 10; $i++) { 
        $code .= mt_rand(1000);        //获取随机数
    }
    $nonceStrTemp = md5($code);
    $nonce_str = mb_substr($nonceStrTemp, 5,37);      //MD5加密后截取32位字符
    return $nonce_str;
}
```
当然这样的方法在无论在客户端和服务端都是可以的 但是就是一个随机字符串的方法在客户端生成更为方便

这里还有一个重要的参数 `notify_url`（通知地址）是接收微信支付异步通知回调地址，

通知`url`必须为直接可访问的`url`，不能携带参数。例如：`'https://pay.weixin.qq.com/wxpay/pay.action'`

这里我们在后面处理微信的回调接口就是访问的这个接口

接下来就是最为核心的步骤 签名 看完文档你会发现整个过程涉及到了**3**次签名 这里给出想应的文档和工具

- [签名算法](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=4_3)
- [微信支付接口签名校验工具](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=20_1)

一定要仔细根据签名算法的步骤 注意签名的小写 和一些排序要求  根据这个算法 这里给出具体的签名算法

```php?start_inline=1
/**
 * 获取参数签名；
 * @param  Array  要传递的参数数组
 * @return String 通过计算得到的签名
 */
private function getSign($params) {
    ksort($params);        //将参数数组按照参数名ASCII码从小到大排序
    foreach ($params as $key => $item) {
        if (!empty($item)) {         //剔除参数值为空的参数
            $newArr[] = $key.'='.$item;     // 整合新的参数数组
        }
    }
    $stringA = implode("&", $newArr);         //使用 & 符号连接参数
    $stringSignTemp = $stringA."&key=".$this->key;        //拼接key
                                         // key是在商户平台API安全里自己设置的
    $stringSignTemp = MD5($stringSignTemp);       //将字符串进行MD5加密
    $sign = strtoupper($stringSignTemp);      //将所有字符转换为大写
    return $sign;
}
```
统一下单的所需要的数据都准备好了 接下来就是发起我们的请求了

当然因为与微信的数据请求包括返回都是`xml`格式的  所以我们需要去包装成`xml`格式
```php?start_inline=1
private function setSendData($data) {
    $this->sTpl = "<xml>
                        <appid><![CDATA[%s]]></appid>
                        <body><![CDATA[%s]]></body>
                        <mch_id><![CDATA[%s]]></mch_id>
                        <nonce_str><![CDATA[%s]]></nonce_str>
                        <notify_url><![CDATA[%s]]></notify_url>
                        <out_trade_no><![CDATA[%s]]></out_trade_no>
                        <spbill_create_ip><![CDATA[%s]]></spbill_create_ip>
                        <total_fee><![CDATA[%d]]></total_fee>
                        <trade_type><![CDATA[%s]]></trade_type>
                        <sign><![CDATA[%s]]></sign>
                    </xml>";                          //xml数据模板

    $nonce_str = $this->getNonceStr();        //调用随机字符串生成方法获取随机字符串

    $data['appid'] = $this->appid;
    $data['mch_id'] = $this->mch_id;
    $data['nonce_str'] = $nonce_str;
    $data['notify_url'] = $this->notify_url;
    $data['trade_type'] = $this->trade_type;      //将参与签名的数据保存到数组
    // 注意：以上几个参数是追加到$data中的，$data中应该同时包含开发文档中要求必填的剔除sign以外的所有数据
    $sign = $this->getSign($data);        //获取签名

    $data = sprintf($this->sTpl, $this->appid, $data['body'], $this->mch_id, $nonce_str, $this->notify_url, $data['out_trade_no'], $data['spbill_create_ip'], $data['total_fee'], $this->trade_type, $sign);
    //生成xml数据格式
    return $data;
}
```

> `xml`数据要使用`<![CDATA[]]>`注释包裹


## 相关文档

- GitHub地址  [PayApi](https://github.com/GeekGhc/PayApi)
- 微信开发文档 [开发者文档](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=8_1)
- 简书 [开发微信接口](http://www.jianshu.com/p/a5ddd19e01a3?utm_campaign=hugo)



