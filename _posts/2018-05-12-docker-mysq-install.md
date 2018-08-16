---
layout: post
title: HomeStead通过docker配置mysql容器
description: 官方homestead提供的mysql默认是5.7版本  那么如果我们需要其他版本的mysql我们可以在此基础之上新建mysql容器进行开发
tags:
     docker
     mysql
     homestead
class: post-two
comments: true
poster: /attachments/images/articles/2018-05-12/poster.jpeg
---
## 简介
homestead作为PHP开发的可共享的集成虚拟环境 官方默认提供的mysql为5.7版本  PHP的版本包含了5.6 7.0 7.1 7.2还有一些诸如redis memcache
这样的缓存数据库  其实这足以应对大部分的开发环境要求 对于mysql有时我们需要更新或者更低版本的数据库时  但是又不想摒弃现有的版本 那么我们完全可以借助docker建立对应的mysql容器

## 安装 
我们这里以安装mysql5.6为例

对于现有的homestead即Ubuntu的环境  我们需要先下载docker 先更新下源
```shell
$ sudo apt-get update
```
下载对应的docker
```shell
$ sudo apt-get install docker.io
```
下载完成之后启动服务
```shell
$ sudo service docker start
```
由于种种原因 对于官方库拉取image我们需要镜像加速 更改/etc/docker/daemon.json来配置(没有则新建)
```shell
{
  "registry-mirrors": ["http://hub-mirror.c.163.com"]
}
```
接下来就是验证docker 以经典的hello world为例
![1](/attachments/images/articles/2018-05-12/1.png)

>如果出现这样的界面即为成功

因为已经拉取这个image 我们可以查看一下现有的image 对于docker的基础知识可以查看阮一峰的[博客](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)

![2](/attachments/images/articles/2018-05-12/2.png)

接下来就是拉取mysql5.6的官方library
![3](/attachments/images/articles/2018-05-12/3.png)

拉取完成之后再次查看image列表
![4](/attachments/images/articles/2018-05-12/4.png)

接下来新建/docker/mysql5.6目录以配置一些mysql下面会用到的映射目录
拉取完成之后再次查看image列表
![5](/attachments/images/articles/2018-05-12/5.png)

接下里在/docker/mysql5.6目录下启动mysql容器
```shell
$ sudo docker run -p 33061:3306 --name mysql1 -v $PWD/conf:/etc/mysql -v $PWD/logs:/logs -v $PWD/data:/mysql_data -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.6
```

这里也是在启动的时候为数据库设置了密码为123456 

-p 指明mysql容器的3306端口映射到本地的33061端口

--name 指明启动后的container的别名  这样我们可以很方便的操作

-v 表明本地和容器的目录映射


## 相关链接
- [Docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)