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
`homestead`作为`PHP`开发的可共享的集成虚拟环境 官方默认提供的`mysql`为**5.7**版本  PHP的版本包含了**5.6** **7.0** **7.1** **7.2**还有一些诸如`redis` `memcache`
这样的缓存数据库  其实这足以应对大部分的开发环境要求 对于`mysql`有时我们需要更新或者更低版本的数据库时  但是又不想摒弃现有的版本 那么我们完全可以借助`docker`建立对应的`mysql`容器

## 安装 
我们这里以安装`mysql5.6`为例

对于现有的`homestead`即`Ubuntu`的环境  我们需要先下载`docker` 先更新下源
```shell
$ sudo apt-get update
```
下载对应的`docker`
```shell
$ sudo apt-get install docker.io
```
下载完成之后启动服务
```shell
$ sudo service docker start
```
由于种种原因 对于官方库拉取`image`我们需要镜像加速 更改`/etc/docker/daemon.json`来配置(没有则新建)
```shell
{
  "registry-mirrors": ["http://hub-mirror.c.163.com"]
}
```
接下来就是验证`docker` 以经典的`hello world`为例
![1](/attachments/images/articles/2018-05-12/1.png)

>如果出现这样的界面即为成功

因为已经拉取这个`image` 我们可以查看一下现有的`image` 对于`docker`的基础知识可以查看阮一峰的[博客](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)

![2](/attachments/images/articles/2018-05-12/2.png)

接下来就是拉取`mysql5.6`的官方`library`
![3](/attachments/images/articles/2018-05-12/3.png)

拉取完成之后再次查看`image`列表
![4](/attachments/images/articles/2018-05-12/4.png)

接下来新建`/docker/mysql5.6`目录以配置一些`mysql`下面会用到的映射目录
拉取完成之后再次查看`image`列表
![5](/attachments/images/articles/2018-05-12/5.png)

接下里在`/docker/mysql5.6`目录下启动`mysql`容器
```shell
$ sudo docker run -p 33061:3306 --name mysql1 -v $PWD/conf:/etc/mysql -v $PWD/logs:/logs -v $PWD/data:/mysql_data -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.6
```

这里也是在启动的时候为数据库设置了密码为**123456** 

`-p` 指明`mysql`容器的**3306**端口映射到本地的**33061**端口

`--name` 指明启动后的`container`的别名  这样我们可以很方便的操作

`-v` 表明本地和容器的目录映射

![6](/attachments/images/articles/2018-05-12/6.png)

启动`mysql`容器 这里我们可以通过别名启动
```shell
$ sudo docker start mysql1
```

进入`mysql`的`bash`即终端
```shell
$ docker exec -it mysql1 env LANG=C.UTF-8 bash
```

> 其中 env LANG=C.UTF-8 bash 让docker命令行支持中文

复制配置文件
```shell
$ cp /usr/my.cnf /etc/mysql/my.cnf
```
由于之前我们在`/docker/mysql5.6`新建了三个目录并进行了映射 如需要修改编码 这时退出容器`bash`可在本地修改即可
```shell
$ vim conf/my.cnf
```
主要是在my.cnf添加了字符编码  修改完保存即可
```shell
$ [client] default-character-set=utf8 
[mysql] default-character-set=utf8 
[mysqld] character-set-server=utf8
```

再次进入`mysql`的`bash` 这次先登录`mysql`
```shell
$ mysql -u root -p
```

密码就是启动容易时设定的**123456** 进入成功之后修改下时远程客户端可以连接这个`mysql`
```shell
$ grant all privileges on rise.* to root@'%' identified by '123456';
```

```shell
$ flush privileges;
```

即远程客户端可以使用`root`作为用户名 密码使用**123456**进行登录  至此我们的`mysql`容器安装完毕 

我们知道本地连接`homestead`的`mysql`是通过**33060**端口进行连接  那么如果想连接`homestead`中的`mysql`容器那么可以再次进行端口映射

具体操作就是修改`Homestead.yaml` 增加端口从本地到`homestead`即可
```shell
ports:
    - send: 33062
      to: 33061
```
这样本地 可以使用用户名为`root` 密码为**123456** 端口这时改为**33062**即可连接`homestead`的`mysql`容器

## 相关链接
- [Docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)