---
layout: post
title: Laravel用户之间相互关注
description: 在一个系统或者论坛 用户之间可以相互关注 类似于Github的followers和following这样的应用场景 在laravel我们也可以去
            实现这样的用户与用户之间的关联
tags:
     Laravel
     Notify
class: post-one
comments: true
poster: /attachments/images/articles/2017-03-20/poster.jpg
---
## 介绍
有关用户之间的相互关注这样的应用场景还是很常见的 每个平台都会有这样类似的需求  就比如**Segmentfault**和我们的**知乎**

当然还有最熟悉的`Github`每个人可以有关注者和粉丝 在我写的社区里也需要用到这样的需求 

现在在我开发的类似知加的问答圈 因为以`laravel`作为后端数据 也同样会应用到这样的功能

索性就谈谈如何在`laravel`中去实现我们用户之间的互相关注

### 建立模型表
这里我们去建立一个中间表 可以想象得到的是这张表里包含了两个用户的`id` 我们可以去创建一个`Model`
```shell
$ php artisan make:model Follow -m
```

创建完我们的表之后 我们去完善下表的字段信息
```php?start_inline=1
Schema::create('follows', function (Blueprint $table) {
    $table->increments('id');
    $table->integer('follower_id')->unsigned()->index();
    $table->integer('followed_id')->unsigned()->index();
    $table->timestamps();
});
```
定义完毕之后去迁移下数据表
```shell
$ php artisan migrate
```

### 定义模型方法
写完我们的数据表 我们是将关注的信息存放在`follows`这个数据表的 因为这是用户与用户之间的关联 
并不是之前的用户与帖子或文章这样的模型关联 其实实现的道理是一样的 
```php?start_inline=1
//用户关注
public function followers()
{
    return $this->belongsToMany(self::class,'follows','follower_id','followed_id')->withTimestamps();
}

//用户的粉丝
public function following()
{
    return $this->belongsToMany(self::class,'follows','followed_id','follower_id')->withTimestamps();
}

//关注用户
public function followThisUser($user)
{
    return $this->followers()->toggle($user);
}
```
因为用户与用户之间也是一种**多对多**的关系 所以我将关注用户的方法写成`followThisUser`

### 定义方法路由
接下来就可以去定义相应的方法路由了 这里为了使用方便我定义了一个控制器
```shell
$ php artisan make:controller FollowController
```

首先我们去定义一下我们的路由
```php?start_inline=1
Route::post('user/follow','FollowersController@follow');
```

如果用户去关注另一个用户的话 只需要去执行`follow`方法 而这个方法也是一个`toggle`式的操作

当然我们在执行
```php
$follow = $user->followThisUser($userId)
```

> 这个方法是他会返回一个数组对象 如果是执行`attach`方法的话 
>
>那么`$follow['attached']`是`$userId`的值
> 
> 如果这样的话我们就可以知道`followThis`这个方法到底是执行了`attach`还是`detach`方法了 
> 那么接着我们就可以去增加一个用户的粉丝数这样的操作了

所以你可以在执行完成之后的逻辑是这样的
```php?start_inline=1
$follow = user()->followThisUser($userId);
//如果用户关注了另一个用户
if(count($followed['attached'])>0){
    //可以去通知用户 修改用户的关注人数等数据
    return response()->json(['followed' => true]);
}
```
当然如果我们需要拿到一个用户的关注的人和粉丝的话 可以去执行
```php?start_inline=1
$user->following 
```
以及
```php?start_inline=1
$user->followers    
```
这样的话我们就可以拿到对应的用户数据信息了

那么我们定义完用户关注其他用户的操作 那么我们之后也可以去获取一个用户是否关注了这个用户 这个只需要返回一个`bool`值

我们接着去定义一下路由
```php?start_inline=1
Route::get('/{userId}/follow/{followedId}','FollowController@isFollow');//用户是否关注
```
然后去写一下对应的方法逻辑
```php?start_inline=1
//用户是否关注
public function isFollow($userId,$followedId)
{
    $followedUser = User::find($followedId);
    $followers = $followedUser->followers()->pluck('follower_id')->toArray();
    if(in_array($userId,$followers)){
        return response()->json(true);
    }
    return response()->json(false);
}
```

主要就是判断字段的`follower_id`是否存在我们当前的用户`id`并且对应的是我们所给的目标用户的`id`

返回值拿到后我们就可以在视图去判断 一个用户是否已经关注了这个用户 

其实最好我们把关注用户这个过程放在一个组件里 这样可重用性也会更好

> 其实整个实现起来就和我们对一篇帖子进行点赞一样 只不过对象变成了用户与用户之间
