---
layout: post
title: 第一篇博客 | jekyll
description: 借助jekyll生成静态网站 网站托管在GithubPage上 博客域名(http://jellybook.me)
tags:
     jekyll
     github
     blog
class: post-one
comments: true
poster: /attachments/images/articles/2016-12-06/poster.png
---

## 开启jekyll之路
博客网站很多 例如由`node-js开发的`[Hexo](https://hexo.io/) 在这里我还是选择了由`Ruby开发的`[jekyll](http://jekyllcn.com/) 

> 其实两个都是不错的博客构建平台 孰好孰坏每个人的看法也不一样 适合自己的而需求就是最好的

我们能想到的是静态网站的优势还是很符合个人开发者的 :yum:
- 没有数据库 这样就省去了相应的维护成本
- 纯静态网站 响应实际快
- 这些服务的本意就是使用者只需要关注博客本身 而不用去关注其他的


> 可以想象得到的是只需要写完一篇如markdown或(Textile)的博客文章 git提交后就可以发布

官方网址[http://jekyllcn.com](http://jekyllcn.com/) 详细介绍自行查看

![jekyll](/attachments/images/articles/2016-12-06/start.png)

网站托管在[GithubPages](https://pages.github.com/)

## 安装gem
- 首先当然是安装 `gem` 
- 接着安装`jekyll` 终端执行`gem install jekyll`这样`gem`的依赖包都会被安装
- 使用jekyll生成博客项目
```
jekyll new my-awesome-site
```

接下来的工作可参考[jekyll官方文档](http://jekyllcn.com/docs/home/    )(使用起来还是很方便快捷的)
