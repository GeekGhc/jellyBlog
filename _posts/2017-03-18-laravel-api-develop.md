---
layout: post
title: Laravel API开发初探
description: 在Web开发，Api开发是一项非常重要的技术，这里就以Laravel项目实例来开发API 熟悉下API的具体的流程
tags:
     Laravel
     API
class: post-six
comments: true
poster: /attachments/images/articles/2017-03-18/poster.jpg
---

## 介绍
关于`API`的开发 这在每个开发语言里都会有对应的开发方法 在`Python`里我们会用`django`框架去开发我们的`API`

在`Laravel`里我们会用`Dingo`结合`JWT`认证去开发我们的`API` 而这里我们就以`Laravel`项目为例 来开发我们的`API` 熟悉一下在
项目里是怎么去开发`API`

> 本文基于laravist的Api的开发教程  作为笔记参考

## 初始化数据
因为我们这里是以`laravel`项目，所以我们可以先去生成一些测试数据 为了方便后面的数据操作

在项目终端目录执行:
```shell
$ php artisan make:model Post -m
```
在生成的`posts table`里去定义数据字段
```php?start_inline=1
Schema::create('posts', function (Blueprint $table) {
    $table->increments('id');
    $table->string('title');
    $table->text('body');
    $table->boolean('free');
    $table->timestamps();
});
```

接着去定义数据`ModelFactory`
```php?start_inline=1
$factory->define(App\Post::class, function (Faker\Generator $faker) {
    return [
        'title' => $faker->sentence,
        'body' => $faker->paragraph,
        'free' => $faker->boolean()
    ];
});
```
接着为这个`model`生成相应的控制器:
```shell
$ php artisan make:controller PostController
```
接着迁移我们的数据表
```shell
$ php artisan migrate
```

因为之前已经定义好了`ModelFactory` 所以我们去生成一些测试数据
```shell
$ php artisan tinker;
$ namespace App;
$ factory(Post::class,40)->create()
```
到这里我们的测试数据就已经准备好了

## 路由定义
为了更好的熟悉`api`的路由 首先我们可以像往常web路由的定义一样去定义我们这个`Post`的一系列路由
```php?start_inline=1
Route::group(['prefix'=>'api/v1'],function (){
    Route::resource('posts','PostController');
});
```

其实这个时候去查看一下路由 所看到的路由方式和我们的实际`api`开发的路由是差不多的

你也可以去看一些平台的`api`的文档 你会发现也都是遵循这样的规则 说到`api`的开发规则

现在基本也都遵循了`Restful api`的开发准则 网上相关的说明教程也很多这里推荐一个阮一峰的一篇文章

