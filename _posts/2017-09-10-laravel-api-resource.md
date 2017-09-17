---
layout: post
title: laravel5.5 之Api Resource
description: 在laravel5.5中 引入了新的概念就是Api Resource这样我们就可以不用之前的Dingo而自定义返回字段和数据
tags:
     laravel
     Api
class: post-seven
comments: true
poster: /attachments/images/articles/2017-09-10/poster.jpg
---

在`Laravel5.5`之前  我们在处理我们的`api`接口时 会用到dingo来管理我们的后台数据  那么在**5.5**中 引入了新的概念就是
`api resource` 正如这个名字一样  我们可以建立`api`资源管理 

在之前我们也有说过编写后台的`api`服务  那么在处理数据返回字段时   我们会选择对字段进行映射 这样来选取我们客户端需要的
数据  这在之前我们是通过一个`Transformer`这个中间层来进行映射

当然再此之前我们先创建好`User` 和 `Post`这两个`Model`  并生成对应的数据字段

在**5.5**中我们可以有更好的资源管理形式  话不都说  新建好必要的项目后 我们去创建用户的`api`管理

```shell
$ php artisan make:resource User
```
其中`make:resource`命令也是**5.5**新增的  这样我们会在`app/Http/Resources` 增加了一个继承`Resource`的`User Class`

在路由中  为了演示  我们可以在路由返回其中的一个用户
```php?start_inline=1
Route::get('user',function(){
   $user = \App\User::find(2);
   return new \App\Http\Resources\User($user);
});
```
这样的话我们会返回**id**为**2**的这个用户的全部信息  但这并不是我们所需要的  那么我们可以借用`api resource`进行字段的映射

在`\App\Http\Resources\User`里我们去返回一些基本字段
```php?start_inline=1
public function toArray($request)
{
    return [
        'name'=>$this->name,
        'email'=>$this->email
    ];
}
```
这样一来我们再去访问之前的路由返回给我们的也就是筛选之后的字段  当然现在有个问题就是  实际项目中我们可能需要返回其他字段

比如我们的客户端需要知道是否返回成功的信息  那么我们可以再去重写这个`Resource`中的`with`方法
```php?start_inline=1
 public function with($request)
    {
       return [
            'code'=>1,
           'status'=>'success'
       ];
    }
```
这样的话我们就是增加了返回字段`code`和`status`  当然我们在返回数据`body`部分我们的是放在`data`中  我们也可以更改这个`key`

在`app/Providers/AppServiceProvider`中
```php?start_inline=1
public function boot()
{
    Resource::wrap('lists');
}
```
这样我们的返回数据字段就是
```php?start_inline=1
{
    "lists": {
        "name": "Mrs. Orpha Waters MD",
        "email": "jose82@example.net"
    },
    "code": 1,
    "status": "success"
}
```

如果我们需要返回该用户的帖子  这也很简单 再增加一个`posts`字段就是了 不够再此之前先关联一下用户和帖子的关系

当然有一种应用场景就是我们对字段数据的判断  就如文档中所说如果是管理员的话我们就返回特定的字段  反之不然

`laravel`为我们提供了`when` 这个 `function`  具体判断则是
```php?start_inline=1
public function toArray($request)
{
    return [
        'name'=>$this->name,
        'email'=>$this->email,
        'secret' => $this->when($this->isAdmin(), 'secret-value'),
    ];
}
```
这个时候只有`$this->isAdmin`返回为`true`时  返回字段里才会出现`secret`这个`key`  不然的话在返回之前就已经过滤掉了

`ok` 在很多的场景中  我们需要返回的是一个`collection`比如一个用户的所有帖子  那么`api resource`同样为我们提供了对collection
的处理方式  在终端执行
```shell
$ php artisan make:resource UserCollection
```
当然这个命名是有讲究的  在生成的类的继承父类就可以看到出来   那么如果我们需要制定一个`collection`的处理方式在命令中可以加一个
`--collection`这个`flag`  具体可以在终端查看一下
```shell
$  php artisan make:resource -h
```
生成完毕之后我们会发现这个类是继承`ResourceCollection`这个父类的  所以同样的我们可以去返回所有的用户信息
```php?start_inline
Route::get('user',function(){
   $users = \App\User::get();
   return new \App\Http\Resources\UserCollection($users);
});
```

如果需要提供其他字段的也可以在`with function`增加  当然对于处理分页  其实在`collection`的分页也提供了非常详细的字段数据
```php?start_inline=1
Route::get('user',function(){
   $users = \App\User::with('posts')->paginate(3);
   return new \App\Http\Resources\UserCollection($users);
});
```
从返回的数据我们可以看到新增了`links`和`meta`字段里面包含了分页我们可能需要的数据 如上一页下一页

如果需要对用户的帖子字段进行映射  创建一个`Post Resource`再进行一次`transformer`就行

对于关联数据的返回可以如以前所说采用`eager loader`来避免N+1的查询  那么在路由方法中我们可以采用`with('posts')`这样的方式

当然在`Resource`里我们还可以采用提供给我们的`whenLoaded` 这个`function`  具体表现为
```php?start_inline=1
 public function toArray($request)
    {
        return [
            'name'=>$this->name,
            'email'=>$this->email,
            'posts'=>Post::collection($this->whenLoaded('posts'))
        ];
    }
```



## 相关链接

- [Eloquent: API 资源](https://d.laravel-china.org/docs/5.5/eloquent-resources)

