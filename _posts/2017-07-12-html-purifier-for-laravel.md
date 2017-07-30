---
layout: post
title: HTMLPurifier解决Laravel5的XSS跨站脚本攻击安全问题
description: Web安全问题越来越受到人们的注意 对于XXS是对于站点的用户隐私的攻击 这对于用户安全造成很大的隐患
             就目前来说HTMLPurifier是目前最好的PHP富文本HTML过滤器
tags:
     HTMLPurifier
     XXS
     Laravel
class: post-one
comments: true
poster: /attachments/images/articles/2017-07-12/poster.jpg
---

XXS 也成为跨站脚本攻击 这也是常见的Web攻击 同时XXS涉及三个群体:黑客 客户端 Web站点。就目前来说解决

php中XXS攻击的方法就是使用HTML Purifier  基于他支持自定义过滤规则 可以把不标准的HTML转换为标准的HTML

> 同时我们也要相信一点的就是没有绝对的安全 所以我们也只能尽量的去过滤一些不必要的安全隐患

对于他的自定义规则就是对HTML的标签和属性的的过滤 利用**白名单机制**  在执行clean()方法后 对于不在白名单的
元素则会被过滤




## 相关链接
- [跨站点脚本攻击深入解析](https://www.ibm.com/developerworks/cn/rational/08/0325_segal/)
- [Laravel-China 使用 HTMLPurifier来解决Laravel5中的 XSS 跨站脚本攻击安全问题](https://laravel-china.org/articles/4798/the-use-of-htmlpurifier-to-solve-the-xss-xss-attacks-of-security-problems-in-laravel)