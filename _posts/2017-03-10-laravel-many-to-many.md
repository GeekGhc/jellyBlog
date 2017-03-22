---
layout: post
title: Laravel处理多对多模型关系
description: 在一个社区和论坛里 我们常常会遇到用户收藏帖子或文章这种应用场景 那么我们需要的就是对帖子和用户这两者之间
            的一种多对多的关系处理
tags:
     Laravel
     Eloquent
     Collect
class: post-four
comments: true
poster: /attachments/images/articles/2017-03-10/poster.jpg
---
## 介绍
在实际应用中 比如我们在知乎社区中 我们可以对一个帖子进行收藏 点赞的功能 这个其实就是一种**多对多**的关系
因为一个用户可以收藏多篇帖子 一篇帖子也可以被多个用户收藏 这边我就以用户收藏一篇帖子举例

还有一种情况就是模型的**多态关联** 意思就是就比如评论既可以是对帖子 也可以是对文章 也可以是对视频
这个我在之前的社区项目里就遇到过 对于这种应用场景`Laravel`提供多态关联这样的解决方案

而在这我们只需要处理一种**多对多**的关系 针对的是用户和帖子之间的关系处理
## 定义模型信息
1.生成中间关系表
为了定义用户与帖子之间的关系 我生成了一个`Collect Model`
```shell
$ php artisan make:model Collect -m
```
2.定义中间表的字段信息
在生成`Collects`表后 去定义好表的字段信息
```php?start_inline=1
Schema::create('collects', function (Blueprint $table) {
    $table->increments('id');
    $table->integer('user_id')->unsigned()->index();
    $table->integer('post_id')->unsigned()->index();
    $table->timestamps();
});
```
这边因为我们定义的是用户和帖子之间的关系 所以包含了各自的`id`值

当然其实在多对多的关系里 默认是通过 `post_user` 这样的中间表来决定模型间的关系的

这个当然也可以自定义 也就是这里的`collects`表

当然`users table` 和 `posts table` 根据具体的业务需求来定义即可

定义完毕之后 去生成我们的表
```shell
$ php artisan migrate
```

定义好模型表的信息 接下来就可以去各自的`Model`声明对应关系了

3.声明模型关系
在`User Model` 里面声明
```php?start_inline=1
//用户----帖子(收藏)
public function collect()
{
    return $this->belongsToMany(Post::class,'collects')->withTimestamps();
}

//收藏帖子
public function collectThis($post)
{
     $this->collect()->toggle($post);
}
```
这里的`collects`是声明了用户和帖子之间的多对多的关系 其中两者的中间关系表就是我们定义好的`collects table`

`collectThis` 方法是用户收藏帖子的操作 同样的点赞的功能我们也是用到这个方法

> 在多对多的模型附加和卸载时 是使用`attach` 和 `detach`方法 而`toggle`则是一个开关式的操作

接下来就去定义`Post Model`里的关系
```php?start_inline=1
//帖子----用户
 public function user()
 {
     return $this->belongsTo('App\User');//$post->user
 }

//帖子----最后更新用户
 public function last_user()
 {
     return $this->belongsTo('App\User');
 }

//帖子---用户(收藏)
 public function collected()
 {
     return $this->belongsToMany(User::class,'collects')->withTimestamps();
 }
```

这里边同时定义了一个预加载(eager load) 也就是`last_user`这样的一个关系 即代表帖子最后更新的用户

其实到这里就已经定义好了多对多的关系 那么接下来我们可以去生成一个控制器 写下我们收藏帖子这个方法
```shell
$ php srtisan make:controller CollectController
```

生成完后我们的控制器 我们去定义收藏这个操作的方法
```php?start_inline=1
//用户收藏帖子
public function store(Request $request)
{
    $user = User::find($request->get("userId"));
    $collect = $user->collectThis($request->get("postId"));
    return json_encode(["isCollect" => true, "status" => "true"]);
}
```

这边我们可以对任意的用户去收藏帖子 因为在collectThis 这个function 里我们已经定义好了
```php?start_inline=1
//收藏帖子
public function collectThis($post)
{
     $this->collect()->toggle($post);
}
```
其实这个方法不一定要这样写在`Model`里面 也可以直接在控制器方法体里面去执行这个`function`

但是为了更加直观和更好的重用 这样写还是很有必要的

其实我们也可以去`tinker`测试一下 是不是可以成功执行收藏
```shell
$ php artisan tinker;
```

```shell
$ namespace App;
```

接着获取一个`user`
```shell
$ $user = User::find(2)
```

```shell
$ $user->collectThis(23)
```

这样之后再去数据库里 我们就可以看到数据成功生成了 也就是`id`为**2**的用户收藏了`id`为**23**的这篇帖子

当再次执行

```shell
$ $user->collectThis(23)
```

我们数据就可以撤销了 因为收藏和点赞本来就是一个开关式的操作逻辑
