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
接着迁移我们的数据表
```shell
$ php artisan migrate
```

因为之前已经定义好了ModelFactory 所以我们去生成一些测试数据
```shell
$ php artisan tinker;
$ namespace App;
$ factory(Post::class,40)->create()
```
到这里我们的测试数据就已经准备好了

## 路由定义
为了更好的熟悉api的路由 首先我们可以像往常web路由的定义一样去定义我们这个Post的一系列路由
```php?start_inline=1
Route::group(['prefix'=>'api/v1'],function (){
    Route::resource('posts','PostController');
});
```

其实这个时候去查看一下路由 所看到的路由方式和我们的实际api开发的路由是差不多的

你也可以去看一些平台的api的文档 你会发现也都是遵循这样的规则 说到api的开发规则

现在基本也都遵循了Restful api的开发准则 网上相关的说明教程也很多这里推荐一个阮一峰的一篇文章

> [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

定义好了路由我们可以尝试着自己去实现下数据的操作 比如数据的全部显示

所以在PostController的index方法中就可以直接返回所有数据(这里只做测试显示 实际开发中是不会这样暴露全部数据的)
```php?start_inline=1
public function index()
{
    return Post::all();
}
```
这样的话我们去启动服务访问[http://localhost:8000/api/v1/posts](http://localhost:8000/api/v1/posts)这个路由的话理应是可以返回所有的数据的

当然如果是去指定的数据的话 按照api的设计要求就可以在url后面加上对应的id即可

所以这个时候我们在控制器里可以这样写
```php?start_inline=1
public function show($id)
{
    $post = Post::findOrFail($id);
    return $post;
}
```
同样的我们这个时候在请求这条api时就是[http://localhost:8000/api/v1/posts/3](http://localhost:8000/api/v1/posts/3)

## 字段映射
通常的我们在请求一个服务的api时会附加一些信息 如状态码等 这些信息都是必须的 但是我们的数据库里是没有这些信息数据的

再者就是数据库里的字段我们不会想要把他们全部反馈给用户 比如我们的时间戳等用户并不需要的信息

所以说在这里我们就需要对字段进行映射 以满足我们对数据的请求

在Laravel中我们可以在Response里去完善我们的返回信息 如:
```php?start_inline=1
public function index()
{
    $posts = Post::all();
    return \Response::json([
        'status_code'=>200,
        'data' => $posts->toArray()
    ]);
}
```
在选取本地的数据库字段时我们完全可以自己去实现这个方法
```php?start_inline=1
public function transform($posts)
{
    return array_map(function($post){
        return [
            'title' =>$post['title'],
            'content'=>$post['body'],
            'is_free'=>$post['free']
        ];
    },$posts->toArray());
}
```
这里的transform function就是对字段做了映射 所以在获取信息时调用这个方法即可
```php?start_inline=1
$posts = Post::all();
return \Response::json([
    'status_code'=>200,
    'data' => $$this->transform($posts)
]);
```
这样我们再去请求所有的数据时只会返回title content和is_free而这三个字段分别对应着数据表的title body和free