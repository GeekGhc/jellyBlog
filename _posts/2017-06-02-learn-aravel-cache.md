---
layout: post
title: Redis,Memcache在Laravel中应用
description: 对于缓存系统 如今网站基本都集成了非常不错的缓存驱动 如Redis和Memcached 今天来简单谈谈在Laravel中是
            这些缓存技术
tags:
     Laravel 
     Cache
     Redis
     Memcached
class: post-six
comments: true
poster: /attachments/images/articles/2017-06-02/poster.jpg
---

## 简介
`Redis` 是一款开源且先进的键值对数据库。由于它可用的键包含了字符串、哈希、列表、集合 和 有序集合，因此常被称作数据结构服务器。

在使用 `Redis` 之前，你必须通过 `Composer` 安装 `predis/predis` 扩展包`（~1.0）`
```shell
$ composer require predis/predis
```

如果你需要一些可视化的`Redis`管理工具 [Redis Desktop Manager](https://redisdesktop.com/download)不失为一种很好的选择
## 配置
有关缓存的配置都是在`config/cache.php`里面  而对于缓存存储的则是在`config/database.php`

在`config/database.php`里 可以看到关于`Redis`的相关配置

```php?start_inline=1
'redis' => [

    'client' => 'predis',

    'default' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD', null),
        'port' => env('REDIS_PORT', 6379),
        'database' => 0,
    ],

],
```

> 这些默认的配置对于我们开发来说已经足够了

当然除了这几个配置 `PRedis` 也可以为其配置其他参数 只需增加相应的配置参数即可
```php?start_inline=1
'read_write_timeout' => 60,
```
则是定义读取超时的时间

## 开始使用
就像我们平常使用`Redis`一样 我们在`PRedis`也会有一系列的`set/get`方法  在这里我们可以使用`Redis`这个`facade`

话不多说  为了更好的说明  我们可以去创建一个控制器
```php?start_inline=1
$ php artisan make:controller RedisController
```

新建一个方法 




## 相关链接
- [Redis-Laravel文档](http://d.laravel-china.org/docs/5.3/redis#configuration)
- [Redis 可视化管理工具](https://redisdesktop.com/download)
- [Redis 命令](https://redis.io/commands)