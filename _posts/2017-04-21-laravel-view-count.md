---
layout: post
title: Laravel 实现文章浏览次数统计
description: 在实现文章帖子的浏览次数统计时  我们可能会选择Redis作为缓存计算 当然也可以使用session来进行统计 
             这里我们再结合事件的监听来计算文章的浏览量
tags:
     Laravel
     Session
class: post-three
comments: true
poster: /attachments/images/articles/2017-04-21/poster.jpg
---

## 介绍
在有关用户浏览文章或帖子的访问数的统计时 我们可能会考虑到使用缓存机制来实现 即可以使用Redis来存储一篇帖子的浏览数

当然我们也可以有其他的更为简单的处理方式 这里我们可以结合`Laravel`的`Event Listener`来实现文章浏览的监听

## 首先我们可以先去创建一个ArticleController 这样我们就可以去执行文章的一系列业务逻辑

```shell
$ php artisan make:controller ArticleController
```
接着当然是去生成`Article Model`和他的数据表
```shell
$ php artisan make:model Article -m
```
生成完毕之后 可以去定义一下`articles`这个`table`
```php?start_inline=1
public function up()
{
    Schema::create('articles', function (Blueprint $table) {
        $table->increments('id');
        $table->string('title');
        $table->text('body');
        $table->integer('user_id')->unsigned();
        $table->integer('last_user_id')->unsigned();
        $table->integer('view_count')->default(0);
        $table->integer('comment_count')->default(0);
        $table->foreign('user_id')
            ->references('id')
            ->on('users')
            ->onDelete('cascade')
            ->onUpdate('cascade');
        $table->timestamps();
    });
}
```

其实在这里主要的就是`view_count`这个`field` 因为这里就是我们用来记录文章的浏览次数的

最后执行数据表迁移:
```shell
$ php artisan migrate
```

当然这些只是前期工作 我们还是得做的 一些具体内容 个人看具体需求而定

## 创建事件监听
我们需要对文章浏览这个事件进行监听 **So** 我们需要创建一个文章浏览的事件并进行监听

我们可以单独去生成相应的`event`和`listener`当然我们也可以在`app/Providers/EventServiceProvider`去声明:

```php?start_inline=1
protected $listen = [
    'App\Events\UserRegistered' => [
        'App\Listeners\SendWelcomeEmail',
    ],
    'App\Events\ArticleView' => [
        'App\Listeners\ArticleViewListener',
    ],
    'App\Events\PostView' => [
        'App\Listeners\PostViewListener',
    ],
];
```
这里给出了两个实例  因为在我之前的项目里是有文章和帖子 当然这并不重要 我们需要关注的就是文章

声明完成之后 我们再去命令行:
```shell
$ php artisan event:generate
```
这样我们在`app/Events` 和 `app\Listeners`里面就会有相应的事件监听文件

在`app\Events\ArticleView.php`去完成一下他的构造函数 因为我们需要知道是对哪一篇文章的浏览
```php?start_inline=1
class ArticleView
{
    use InteractsWithSockets, SerializesModels;
    public $article;
    public function __construct(Article $article)
    {
        $this->article = $article;
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
```
之后我们就要去`app\Listeners\ArticleViewListener.php`里去写具体的逻辑业务

首先之前我们说过利用`laravel Session`机制去实现数量的统计 所以在构造函数中先去注入`Session`
```php?start_inline=1
protected $session;

/**
 * Create the event listener.
 *
 * @return void
 */
public function __construct(Store $session)
{
    $this->session = $session;
}
```
这样其实也很好理解 而具体的处理代码就是在`handle`里面 这和我们去定义`console command`命令是一样的
```php?start_inline=1
public function handle(ArticleView $event)
{
    $article = $event->article;
    //查看是否被浏览过
    if(!$this->hasViewedArticle($article)){
        //最近没有浏览 则 浏览数加1
        $article->increment('view_count');
        //看过文章之后将保存到Session
        $this->storeViewedArticle($article);
    }
}
```
而这里需要的其他方法则定义如下(都给出了相应的解释)
```php?stsrt_inline=1
//文章最近是否被浏览过
public function hasViewedArticle($article)
{
    return array_key_exists($article->id,$this->getViewedArticle($article));
}

//如果浏览过则获取session存入的浏览记录
public function getViewedArticle($article)
{
    return $this->session->get('viewed_article'.$artice->id, []);
}

//最近第一次浏览 存入session
public function storeViewedArticle($article)
{
    $key = 'viewed_article.' . $article->id;
    $this->session->put($key, time());
}
```
整个过程和用户的登录差不多  浏览记录不可能每一次刷新都会增加 而是在相应的一段时间内

所以采用`Session`来存储当前文章对应的一个时间戳最近一次的浏览记录

如果最近没有浏览 则相应的文章浏览数加一 否则不作为 原理也很简单 主要就是结合事件取监听文章浏览这个动作
 
当然也有相关的`Packages`可以使用 

- 这里推荐[cjjian](https://pigjian.com/article/laravel-visitor-registry)的一篇博文可供参考