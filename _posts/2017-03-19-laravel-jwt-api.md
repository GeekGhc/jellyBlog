---
layout: post
title: Laravel API结合Dingo API和JWT
description: 在Web开发，Api开发是一项非常重要的技术，这里就以Laravel项目实例来开发API 熟悉下API的具体的流程
tags:
     Laravel
     API
     JWT
     Dingo
class: post-seven
comments: true
poster: /attachments/images/articles/2017-03-19/poster.jpg
---

## 介绍
关于`API`的开发 不得不提的就是可以利用`Dingo`来构建更加强大的`API` 这样我们可以更好的去实现`API`认证和请求

> 本文基于laravist的Api教程 作为笔记参考

## 安装
首先当然是去[安装页面](https://github.com/dingo/api/wiki/Installation) 根据提供的包进行下载 在`laravel`项目中就是`require`这个`package`
```php?start_inline=1
"dingo/api": "1.0.*@dev"
```
接着在`laravel`项目的`config`的`app.php`去添加服务
```php?start_inline=1
'providers' => [
    Dingo\Api\Provider\LaravelServiceProvider::class
]
```
再去生成相应的配置文件
```shell
$ php artisan vendor:publish --provider="Dingo\Api\Provider\LaravelServiceProvider"
```
如果需要实现`jwt` 同样的也是去[安装页面](https://github.com/tymondesigns/jwt-auth/wiki/Authentication) 安装这个`package`
```php?start_inline=1
"require": {
    "tymon/jwt-auth": "0.5.*"
}
```
添加对应的服务:
```php?start_inline=1
'Tymon\JWTAuth\Providers\JWTAuthServiceProvider::class'
```
当然也是需要去配置一下他的`alias`
```php?start_inline=1
'JWTAuth' => Tymon\JWTAuth\Facades\JWTAuth::class,
'JWTFactory' => Tymon\JWTAuth\Facades\JWTFactory::class
```
生成配置文件
```shell
$ php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"
```
生成一个`key`
```shell
$ php artisan jwt:generate
```

## 使用
1.这个时候我们是在开发的环境下 还需对`Dingo`进行相应的配置 在`.env`文件里
```php?start_inline=1
API_STANDARDS_TREE=vnd
```
添加前缀
```php?start_inline=1
API_PREFIX=api
```
填写版本 这个我们之前自己写测试的时候也是提供的**v1**以此来区别版本
```php?start_inline=1
API_VERSION=v1
```
开启`Debug`模式
```php?start_inline=1
API_DEBUG=true
```

一开始可以去实现一个`jwt`的`aut`h认证 在`config/api.php`里配置
```php?start_inline=1
'auth' => [
    'basic'=>function($app){
        return new  Dingo\Api\Auth\Provider\Basic($app['auth']);
    },
    'jwt'=>function($app){
        return new  Dingo\Api\Auth\Provider\JWT($app['Tymon\JWTAuth\JWTAuth']);
    }
],
```
这样我们即实现了在`Dingo`的`jwt`认证

2.既然是`auth`认证我们就需要先注册刚配置好的认证 即在`Kernel`文件里添加
```php?start_inline=1
'jwt.auth'=> \Tymon\JWTAuth\Middleware\GetUserFromToken::class,
'jwt.refresh'=>\Tymon\JWTAuth\Middleware\RefreshToken::class,
```

3.添加`api`路由
在`laravel 5.2`以后的版本我们可以直接放在`routes/api.php`里
```php?start_inline=1
$api = app('Dingo\Api\Routing\Router');
```
为了区分开来 我们可以在`app`目录下新建`Api`目录然后在新建`Controllers`和在`Https`目录一样 在这里用来管理`api`的控制器

在这个目录下新建一个基本的控制器`BaseController`
```php?start_inline=1
<?php
namespace App\Api\Controllers;
use App\Http\Controllers\Controller;
use Dingo\Api\Routing\Helpers;
class BaseController extends Controller
{
    use Helpers;
}
```
所以这个时候我们再去创建对数据表的`api`时就可以继承这个表而使用`Dingo Api`的`Helpers` 比如在此目录下创建`PostsController`

这样我们就可以在`routes`里根据`Dingo`提供的方法去定义想要的`api`了
```php?start_inline=1
$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function ($api) {
    $api->group(['namespace' => 'App\Api\Controllers'], function ($api) {
        $api->get('lessons','PostsController@index');
        $api->get('lessons/{id}','PostsController@show');
    });
});
```
在`PostsController`的`index`返回所有数据 那么再去访问[http://localhost:8000/api/lessons](http://localhost:8000/api/lessons)
就可以看到所有的数据了

> 在这里路由的定义就是这样 这于我们之前自己写的路由方式还是不太一样的 因为这是`Dingo`为我们封装好的路由

当然和之前的一样 我们需要对数据字段进行映射 那么我们可以在`Api`目录下新建`Transformer`目录 然后在这个目录下新建`PostTransformer`
```php?start_inline=1
<?php
namespace App\Api\Transformer;
use App\Post;
use League\Fractal\TransformerAbstract;
class PostTransformer extends TransformerAbstract
{
    public function transform(Post $post)
    {
        return [
            'title' => $post['title'],
            'content' => $post['body'],
            'is_free' => (boolean)$ppost['free']
        ];
    }
}
```
在这里我们是可以使用`Dingo API`的`Transformer`即`TransformerAbstract`

这样写完我们就可以在控制器里去重新返回所有信息
```php?start_inline
 public function index()
{
    $lessons =  Post::all();

    return $this->collection($post,new PostTransformer());
}
```

> 这里的`PostTransformer`是 `App\Api\Transformer\PostTransformer`

当然还有之前的`show`方法 因为他的返回状态信息之前都是自己写的 其实在`Dingo`里也有相应的方法
```php?start_inline=1
public function show($id)
{
    $lesson = Lesson::find($id);
    if(! $lesson){
        return $this->response->errorNotFound('Lesson not found');
    }
    return $this->item($lesson,new LessonTransformer());
}
```

## 结合Jwt的auth认证
在`App\Api\Controllers`目录下新建`AuthController`并继承之前定义好的`BaseController`

在`jwt`的[创建token的页面](https://github.com/tymondesigns/jwt-auth/wiki/Creating-Tokens) 我们就可以使用它的`authenticate`方法
```php?start_inline=1
public function authenticate(Request $request)
{
    // grab credentials from the request
    $credentials = $request->only('email','password');
    try {
        // attempt to verify the credentials and create a token for the user
        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'invalid_credentials'], 401);
        }
    } catch (JWTException $e) {
        // something went wrong whilst attempting to encode the token
        return response()->json(['error' => 'could_not_create_token'], 500);
    }
    // all good so return the token
    return response()->json(compact('token'));
}
```

为了执行这个方法 可以去路由中定义
```php?start_inline=1
$api->version('v1', function ($api) {
    $api->group(['namespace' => 'App\Api\Controllers'], function ($api) {
        $api->post('user/login','AuthController@authenticate');
        $api->post('user/register','AuthController@register');
    });
});
```
这个时候再去查看一下我们的路由的话就会看到新定义的`post`路由

为了验证请求的结果 我们可以使用`postman`这个`chrome`工具 去请求[http://localhost:8000/api/user/login](http://localhost:8000/api/user/login)

这个时候是会返回`{"error":"invalid_credentials"}`

为了能够正确通过我们可以在`body`部分给出用户邮箱和密码(用户可用`thinker`创建一个) 这个时候就会正确返回一个`token`
![1](/attachments/images/articles/2017-03-19/1.png)

这个`token`就是用来保护有`jwt`认证下的信息 我们可以为`Post`的数据添加一个`middleware`
```php?start_inline=1
$api->group(['middleware'=>'jwt.auth'],function ($api){
    $api->get('posts',PostsController@index');
    $api->get('posts/{id}','PostsController@show');
});
```
所以这个时候如果我们没有之前`authenticate`返回的`token`的话 我们是无法访问`api/posts`和`api/post/{id}`的

只有加上返回的`token`我们才能继续访问到之前的数据信息 如`/api/posts?token=xxxxxx`

既然只有登录的用户才能访问到这些资源 那么我们是不是也可以去拿到登录的用户

在`jwt`的`Authentication`里就提供了`getAuthenticatedUser`这个方法 所以为了查看效果 可以去注册一条路由
```php?start_inline=1
$api->group(['middleware'=>'jwt.auth'],function ($api){
    $api->get('user/me','AuthController@getAuthenticatedUser');
});
```
接着在`AuthController`里去定义这个方法
```php?start_inline=1
public function getAuthenticatedUser()
{
    try {
        if (! $user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['user_not_found'], 404);
        }
    } catch (TokenExpiredException $e) {
        return response()->json(['token_expired'], $e->getStatusCode());
    } catch (TokenInvalidException $e) {
        return response()->json(['token_invalid'], $e->getStatusCode());
    } catch (JWTException $e) {
        return response()->json(['token_absent'], $e->getStatusCode());
    }
    // the token is valid and we have found the user via the sub claim
    return response()->json(compact('user'));
}
```

所以说这时候去访问[http://localhost:8000/api/user/me?token=xxx](http://localhost:8000/api/user/me?token=)就可以拿到当前登录的用户信息了



## 相关链接
- [Dingo/api](https://github.com/dingo/api)
- [Dingo/api 配置页面](https://github.com/dingo/api/wiki/Configuration)
- [tymondesigns/jwt-auth](https://github.com/tymondesigns/jwt-auth)
