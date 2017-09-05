---
layout: post
title: LaraDocker 在Docker中轻松运行你的laravel项目
description: 除了Homestead 我们是不是可以考虑将我们的laravel应用运行在Docker. LaraDocker无疑是一个不错的解决方案
tags:
     docker
     laravel
class: post-six
comments: true
poster: /attachments/images/articles/2017-08-24/poster.jpg
---

## 什么是Docker
`Docker`是一个开源的引擎，可以轻松的为任何应用创建一个轻量级的、可移植的、自给自足的容器。

开发者在笔记本上编译测试通过的容器可以批量地在生产环境中部署，包括`VMs`（虚拟机）、`bare` `metal`、`OpenStack` 集群和其他的基础应用平台。

## Docker vs Vagrant
从时间上来看，`Vagrant`启动虚拟机需要数分钟，而`Docker`只需数秒；从体量上来看，`Vagrant`提供的是完整的虚拟机，而`Docker`提供的是轻量级的虚拟容器，

这些虚拟容器共享同一个内核并且允许在独立进程中运行；此外，从应用范围来说，`Vagrant`只能用于开发环境，而`Docker`即可用于开发环境也可用于生产环境。

如果是在`Linux`可以查看这个文章[使用 docker 部署你的 Laravel 项目](https://laravel-china.org/topics/3319/deploy-your-laravel-project-using-docker)

## Docker 优势
比起`Homestead`、`Vagrant`，`Docker`的优势是轻量级，可以轻松的为任何应用创建一个轻量级的、可移植的、自给自足的容器

## 安装准备
在进行开发环境的搭建之前(`laravel`环境已经安装完毕) 我们需要准备下面几个
- [composer](https://getcomposer.org/download/)
- [git](https://git-scm.com/downloads)
- [docker toolbox](https://www.docker.com/toolbox)
- [virtual box](https://www.virtualbox.org/)


我们可以使用以下命令创建一个`Docker`虚拟机
```shell
$ docker-machine create --driver=virtualbox default
```
这样的话我们在`virtual box`就会新建一个虚拟机
![1](/attachments/images/articles/2017-08-24/1.png)

我们可以去查看`Docker IP`的地址
![2](/attachments/images/articles/2017-08-24/2.png)

在`hosts`文件里映射我们的`ip`地址
```shell
192.168.99.100 laravel.dev
``` 

接下来就是安装`LaraDock`

如果系统尚未安装`Laravel`应用，需要从头开始搭建全新的环境，可以在系统任意位置克隆`Github`仓库到本地：
```shell
$ git clone https://github.com/LaraDock/laradock.git
```

这里我已经安装好了一个`laravel`项目  那么我在这个项目的根目录下下载就好

在项目的根目录 之前已经安装好了`Laradock` 进入该目录执行(和`laravel`项目一样)
```shell
$ cp env-example .env
```

因为之前我们已经将`ip`做了映射 所以别忘了在`laravel`的`.env`文件中修改相应的配置
```php?start_inline=1
DB_HOST=laravel.dev
REDIS_HOST=laravel.dev
```

最后运行容器
```shell
$ docker-compose up -d nginx mysql
```
当然该容器里也包含了其他的应用服务 如(你可以选择性的启动他们)
```html
nginx, hhvm, php-fpm, mysql, redis, postgres, mariadb, neo4j, mongo, apache2, caddy, memcached, beanstalkd, beanstalkd-console, workspace
```
> `workspace` 和 `php-fpm` 将运行在大部分实例中, 所以不需要在 `up` 命令中加上它们

启动之后，进入`workspace`容器，执行`Laravel`安装及`Artisan`命令等操作：
```shell
$ docker-compose exec —user=laradock workspace bash
```
这时候可能出现问题：
```shell
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe9 in position 0: ordinal not in range(128)
```

解决办法就是 修改`mimetypes.py`文件，路径位于`python`的安装路径下的`Lib\mimetypes.py`文件。在`import`下添加如下几行:
```php?start_inline=1
if sys.getdefaultencoding() != 'gbk': 
   reload(sys) 
   sys.setdefaultencoding('gbk')
```

去访问`http://laravel.dev`应该就可以访问得到首页了
## 相关链接
- [docker-toolbox](https://www.docker.com/products/docker-toolbox)
- [使用 docker 部署你的 Laravel 项目](https://laravel-china.org/topics/3319/deploy-your-laravel-project-using-docker)
- [Mac laraDocker环境开发部署](http://www.hsuchihyung.cn/2016/05/28/li-yong-laradockqing-song-gou-jian-laravelying-yong/)
- [docker-compose.yml详解](http://www.jianshu.com/p/50cdae5c8d12)