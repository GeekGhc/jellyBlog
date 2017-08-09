---
layout: post
title: Redis在Laravel中初识
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

当然在开始使用在前 在你的环境先下载好`Redis`  如果是`windows`文章下面有安装教程链接  如果是`Mac`或者`Linux`则可以按照官网上安装

当然为了可视化更好的管理`Redis`数据的话  这里推荐一个工具就是 [Redis 可视化管理工具](https://redisdesktop.com/download)

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

新建一个方法 以一个简单的实例测试下
```php?start_inline=1
public function setInfo()
{
    Redis::set("name", "GeekGhc");

    dd(Redis::get("name"));
}
```
当然在我们的`Redis Desktop Manager`打开可以查看到对应的数据信息

![1](/attachments/images/articles/2017-06-02/1.png)

还有就是我们可以将`command`传递至服务器 它接收命令的名称作为第一个参数，第二个参数则为值的数组：
```php?start_inline=1
$values = Redis::command('lrange', ['name', 5, 10]);
```

当然还有一些其他的`Redis`的命令用户 在官方文档上都有介绍 包括我们的订阅和发布

## 通过Cache Facade
当然对于`Redis`或者`Memcached`这些缓存方式 我们可以使用`Cache`这个`Facade`来管理

比如对于同样的`Redis`缓存的基本操作 `Cache Facade`提供了方便而又简洁的方法访问缓存实例

例如对于同样的基本的值的存取 我们可以这样写:
```php?start_inline=1
public function setInfo()
{
    Cache::Store("redis")->put("name","gavin",1);

    dd(Cache::store('redis')->get("name","def"));
}
```

当然还有一些获取更新 删除 永久写入这些操作在文档中写的很详细  这里不再多说

值得一提的是 当我们需要全部清空这里的缓存时  提供给我们的方法是：
```php?start_inline=1
Cache::flush();
```

还有一个我们经常用到的就是获取更新 文档上给出的一个事例就是当我们需要从缓存取出所有用户  而当缓存中并没有时  则从数据库中

读取并加入缓存 这样的情景的话我们可以使用一个`remember`方法(这在之后我们也会用到)
```php?start_inline=1
$value = Cache::remember('users', $minutes, function () {
    return DB::table('users')->get();
});
```

我们需要了解的也就是这些  当然还有一些增加缓存驱动  我们得结合具体的应用场景再说



## 相关链接
- [windows 下redis安装](http://www.jianshu.com/p/e16d23e358c0)
- [Redis-Laravel文档](http://d.laravel-china.org/docs/5.3/redis#configuration)
- [Redis 可视化管理工具](https://redisdesktop.com/download)
- [Redis 命令](https://redis.io/commands)