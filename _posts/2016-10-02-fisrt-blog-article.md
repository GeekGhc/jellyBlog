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
poster: /attachments/images/articles/2016-10-02/poster.png
---

## 开启jekyll之路
博客网站很多 例如由`node-js开发的`[Hexo](https://hexo.io/) 还有就是很多人都熟悉的[WordPress](https://wordpress.org/)

在这里我还是选择了由`Ruby开发的`[jekyll](http://jekyllcn.com/)

> 其实这几个个都是不错的博客构建平台 孰好孰坏每个人的看法也不一样 适合自己目前的需求就是最好的

我们能想到的是静态网站的优势还是很符合个人开发者的 :yum:
- 没有数据库 这样就省去了相应的维护成本
- 纯静态网站 响应实际快
- 这些服务的本意就是使用者只需要关注博客本身 而不用去关注其他的

> 如果非得注重用户体验 可以去开发一个单页面的个人博客 那样的用户体验也是非常不错的
>
> 这里我主要是个人爱好以及想记录一点学习点滴 日后自己工作了有时间自己还是想再规范下自己的个人博客吧


> 可以想象得到的是只需要写完一篇如`markdown`或(Textile)的博客文章 `git`提交后就可以发布

官方网址[http://jekyllcn.com](http://jekyllcn.com/) 详细介绍自行查看

![jekyll](/attachments/images/articles/2016-10-02/start.png)

网站托管在[GithubPages](https://pages.github.com/)

## 安装gem
- 首先当然是安装 `gem`
- 接着安装`jekyll` 终端执行`gem install jekyll`这样`gem`的依赖包都会被安装
- 使用jekyll生成博客项目

```shell
$ jekyll new my-awesome-site
```

接下来的工作可参考[jekyll官方文档](http://jekyllcn.com/docs/home/)(对照着文档看起来其实还是很容易上手的)
