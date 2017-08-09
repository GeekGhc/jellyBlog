---
layout: post
title: Redis在项目中的应用实例
description: 如今网站基本都集成了非常不错的缓存驱动 之前认识了Redis的基本使用  那么这里就结合一个帖子的浏览的应用
            实例去深入了解这些缓存机制的应用
tags:
     Laravel 
     Cache
     Redis
class: post-seven
comments: true
poster: /attachments/images/articles/2017-06-03/poster.jpg
---


既然初步了解`Redis`在`Laravel`中的应用 那么我们试想这样的一个应用场景  一个文章或者帖子的浏览次数的统计 如果只是每次增加一个浏览量

就到数据库新增一个数据 如果请求来那个太大这对数据库的消耗也就不言而喻了吧  那我们是不是可以有其他的解决方案

这里的解决方案就是 即使你的网站的请求量很大 那么每次增加一个访问量就在缓存中去进行更改  至于刷新`Mysql`数据库可以自定义为

多少分钟进行刷新一次或者访问量达到一定数量再去刷新数据库 这样数据也是准确的 效率也比直接每次刷新数据库要高出许多了

既然给出了相应的解决方案  我们就开始实施

我们以一篇帖子的浏览为例  我们先去创建对应的控制器
```shell
$ php artisan make:controller PostController
```

再去生成需要用到的 `Model`
```shell
$ php artisan make:model Post -m
```

填写`posts`的迁移表的字段内容
```php?start_inline=1
Schema::create('posts', function (Blueprint $table) {
    $table->increments('id');
    $table->string("title");
    $table->string("content");
    $table->integer('view_count')->unsigned();
    $table->timestamps();
});
```

还有就是我们测试的数据的`Seeder`填充数据
```php?start_inline=1
$factory->define(App\Post::class, function (Faker\Generator $faker) {
    return [
        'title' => $faker->sentence,
        'content' => $faker->paragraph,
        'view_count' => 0
    ];
});
```

定义帖子的访问路由
```php?start_inline=1
Route::get('/post/{id}', 'PostController@showPost');
```

当然我们还是需要去写我们访问也就是浏览事件的(在`app/providers/EventServiceProvider`中定义)
```php?start_inline=1
protected $listen = [
        'App\Events\PostViewEvent' => [
//            'App\Listeners\EventListener',
            'App\Listeners\PostEventListener',
        ],
    ];
```

执行事件生成监听
```shell
$ php artisan event:generate
```

之前定义了相关的路由方法  现在去实现一下:
```php?start_inline=1
public function showPost(Request $request,$id)
{
    //Redis缓存中没有该post,则从数据库中取值,并存入Redis中,该键值key='post:cache'.$id生命时间6分钟
    $post = Cache::remember('post:cache:'.$id, $this->cacheExpires, function () use ($id) {
        return Post::whereId($id)->first();
    });

    //获取客户端IP
    $ip = $request->ip();
    //触发浏览量计数器事件
    event(new PostViewEvent($post, $ip));

    return view('posts.show', compact('post'));
}
```

这里看的出来就是以`Redis`作为缓存驱动 同样的  会获取获取的`ip`目的是防止同一个`ip`多次刷新来增加浏览量

同样的每次浏览会触发我们之前定义的事件  传入我们的`post`和`id`参数

> Redis的key的命名以:分割  这样可以理解为一个层级目录 在可视化工具里就可以看的很明显了


接下来就是给出我们的`posts.show`的视图文件
```html
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap Template</title>
    <!-- 新 Bootstrap 核心 CSS 文件 -->
    <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <style>
        html,body{
            width: 100%;
            height: 100%;
        }
        *{
            margin: 0;
            border: 0;
        }
        .jumbotron{
            margin-top: 10%;
        }
        .jumbotron>span{
            margin: 10px;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-xs-12 col-md-12">
            <div class="jumbotron">
                <h1>Title:{{$post->title}}</h1>
                <span class="glyphicon glyphicon-eye-open" aria-hidden="true"> {{$post->view_count}} views</span>
                <p>Content:{{$post->content}}</p>
            </div>
        </div>
    </div>
</div>

<!-- jQuery文件-->
<script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script>

</script>
</body>
</html>
```