> [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

定义好了路由我们可以尝试着自己去实现下数据的操作 比如数据的全部显示

所以在`PostController`的`index`方法中就可以直接返回所有数据(这里只做测试显示 实际开发中是不会这样暴露全部数据的)
```php?start_inline=1
public function index()
{
    return Post::all();
}
```
这样的话我们去启动服务访问[http://localhost:8000/api/v1/posts](http://localhost:8000/api/v1/posts)这个路由的话理应是可以返回所有的数据的

当然如果是去指定的数据的话 按照`api`的设计要求就可以在`url`后面加上对应的`id`即可

所以这个时候我们在控制器里可以这样写
```php?start_inline=1
public function show($id)
{
    $post = Post::findOrFail($id);
    return $post;
}
```
同样的我们这个时候在请求这条`api`时就是[http://localhost:8000/api/v1/posts/3](http://localhost:8000/api/v1/posts/3)

## 字段映射
通常的我们在请求一个服务的`api`时会附加一些信息 如状态码等 这些信息都是必须的 但是我们的数据库里是没有这些信息数据的

再者就是数据库里的字段我们不会想要把他们全部反馈给用户 比如我们的时间戳等用户并不需要的信息

所以说在这里我们就需要对字段进行映射 以满足我们对数据的请求

在`Laravel`中我们可以在`Response`里去完善我们的返回信息 如:
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
这里的`transform function`就是对字段做了映射 所以在获取信息时调用这个方法即可
```php?start_inline=1
$posts = Post::all();
return \Response::json([
    'status_code'=>200,
    'data' => $$this->transform($posts)
]);
```
这样我们再去请求所有的数据时只会返回`title` `content`和`is_free`而这三个字段分别对应着数据表的`title` `body`和`free`

当然这里只是对一个`Collection`进行的映射 那么对一条数据呢 为了更好的重用 我们可以去分离这部分代码

所以我们在`app`目录下去创建`Transformer`目录 在这个目录里面去创建一个`Transformer`的抽象类
```php?start_inline=1
<?php
namespace App\Transformer;

abstract class Transformer
{
    /**
     * @param $items
     * @return array
     */
    public function transformCollection($items)
    {
        return array_map([$this, 'transform'], $items);
    }

    /**
     * @param $item
     * @return mixed
     */
    public abstract function transform($item);
}
```
这里的抽象类我们可以继承之后对相应的数据表的字段进行映射 
所以这里我们对`posts`表的字段进行映射时 我们就去创建`PostTransformer`类
```php?start_inline=1
<?php
namespace App\Transformer;
class PostTransformer extends Transformer
{
    /**
     * @param $item
     * @return array
     */
    public function transform($item)
    {
        return [
            'title' => $item['title'],
            'content' => $item['body'],
            'is_free' => $item['free']
        ];
    }

}
```
这样定义完毕之后再去控制器里依赖注入这个`PostTransformer`即可

## 请求错误返回
有些时候并不是所有请求都会得到正确的信息返回的 比方说错误的参数和不存在的数据 用户想要请求`id`为**99**的这条数据 

但实际上并不存在这条数据 所以这时候我们会返回这种错误处理信息

对于这样的场景 我们目前能想象得到的就是判断对应的请求信息 如果正确即返回 否则返回错误信息 比如说常见的404错误

这时在定义`show`方法时 我们就可以加一个判断处理
```php?start_inline=1
public function show($id)
{
    $post = Post::find($id);
    if(! $post){
        return \Response::json([
            'status_code'=>404,
            'message'=>"post not found!"
        ]);
    }
    return \Response::json([
        'status_code'=>200,
        'data' => $this->postTransformer->transform($post)
    ]);
}
```

为了更好的管理返回信息的处理 我们可以把这部分代码抽离出来
```shell
$ php artisan make:controller ApiStatusCoontroller
```

在这个控制器里主要就是去实现各种状态信息的返回 这样我们在业务代码里只需要调用相应的状态函数即可
```php?start_inline=1
<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;

class ApiStatusController extends Controller
{
    protected $statusCode = 200;//默认状态码

    /**
     * @return int
     */
    public function getStatusCode()
    {
        return $this->statusCode;
    }

    /**
     * @param int $statusCode
     */
    public function setStatusCode($statusCode)
    {
        $this->statusCode = $statusCode;

        return $this;
    }

    public function responseNotFound($message = 'Not found')
    {
        return $this->setStatusCode(404)->responseError($message);
    }

    public function responseError($message)
    {
        return $this->response([
            'error'=>[
                'status_code' => $this->getStatusCode(),
                'message' => $message
            ],
        ]);
    }
    
    public function response($data)
    {
        return \Response::json($data,$this->getStatusCode());
    }
}
```

这样一来如果我们需要返回错误处理的话 我们在目前的控制器 比如说`PostController`继承`ApiStatusController`

然后在返回错误信息是=时就可以直接调用

这样和之前其实是一样的 如果是正确的返回则直接调用`response`方法
```php?start_inline=1
public function show($id)
{
    $post = Post::find($id);
    if(! $post){
        return $this->responseNotFound();
    }
    return $this->response([
        'status' => 'success',
        'data' => $this->postTransformer->transform($lesson)
    ]);
}
```