---
layout: post
title: Laravel模态关联处理发布帖子
description: 在一个社区或者技术圈中用户肯定需要去发表自己的帖子文章 而如果你以Laravel作为开发框架的话 他提供的
               模型关联就是通过定义各个对象的关系来处理这种应用场景
tags:
     Laravel
     Eloquent
     Post
class: post-three
comments: true
poster: /attachments/images/articles/2017-03-05/poster.jpg
---

## 介绍
最近在完成自己的`SPA`项目时 涉及到用户的帖子发布 其实这个应用场景之前在学习`laravel`时就遇到过

自己在写社区这个项目时 模型之间的关联显然比我目前的需求更为复杂 在这里 我想实现的就只是用户在社区圈发布自己的帖子

这样的关系就只是帖子和用户之间  而社区这个场景的话 里面有文章 帖子 视频 特别是在评论和标签这些的关联

当然在这个项目里我肯定还是回去定义帖子 评论 用户之间的关联 而在社区里就评论而言 评论可以是对帖子 文章 视频

这也就涉及到模型间的多态关联 在这里我还是去实现模型间的一对多的关联 因为完全可以达到我的需求了

## 定义表字段信息
当然定义模型之间的关联之前还是得去定义模型的字段信息:

首先在`User Eloquent Model`里还是按照实际场景去定义 在这里我是这样的定义的:
```php?start_inline=1
Schema::create('users', function (Blueprint $table) {
    $table->increments('id');
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->string('avatar');//保存用户头像
    $table->string('confirm_code',64);//邮箱确认激活code
    $table->smallInteger('is_confirmed')->default(0);//判断用户呢是否已经激活他的邮箱
    $table->integer('followers_count')->default(0);
    $table->integer('followings_count')->default(0);
    $table->rememberToken();
    $table->timestamps();
});
```

这个就是`User Model`的定义 接着去定义`Post Model`
```php?start_inline=1
Schema::create('posts', function (Blueprint $table) {
    $table->increments('id');
    $table->text('body');
    $table->text('html_body');
    $table->integer('user_id')->unsigned();//发表帖子的用户
    $table->integer('last_user_id')->unsigned();//更新帖子的用户
    $table->integer('comment_count')->default(0);//评论数
    $table->integer('vote_count')->default(0);//点赞数
    $table->string('is_first',8)->default('F');
    $table->timestamps();
});
```
这里包含了一个帖子的基本信息 当然还有包括点赞 评论功能 这些我们都要去定义实现

## 建立模型间的关系
我们可以知道一个用户是对应着多个帖子 那么也就是一对多的关系 其实无论是文章还是和用户之间

我们更多的看到的还是一个一对多的关系 那么我们可以在`User Model` 去声明一下与帖子的关系:
```php?start_inline=1
//用户----帖子
    public function posts()
    {
        return $this->hasMany(Post::class);//$user->posts()
    }
```
下面就是去在`Post Model`声明与用户的关系:
```php?start_inline=1
//帖子----用户
   public function user()
   {
       return $this->belongsTo('App\User');//$post->user()
   }

   //帖子----最后更新用户
   public function last_user()
   {
       return $this->belongsTo('App\User');
   }
```
这里我声明两个关系 一个是帖子的发表用户 一个是帖子最近更新用户

当一个帖子的发布必然包含这个帖子的所有者 然后如果需要知道帖子最近被更新的用户的信息

那么我们就需要去声明这个`last_user`这个`eager load`

## 检验关系模型

声明完这两个模型之间的关系我们可以尝试着去生成几条测试数据 在这之前我已经完成好`Model Factory`

为了检验模型间的关系 我们可以去`tinker`去查看一下有没有拿到对应的帖子

> 这里我在之前已经生成了几条数据 就拿来用了 下面是`Post database table`:

![first](/attachments/images/articles/2017-03-05/first.png)

> 这里是`windows`环境下 所以我用的还是**Navicat Premium** 管理数据库 因为支持多种数据库 用起来还是相当方便的
>
> 如果是`Mac`环境下的话 **Sequel Pro** 肯定是一个非常好的选择

接着去项目终端执行:
```shell
$ php artisan tinerk
```
```shell
$ namespace App;
```
接着去拿到id为6的user
```shell
$ $user = User::find(6);
```
现在我们就可以看下是不是可以拿到这三条post数据:
```shell
$ $user->posts
```
执行完后你就可以看到 成功的拿到了三条数据 这就是帖子和用户之间的关联 之后我们还会实现**点赞**  **评论**的模型之间的关联
