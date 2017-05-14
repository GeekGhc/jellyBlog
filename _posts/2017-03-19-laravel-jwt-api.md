---
layout: post
title: Laravel API结合Dingo API和JWT
description: 在Web开发，Api开发是一项非常重要的技术，这里就以Laravel项目实例来开发API 熟悉下API的具体的流程
tags:
     Laravel
     API
     JWT
     Dingo
class: post-seven
comments: true
poster: /attachments/images/articles/2017-03-19/poster.jpg
---

## 介绍
关于`API`的开发 不得不提的就是可以利用`Dingo`来构建更加强大的`API` 这样我们可以更好的去实现`API`认证和请求

## 安装
首先当然是去[安装页面](https://github.com/dingo/api/wiki/Installation) 根据提供的包进行下载 在`laravel`项目中就是`require`这个`package`
```php?start_inline=1
"dingo/api": "1.0.*@dev"
```
接着在`laravel`项目的`config`的`app.php`去添加服务
```php?start_inline=1
'providers' => [
    Dingo\Api\Provider\LaravelServiceProvider::class
]
```
再去生成相应的配置文件
```shell
$ php artisan vendor:publish --provider="Dingo\Api\Provider\LaravelServiceProvider"
```
如果需要实现`jwt` 同样的也是去[安装页面](https://github.com/tymondesigns/jwt-auth/wiki/Authentication) 安装这个`package`
```php?start_inline=1
"require": {
    "tymon/jwt-auth": "0.5.*"
}
```
添加对应的服务:
```php?start_inline=1
'Tymon\JWTAuth\Providers\JWTAuthServiceProvider'
```
当然也是需要去配置一下他的`alias`
```php?start_inline=1
'JWTAuth' => Tymon\JWTAuth\Facades\JWTAuth::class,
'JWTFactory' => Tymon\JWTAuth\Facades\JWTFactory::class
```
生成配置文件
```shell
$ php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"
```
生成一个`key`
```shell
$ php artisan jwt:generate
```

## 使用
1.这个时候我们是在开发的环境下 还需对Dingo进行相应的配置 在`.env`文件里
```php?start_inline=1
API_STANDARDS_TREE=vnd
```
添加前缀
```php?start_inline=1
API_PREFIX=api
```
填写版本 这个我们之前自己写测试的时候也是提供的v1以此来区别版本
```php?start_inline=1
API_VERSION=v1
```
开启Debug模式
```php?start_inline=1
API_DEBUG=true
```

一开始可以去实现一个jwt的auth认证 在config/api.php里配置
```php?start_inline=1
'auth' => [
    'basic'=>function($app){
        return new  Dingo\Api\Auth\Provider\Basic($app['auth']);
    },
    'jwt'=>function($app){
        return new  Dingo\Api\Auth\Provider\JWT($app['Tymon\JWTAuth\JWTAuth']);
    }
],
```
这样我们即实现了在Dingo的jwt认证

2.既然是auth认证我们就需要先注册刚配置好的认证 即在Kernel文件里添加
```php?start_inline=1
'jwt.auth'=> \Tymon\JWTAuth\Middleware\GetUserFromToken::class,
'jwt.refresh'=>\Tymon\JWTAuth\Middleware\RefreshToken::class,
```

3.添加api路由
在laravel 5.2以后的版本我们可以直接放在routes/api.php里
```php?start_inline=1
$api = app('Dingo\Api\Routing\Router');
```
为了区分开来 我们可以在app目录下新建Api目录然后在新建Controllers和在Https目录一样 在这里用来管理api的控制器

在这个目录下新建一个基本的控制器BaseController
```php?start_inline=1
<?php
namespace App\Api\Controllers;
use App\Http\Controllers\Controller;
use Dingo\Api\Routing\Helpers;
class BaseController extends Controller
{
    use Helpers;
}
```
所以这个时候我们再去创建对数据表的`api`时就可以继承这个表而使用Dingo Api的`Helpers` 比如在此目录下创建`PostsController`

这样我们就可以在routes里根据Dingo提供的方法去定义想要的api了
```php?start_inline=1
$api->version('v1', function ($api) {
    $api->group(['namespace' => 'App\Api\Controllers'], function ($api) {
        $api->get('lessons','PostsController@index');
        $api->get('lessons/{id}','PostsController@show');
    });
});
```
在PostsController的index返回所有数据 那么再去访问[http://localhost:8000/api/lessons](http://localhost:8000/api/lessons)
就可以看到所有的数据了

## 相关链接
- [Dingo/api](https://github.com/dingo/api)
- [Dingo/api 配置页面](https://github.com/dingo/api/wiki/Configuration)
- [tymondesigns/jwt-auth](https://github.com/tymondesigns/jwt-auth)
