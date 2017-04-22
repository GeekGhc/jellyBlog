---
layout: post
title: ssh 免密码登录服务器
description: 对于我们程序员来说 GitHub再熟悉不过了 在平常的工作项目中 对于项目的提交我们不可能每次都需要填写一次密码
             都当然也包括登录自己的服务器 所以我们可以使用ssh生成密钥 这样就可以省去这样的步骤
tags:
     SSH
     Server
     Github
class: post-one
comments: true
poster: /attachments/images/articles/2017-01-22/poster.jpg
---

## 介绍
对于我们程序员来说 `GitHub`再熟悉不过了 在平常的工作项目中 对于项目的提交我们不可能每次都需要填写一次密码

这当然也包括登录自己的服务器 所以我们可以使用`ssh`生成本地的密钥  只需要向服务器或者`Github`给出我们的密钥

这样就可以不用每次都去填写密码

## 服务器的登录

在本地的目录终端执行
```shell
$ ssh-keygen -t rsa  
```

由于我之前已经生成过 你如果是第一次的话一直`enter`下去  这里指定的加密算法是**rsa**   

之后还会有一些保存私钥的路径和密码(可以为空) 最后就是生成了公钥

如果你是`Mac`环境的话执行
```shell
$ cd ~/.ssh
```
就可以看到你刚刚生成的私钥 

当然如果你是`Windows`环境下的话还是进入(也就是管理员的目录下)
```shell
$ cd ~/.ssh
```
而我们需要拿到的是`id_rsa.pub`这个公钥里面的内容

如果是服务器的话 我们需要将这个文件也放到服务器下的`.ssh`目录里:
```shell
$ scp id-rsa.pub root@domain.com:~/.ssh/id_rsa.pub
```

> 如果服务器没有`.ssh`这个目录 创建一个即可

之前已经将`id_rsa.pub`文件放到服务器的目录下了 填写服务器的密码即可  我们再次登录服务器

我们进入到`.ssh`这个目录
```shell
$ cd ~/.ssh
```
接下来我们将这个文件保存到`authorized_keys`
```shell
$ cat id_rsa.pub >> authorized_keys
```

这个时候退出服务器再次登录 OK 完美的登录了

## Github 密钥部署

在本地的目录终端执行
```shell
$ ssh-keygen -t rsa -C "youremail@example.com"
```
填写好你`Github`邮箱 如果你比较熟悉git的话之前肯定配置过`git`直接下一步

这样的话我们就可以在`~/.ssh`下有两个文件

`id_rsa`和`id_rsa.pub`两个文件，这两个就是`SSH Key`的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。

这个和之前服务器是差不多的 我们需要的就是`id_rsa.pub`这个公钥

我们登录`Github` 打开`Account settings` >> `SSH Keys`页面
          
然后，点`Add SSH Key`，填上任意`Title`，在`Key`文本框里粘贴`id_rsa.pub`文件的内容

为什么`GitHub`需要`SSH Key`呢？因为`GitHub`需要识别出你推送的提交确实是你推送的，而不是别人的，而`Git`又支持`SSH`协议

所以，`GitHub`只要知道了你的公钥，就可以确认只有你自己才能推送

下面的话我们在`Github`新建仓库之后 只需要根据提示添加相关的仓库 接着执行
```shell
$ git push -u origin master
```

以后我们再去推送代码时只需要执行
```php
$ git push 
```
这样是不是很方便 :smile:
