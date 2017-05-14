---
layout: post
title: Laravel API开发
description: 在Web开发，Api开发是一项非常重要的技术，这里就以Laravel项目实例来开发API 熟悉下API的具体的流程
tags:
     Laravel
     API
class: post-six
comments: true
poster: /attachments/images/articles/2017-03-18/poster.jpg
---

## 介绍
关于API的开发 这在每个开发语言里都会有对应的开发方法 在Python里我们会用django去开发我们的API

在Laravel里我们会用JWT去开发我们的API 而这里我们以Laravel项目为例 来开发我们的API 熟悉一下在
项目里是怎么去开发API

## 初始化数据
因为我们这里是以laravel项目，所以我们可以先去生成一些测试数据 为了方便后面的数据操作

在项目终端目录执行:
```shell
$ php artisan make:model Post -m
```
在生成的posts table里去定义数据字段
```php?start_inline=1
Schema::create('posts', function (Blueprint $table) {
    $table->increments('id');
    $table->string('title');
    $table->text('body');
    $table->boolean('free');
    $table->timestamps();
});
```

接着去定义数据ModelFactory
```php?start_inline=1
$factory->define(App\Post::class, function (Faker\Generator $faker) {
    return [
        'title' => $faker->sentence,
        'body' => $faker->paragraph,
        'free' => $faker->boolean()
    ];
});
```
接着为这个model生成相应的控制器:
```shell
$ php artisan make:controller PostController
```

