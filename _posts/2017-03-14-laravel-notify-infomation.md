---
layout: post
title: Laravel用户之间发送私信
description: 在一个系统里 用户之间可以发送私信 而这至今关系到两个用户 用户对于消息进行回复 这应该和系统之类的消息分开处理  
              我们可以去定义一个中间表去实现这样的业务
tags:
     Laravel
     Notify
class: post-five
comments: true
poster: /attachments/images/articles/2017-03-14/poster.jpg
---
## 介绍
其实有关站内信的通知 这个在一个社区里是很常见的 在写社区项目时肯定会遇到这样的场景

因为现在又遇到了这样的应用场景 在这里还是写一下关于用户私信的发送

这样类似的消息通知对于用户登录一个系统还是社区 都是十分必要的

而这其中我们又可以细分为**系统消息**以及用户之间的发送的**私信消息**

我们需要实现的就是用户之间发送私信 用户登录后可以查看私信消息 并进行回复

而对于系统这样的站内信通知 早在**5.3** 就提供了`notifications:table`去实现 这个下次有机会准备再写一下

### 建立模型表
开始之前还是去新建一个存放消息的表
```shell
$ php artisan make:model Message -m
```

当然我们也可以去生成一个控制器去定义对应的方法
```shell
$ php artisan make:controller MessageController
```

### 数据表字段信息
在`messages`表中我们去完善一下字段信息:
```php?start_inline=1
public function up()
{
    Schema::create('messages', function (Blueprint $table) {
        $table->increments('id');
        $table->unsignedInteger('from_user_id');
        $table->unsignedInteger('to_user_id');
        $table->text('body');
        $table->string('has_read',8)->default('F');
        $table->timestamp('read_at')->nullable();
        $table->timestamps();
    });
}
```
这里的字段从字面的意思可以看得出来 这就是私信表的主体

### 定义模型间的对应关系
首先去定义`Message Model`与用户的关系 我们在`Message Model`定义如下:
```php?start_inline=1
class Message extends Model
{
    protected $table = 'messages';
    protected $fillable = ['from_user_id', 'to_user_id', 'body', 'has_read','dialog_id'];

    public  function fromUser()
    {
        return $this->belongsTo('App\User','from_user_id');
    }

    public  function toUser()
    {
        return  $this->belongsTo('App\User','to_user_id');
    }
}
```
当然在`User Model`我们也要去声明和`Message Model`的关联
```php?start_inline=1
  //用户---消息
  public function messages()
  {
      return $this->hasMany(Message::class,'to_user_id');
  }
```
