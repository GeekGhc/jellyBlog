---
layout: post
title: PHP中的正则表达式
description: 最近遇到公司的一个emoji表情替换的应用场景 于是我立马想到了这样的一个需求就可以用正则表达式来
                解决 只需要把相应的表情文本替换成表情的地址即可
tags:
     PHP
     正则表达式
     Emoji
class: post-six
comments: true
poster: /attachments/images/articles/2017-06-24/poster.jpg
---

## 简介

最近公司需要App端的网页端的页面分享 在书籍的评论区处 会有遇到Emoji表情的解析  当然这在移动端都是以图片的形式存储的

所以在网页端 自然我也需要对评论的内容找那个涉及到评论图片的地方进行解析 当然我的第一反应就是利用正则表达式去解析到

对应的表情代码 然后再去解析成图片的地址

