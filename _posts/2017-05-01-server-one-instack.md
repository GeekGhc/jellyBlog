---
layout: post
title: oneinstack 集成部署服务器环境
description: 在选择服务器的集成环境的安装时  为了省去管理和版本的问题  这里推荐使用这样的一个集成环境安装
tags:
     server
     deploy
class: post-five
comments: true
poster: /attachments/images/articles/2017-05-01/poster.jpg
---

## 前期准备

之前我有篇文章就是说如果部署我们的LAMP环境 同时也介绍到别人推荐给我的一个集成环境[oneinstack](https://oneinstack.com/)

然后发现周边同学在安装过程中多多少少还是会有些问题  这篇博客来简要说些基本的流程

当然首先是你得有你的服务器  现在我想大都数学生党还是会选择阿里云 当然腾讯云等现在也都有学生机包括[UCloud](https://oneinstack.com/)都有优惠

自然配置你就别希望会有多好了  当然能做学习使用就够了  当然我还是会选择一些国外的一些服务提供商

如[Vultr](https://www.vultr.com/)

好了 购买完服务器的话 服务器的系统这里以Centos7.2为例  我自己的网站的服务器基本都是Centos  当然你也可以用Ubuntu

初始化过系统环境  设置了服务器的登录密码本地登录
```shell
$ ssh root@yourIp
```

为了每次登录服务器免去输入密码 可以参考下面我之前的文章

> [ssh 免密码登录服务器](http://jellybook.me/articles/2017/01/ssh-login-server-without-password)

如果你的服务器带有数据盘 请先挂载数据盘 具体可以看这篇文章[阿里云CentOS配置全过程](http://www.mayanpeng.cn/?p=507)

## 集成安装
我们已经登录到服务器后开始我们的集成环境的安装 

oneinstack支持几种组合  
- lnmp（Linux + Nginx+ MySQL+ PHP）
- lamp（Linux + Apache+ MySQL+ PHP）
- nmpa（Linux + Nginx+ MySQL+ PHP+ Apache）：Nginx处理静态，Apache（mod_php）处理动态PHP
- nmt（Linux + Nginx+ MySQL+ Tomcat）：Nginx处理静态，Tomcat（JDK）处理JAVA
- lnmh（Linux + Nginx+ MySQL+ HHVM）

因此无论你是Java开发者还是PHP开发者都可以满足你的需求

官网上还有一些其他的特性 这些自行查看即可

下面会需要一些命令服务 所以可以提前下载下
```shell
$ yum -y install wget screen curl python 
```

下载的话选择阿里云的内网线路
```shell
$ wget http://aliyun-oss.linuxeye.com/oneinstack-full.tar.gz
```

解压下载的安装包
```shell
$ tar xzf oneinstack-full.tar.gz
```

进入解压文件目录
```shell
$ cd oneinstack   #如果需要修改目录(安装、数据存储、Nginx日志)，请修改options.conf文件
```

在终端执行
```shell
$ screen -S oneinstack #如果网路出现中断，可以执行命令`screen -R oneinstack`重新连接安装窗口
```

最后就是我们的安装命令
```shell
$ ./install.sh
```

下面的安装步骤跟着网站的教程来就可以了 很方便

当然这里还提供了添加组件和我们最注重的备份数据和更新组件

如果有问题欢迎及时提出

## 相关链接
- [oneinstack](https://oneinstack.com/)
- [UCloud](https://oneinstack.com/)
- [Vultr](https://www.vultr.com/)
