---
layout: post
title: Linux MySQL定时备份并上传到git仓库
description: 在Linux执行定时任务 很多都已经很熟悉 那么在我们可能部署一个小的项目时 对于mysql的数据
            我们会需要定时备份 这就需要我们的定时任务
tags:
     Linux
     Mysql
     Crontab
     Git
class: post-two
comments: true
poster: /attachments/images/articles/2017-07-18/poster.jpg
---

## 简介
我们在部署我们的中小型项目时 在数据存储 我们通常选择`mysql`作为我们的存储工具 那么对于一个大的项目来说

每天的数据量是十分大的  对于每天产生的数据 如果哪一天我们的网站或者服务器受到攻击 我们的数据丢失是个很爆炸的事情

所以说自然这设计到数据库的备份 那么怎样的备份是我们想要的呢 

对于备份的数据文件我们可能会存放在服务器目录 备份周期的话当然是按照数据量来说的 这里我们一般都是每天的凌晨备份一次

备份后的文件存放在我们的服务器的目录下面 但是万一有一天服务器也崩溃了 那么备份的文件也就没了

所以我们设想一个好的方案就是数据库每天备份 每次备份自动提交到远程仓库  这里我以码云为例

## 码云
首先建立好远程仓库 在这里我选择了[码云](http://git.oschina.net/)

新建一个私有仓库  当然为了每次可以免密码提交文件 在服务器里可以生成`ssh key` 具体的可以看我的以前的一篇[博客](http://jellybook.me/articles/2017/01/ssh-login-server-without-password)

## 服务器新建备份

在服务器为了存储备份后的文件 新建一个备份目录
```shell
$ mkdir /bak
```
进入该目录后 继续新建两个文件夹 `mysqlBak`和`shDir` 一个是放脚本文件 一个是放具体备份后的文件

下面我们可以去新建脚本了  进入`shDir`目录后 执行
```shell
$ vim mysqlBak.sh
```
具体的代码如下:
```php?start_inline=1
#!bin/sh
###################数据库配置信息#######################
createAt=`date +%Y-%m-%d-%H:%M:%S`
user=root
passwd=ghc1996
dbname=ispace
mysql_back_path=/bak/mysqlBak
###################执行命令#######################
mysqldump -u $user -p$passwd $dbname > $mysql_back_path/$createAt.sql
cd /bak/mysqlBak
/usr/local/git/bin/git add .
/usr/local/git/bin/git commit -m $createAt
/usr/local/git/bin/git push
```

这里只是一个简单的脚本 我想了解`linux`的很容易看的懂 执行的就是备份数据库并`push`到远程仓库

那么既然是脚本  我们需要指明什么时候执行这个脚本  指定脚本执行
```shell
$ crontab -e
```
我们希望是每天的凌晨执行一次备份 并添加到远程仓库 那么添加
```shell
$ 0 0 * * * /bin/sh /bak/shDir/mysqlbak.sh
```
对`linux`的`crontab`指定的时间只有**五**个部分

| 段位 | 时间 |
| ------ | ------ |
| 第一段 | 代表分钟 0—59 |
| 第二段 | 代表小时 0—23 |
| 第三段 | 代表日期 1—31 |
| 第四段 | 代表月份 1—12 |
| 第五段 | 代表星期几，0代表星期日 0—6 |

使用命令 `crontab -e` 然后直接编辑定时脚本。 时间 +具体的名字

举个列子来说就是
```shell
0 0,3,7,9,12,15,18,21,23 * * * /bin/sh /bak/shell/mysqlBak.sh
```
这样的话就是我每天**0,,3,7,9,12,15,18,21,23**点时会去执行这个脚本文件 那么这就实现了基本的数据库的备份

执行定时任务
```shell
$ crontab -l
```
如果服务没有启动 那么重新启动定时任务
```shell
$ systemctl restart crond
```
那么现在这个定时任务就已经启动了 对于提交远程仓库前提是在服务器生成ssh key并添加到码云 这在上面也提到过

对于需要提交文件的目录初始化`git`目录就可以了 这样局可以构成了我们需要的本分任务 

当然过程中可能会遇到一些问题  我在下面的相关链接都已经罗列出来了 

这样一来我们就可以实现了每天的凌晨备份我们的数据库 并同时提交到我们的码云这个远程仓库  这也是我们想要的效果

> 我也说过备份的周期视我们的项目的数据量的大小而定

对于每个框架都有自己的备份机制  我这里所写的是我们自己实现的一个通用的备份机制

## 相关链接
- [crontab验证](https://crontab.guru/)
- [oschina码云GIT免登陆用](http://fenxiang.banguanshui.com/content/oschina%E7%A0%81%E4%BA%91git%E5%85%8D%E7%99%BB%E9%99%86%E4%BD%BF%E7%94%A8)
- [码云平台帮助文档](http://git.mydoc.io/?t=154712)
- [CentOS下使用crontab命令来定时执行任务](http://blog.csdn.net/shenlingsuifeng/article/details/50888061)
- [CentOS Linux下每天自动备份MySQL数据库](http://www.linuxidc.com/Linux/2016-01/127976.htm)