---
layout: post
title: GitLab [Webhooks] 实现自动化服务器部署
description: 利用的GitLab创建私人仓库 通过钩子实现代码推送时能同步到服务器 这样也就实现了自动化的部署
tags:
     github
     deployment
     server
class: post-four
comments: true
poster: /attachments/images/articles/2017-08-08/poster.jpg
---

## 简介

我们在部署我们的`web`应用时 我们一般会寻求一些云平台服务器部署 当然也可以直接在服务器里拉取远程仓库的代码

当然我们也可以实现通过`Webhooks`(钩子)来实现服务器与远程仓库代码的同步

这样一来我们在本地提交功能分支到仓库中  仓库也会同步到服务器  这样我们就无需自己手动去同步项目代码

## 选择
我们的项目大都托管在`Github`  当然`Github`在建立私有仓库时是需要付费的 那么在自己的网站部署时 我们完全可以选择其他的平台

目前来说我们需要试下`Webhooks`自动化部署  那么我们可以选择自己合适的平台 这里我选择[GitLab](https://gitlab.com/)

当然国内的话还可以选择 [Coding](https://coding.net)  和  [码云](http://git.oschina.net)

这些在国内都是不错的代码托管平台 你都可以创建自己的私有项目仓库

之前我的网站项目是托管在`Coding`  但是近期我重写我的网站项目  因为`GitLab`本身可以建立自己的私有仓库并且没有限制

同样的也可以设置成员的权限 分支的工作流也十分清晰强大 现在很多的公司也都选择了`GitLab` `so` 我还是会去尝试一下新的服务

## 前期准备
和`Github`一样  我们都要去生成一个`ssh key`这样我们以后在提交项目和项目分支时就可以免去身份验证

在本地终端执行
```shell
$ ssh-keygen -t rsa -C "youremail@example.com"
```
这里填写你`GitLLab`注册的邮箱即可(最好保持一致)

你可以一直默认下去 当然为了和之前的发生冲突 你可以自己在生成的时候重新命名

我这里生成的是`gitlab_rsa`和`gitlab_rsa.pub`

接着在命令行执行(添加刚生成的公钥和私钥)
```shell
eval $(ssh-agent -s)
ssh-add ~/.ssh/gitlab_rsa
```
查看我们的公钥内容
```shell
cat ~/.ssh/gitlab_rsa.pub
```
拿到我们的公钥内容 我们就可以去`GitLab`添加我们的`sh key`

![1](/attachments/images/articles/2017-08-08/1.png)

添加完毕之后当然是测试本地连接
```shell
$ ssh -T git@gitlab.com
```
如果没有问题的话 会回馈给我们正确的欢迎信息

> 具体的生成信息可以看官方的 [ssh文档](https://gitlab.com/help/ssh/README)




## 相关链接
- [GitLab 官网](https://gitlab.com/)
- [Coding 官网](https://coding.net)
- [码云 官网](http://git.oschina.net)
- [GitLab key生成](https://gitlab.com/help/ssh/README)

