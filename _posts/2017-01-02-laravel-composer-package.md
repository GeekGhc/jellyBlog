---
layout: post
title: Laravel Composer Package 开发简明教程
description: 在Laravel中有Package Development 扩展包是添加功能到 Laravel 的主要方式。扩展包可以包含许多好用的功能。在开发扩展包之前
            我们需要了解Service Providers 这样我们只需要在composer.json里去包含这个package并进行相应的配置即可
tags:
     Laravel
     Composer
     Package
class: post-six
comments: true
poster: /attachments/images/articles/2017-01-02/poster.png
---
## 介绍
在`Laravel`中就有[Laravel Composer Package](https://laravel.com/docs/5.4/packages)开发的相关介绍 这其中需要运用 **Service Providers** 当然对于我们Laravel开发人员
来说 开发一个扩展包还是很值得学习的 现在就来开发一个消息通知的扩展包 这是一个`Laravel`包的开发过程

> 包的地址:[https://github.com/GeekGhc/LaraFlash](https://github.com/GeekGhc/LaraFlash)

## 新建包
在生成好的`Laravel`项目中新建`packages`目录(和`app`同级) 接着在`packages`目录下新建包目录 `packages/geekghc/laraflash`

我们需要新建`src`目录来存放我们的源文件 

接着因为我们是开发一个扩展包 之后还需要进行测试开发  所以我们去生成一个`composer.json`文件
```shell
$ composer init
```
填写完基本信息之后 在`packages/geekghc/laraflash`目录下就会生成一个`composer.json`文件:

我先给出
```php?start_inline=1
{
    "name": "geekghc/flash",
    "description": "flash for laravel",
    "license": "MIT",
    "authors": [
        {
            "name": "GeekGhc",
            "email": "ghcgavin@sina.com"
        }
    ],
    "minimum-stability": "dev",
    "require": {},
    "require-dev": {
        "phpunit/phpunit": "~5.7"，
         "mockery/mockery": "0.9.*"
    },
    "autoload": {
        "psr-4": {
            "GeekGhc\\LaraFlash\\": "src/"
        },
        "files": [
            "src/GeekGhc/LaraFlash/function.php"
        ]
    }
}
```
完成好`composer.json`后 我们可以去`src/GeekGhc/LaraFlash`目录下新建一个`Flash.php`
```php?start_inline=1
<?php
namespace GeekGhc\LaraFlash;
use Illuminate\Support\Facades\Facade;
class Flash extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'laraflash';
    }
}
```
我们这里继承了`Facade`类，用`Facades`可以访问`IoC`容器中注册的类，有了`IoC`容器，我们可以在任何地方调用注册的类

所以为了方便使用 我们可以去`config/app.php`去注册我们的服务
```php?start_inline=1
'providers' => [
    GeekGhc\LaraFlash\MyFlashProvider::class,
];
```
为了方便使用 可以再去添加一个`alias`
```php?start_inline=1
'aliases' => [
    'LaraFlash'=>GeekGhc\LaraFlash\Flash::class,
];
```

接着我们可以去实现`flash`的主要功能服务 当然这个并不是重点 重点是怎么学会去使用注册的服务类

最后的目录结构是这样的

|
|—— packages 
| |—— geekghc
|   |—— laraflash 
|     |—— src            源文件
|       |—— GeekGhc      源文件
|         |—— LaraFlash     
|           |—— Flash.php     
|           |—— FlashNotifier.php     
|           |—— function.php     
|           |—— FlashProvider.php     
|           |—— SessionStore.php     
|           |—— LaravelSessionStore.php     
|       |—— views        视图文件
|     |—— tests          测试目录
|     |—— vendor         测试需要的包
|     |—— .gitignore    
|     |—— composer.json    
|     |—— composer.lock    
|     |—— phpunit.xml  
|     |—— readme.md


这样的话 我们就在本地写好了扩展包  我们其实可以去创建一个控制器去测试我们这个包是否正常

在视图`home.blade.php`我们就可以去包含`views`里面的视图文件
```php
@include('laraflash::notification')
```
或者
```php
@include('laraflash::header-notification')
```
接着在控制器去使用类似这样的形式:
- LaraFlash::success('Message')
- LaraFlash::info('Message')
- LaraFlash::error('Message')
- LaraFlash::warning('Message')

> 包的具体使用还是去[github](https://github.com/GeekGhc/LaraFlash)看一下具体使用就知道了

显示正常之后我们就可以去发布我们的`package`了

在`github`先创建一个仓库 当然我这里的就是创建了`LaraFlash`这个远程仓库

紧接着我们去推送好我们的代码就行 具体怎么推送就不多说了

接着我们需要去仓库的`setting` **=>** `Intergrations&services`添加`Packagist`服务(填写好用户名和`Token`)

添加完毕之后去[Packagist](https://packagist.org/)  `Submit`这个仓库(提供远程仓库的地址)

在`github`进入`packagist`测试通过之后就ok了

因为我们之前定义的**dev**版本 如果后期有人提出了一些issues你去修改了自己的`package`

那么我们会去增加别的`tag`  也是就是说你修改`package`之后 再去添加一个`tag`:
```shell
$ git tag 2.0 -a
```

填写说明信息后 推送这个`tag`:
```shell
$ git push --tags
```
这样一来我们就发布了**v2.0**这个版本  这就是我们发布扩展包大概流程


## 参考资料
- [Laravel Composer Package 开发简明教程](https://laravel-china.org/articles/1714/laravel-composer-package-development-concise-tutorial)
- [Laravel 的扩展插件开发指南](http://d.laravel-china.org/docs/5.4/packages)
- [Laravel Composer Package实战](http://www.tuicool.com/articles/QRFvEzZ)
- [Laravel Package Development](https://laravel.com/docs/5.4/packages)