初始化我们的事件就是接收一下这些参数即可
```php?start_inline=1
class PostViewEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $id;
    protected $post;


    /**
     * PostViewEvent constructor.
     * @param Post $post
     * @param $id
     */
    public function __construct(Post $post, $id)
    {
        $this->post = $post;
        $this->id = $id;
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

最主要的还是编写我们的监听事件:
```php?start_inline=1
class PostEventListener
{
    /**
     * 同一post最大访问次数,再刷新数据库
     */
    const postViewLimit = 30;

    /**
     * 同一用户浏览同一post过期时间
     */
    const ipExpireSec   = 300;

    /**
     * Create the event listener.
     *
     */
    public function __construct()
    {

    }


    /**
     * @param PostViewEvent $event
     */
    public function handle(PostViewEvent $event)
    {
        $post = $event->post;
        $ip   = $event->ip;
        $id   = $post->id;
        //首先判断下ipExpireSec = 300秒时间内,同一IP访问多次,仅仅作为1次访问量
        if($this->ipViewLimit($id, $ip)){
            //一个IP在300秒时间内访问第一次时,刷新下该篇post的浏览量
            $this->updateCacheViewCount($id, $ip);
        }
    }

    /**
     * 限制同一IP一段时间内得访问,防止增加无效浏览次数
     * @param $id
     * @param $ip
     * @return bool
     */
    public function ipViewLimit($id, $ip)
    {
        //redis中键值分割都以:来做，可以理解为PHP的命名空间namespace一样
        $ipPostViewKey    = 'post:ip:limit:'.$id;
        //Redis命令SISMEMBER检查集合类型Set中有没有该键,Set集合类型中值都是唯一
        $existsInRedisSet = Redis::command('SISMEMBER', [$ipPostViewKey, $ip]);
        //如果集合中不存在这个建 那么新建一个并设置过期时间
        if(!$existsInRedisSet){
            //SADD,集合类型指令,向ipPostViewKey键中加一个值ip
            Redis::command('SADD', [$ipPostViewKey, $ip]);
            //并给该键设置生命时间,这里设置300秒,300秒后同一IP访问就当做是新的浏览量了
            Redis::command('EXPIRE', [$ipPostViewKey, self::ipExpireSec]);
            return true;
        }
        return false;
    }

    /**
     * 达到要求更新数据库的浏览量
     * @param $id
     * @param $count
     */
    public function updateModelViewCount($id, $count)
    {
        //访问量达到300,再进行一次SQL更新
        $post = Post::find($id);
        $post->view_count += $count;
        $post->save();
    }

    /**
     * 不同用户访问,更新缓存中浏览次数
     * @param $id
     * @param $ip
     */
    public function updateCacheViewCount($id, $ip)
    {
        $cacheKey = 'post:view:'.$id;
        //这里以Redis哈希类型存储键,就和数组类似,$cacheKey就类似数组名  如果这个key存在
        if(Redis::command('HEXISTS', [$cacheKey, $ip])){
            //哈希类型指令HINCRBY,就是给$cacheKey[$ip]加上一个值,这里一次访问就是1
            $save_count = Redis::command('HINCRBY', [$cacheKey, $ip, 1]);
            //redis中这个存储浏览量的值达到30后,就去刷新一次数据库
            if($save_count == self::postViewLimit){
                $this->updateModelViewCount($id, $save_count);
                //本篇post,redis中浏览量刷进MySQL后,就把该篇post的浏览量清空,重新开始计数
                Redis::command('HDEL', [$cacheKey, $ip]);
                Redis::command('DEL', ['laravel:post:cache:'.$id]);
            }
        }else{
            //哈希类型指令HSET,和数组类似,就像$cacheKey[$ip] = 1;
            Redis::command('HSET', [$cacheKey, $ip, '1']);
        }
    }
}

```

最后可以通过我们的工具查看具体效果

![1](/attachments/images/articles/2017-06-03/1.png)

## 相关链接
- [Redis 命令](https://redis.io/commands)