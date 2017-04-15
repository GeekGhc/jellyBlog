---
layout: post
title: 谈谈怎么实现用户的权限管理
description: 系统的后台管理者用户的信息 其中就包括用户的角色 一个大的系统用户的角色也分很多种 最近在做后台方面的内容 索性就以
            laravel项目为例 谈谈怎么去实现用户的去权限管理
tags:
     Laravel
     ACL
     Roles
     Permission
class: post-three
comments: true
poster: /attachments/images/articles/2017-04-02/poster.jpg
---

## 介绍
用户对于一个系统而言 可能存在着多种身份 举个例子来说该用户可能是会员或者普通用户 该用户对于一篇文章是作者或者是游客 其实最终设计

到的一项就是用户的`Permission`(也就是我们通常所说的权限) 最近自己也正在做后台方面的内容 在之前也接触了不少关于用户的权限这样的场景

现在就来谈谈在`Laravel`中如何更好的去实现用户的权限管理

在`Larave`l中有两种方式去实现: **Gates**和**Policy(策略)**

这两种方式的简单理解就是路由和控制器的作用 一个方法我们即可以在路由中直接去实现 也可以通过控制器方法去处理

## 简单的实例
先举一个简单的实例来说就是一个用户对一篇帖子 如果该用户不是帖子的作者 那么他的权限就会受到限制 反之作为作者可以对帖子有更多的权限

就以`Laravel`来说 我们先去生成一个`Post Model`
```shell
$ php artisan make:model Post -m
```
在去生成相应的控制器:
```shell
$ php artisan make:controller PosrController
```
生成好控制器之后定义好`posts table`字段信息:
```php?start_inline=1
Schema::create('posts', function (Blueprint $table) {
    $table->increments('id');
    $table->integer('user_id')->unsigned();
    $table->string('title');
    $table->string('body');
    $table->timestamps();
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
});
```
再去生成一条测试数据 过程这里就不过多阐述 毕竟和本文内容关系不大

不过最后的结果就是用户**id**为**1**的用户创建了**id**为**1**的`post` 当然**id**为**2**的用户自然也就是游客的身份了

好了 接下来我们先去尝试着通过`Gates`的方式去定义用户的权限

在`app/providers/AuthServiceProvider.php`里去声明：
```php?start_inline=1
public function boot()
{
    $this->registerPolicies();

    Gate::define('user-post', function ($user, $post) {
        return $user->id == $post->user_id;
    });
}
```
这里使用了`Gates Facade`来定义 其中用户和其帖子的权限就命名为`user-post`

在此之前 先去定义好我们的路由:
```php?start_inline=1
Route::resource('posts','PostController');
```
为了看见效果 我们去`PostController`里面的`show`方法去定义
```php?start_inline=1
public function show($id)
{
    Auth::loginUsingId(2);
    $post = Post::findOrFail($id);
    if (Gate::denies('user-post', $post)) {
        abort(403,'Sorry');
    };
    return $post->title;
}
```
这里我们登录**id**为**2**的用户 那么我们在浏览器会发现该用户是无法查看`post`的`title`的 反之**id**为**1**的用户可以 因为我们赋予了该用户这个权限

当然我们也是可以指定某一个用户而并不是登录的用户
```php?start_inline=1
if (Gate::forUser($user)->allows('update-post', $post)) {
    // 指定用户可以更帖子...
}
```

我们也可以使用`authorize`这个方法去实现
```php?start_inline=1
Auth::loginUsingId(1);
$post = Post::findOrFail($id);
$this->authorize('user-post',$post);
return $post->title;
```

其实除了上面的 我们还可以通过`blade`模板

当编写 `Blade` 模板时，你可能希望页面的指定部分只展示给允许授权访问给定动作的用户。例如，你可能希望只展示更新表单给有权更新帖子的用户。这种情况下，你可以直接使用 **@can** 和 **@cannot** 指令

举例来说的话我们可以在`posts/show.blade.php`去看下
```html
<body>
<h1>{{$post->title}}</h1>
@can('user-post', $post)
    <a href="#">修改文章</a>
@endcan
</body>
```
这样就定义了 如果该用户是帖子的作者就可以更新帖子 反之则不然

## 编写策略(Policy)
之前有说在`laravel`中可以有两种方式去管理用户的权限 其中有一个就是通过创建策略

当然首先去生成相应的策略(如果你需要基本的`CURD`操作 可以给一个`tag`即`--model=xxx`)
```shell
$ php artisan make:polocy PostPolicy
```
创建完毕之后我们就会看见在`app/policies`下的`PostPolicy`这个类文件
可以想象的就是对于一个权限他必定包含了一系列的权限操作

那么在这里我们可以接着上面的来去定义一个更新的操作(这里的`owns`就是在`User Model`里面的模型判断)
```php?start_inline=1
public function update(User $user, Post $post)
{
    return $user->owns($post);
}
```

创建完毕`policy`之后我们需要像注册一个事件 命令一样的去告诉`laravel`启用这个`Policy` 还是来到 `app/providers/AuthServiceProvider.php`
```php?start_inline=1
protected $policies = [
    'App\Model' => 'App\Policies\ModelPolicy',
    'App\Post' => 'App\Policies\PostPolicy',
];
```
这样一来在`PostController`里面 我们可以直接去使用`update`这个权限协议
```php?start_inline=1
Auth::loginUsingId(2);
$post = Post::findOrFail($id);
if (Gate::denies('update', $post)) {
    abort(403,'Sorry');
};
return $post->title;
```

对于特定的用户 比如对于我们的管理员 那么管理员可以授权所有的权限 那么我们在策略里面就可以提前去声明
```php?start_inline=1
public function before($user, $ability)
{
    if ($user->isSuperAdmin()) {
        return true;
    }
}
```
这个`before`方法会在其他方法之前去执行 那么如果是管理员 则用户会有所有的权限

## 策略授权动作(Action)
之前我们在控制器里还是使用了`Gates Facade`去判断用户对一个帖子的权限 而在`Laravel`内置的`User Model`里面我们可以通过
**can** 和 **cant**来实现
```php?start_inline=1
Auth::loginUsingId(2);
$post = Post::findOrFail($id);
if(Auth::user()->cant('update',$post)){
    abort(403,'Sorry');
}
```
有的时候不需要执行模型的实例 比如去创建一篇帖子 因为这个模型的实例还没有被创建 那么这个时候我们需要传递一个类名

告诉`laravel`使用哪种策略就行了
```php?start_inline=1
use App\Post;
if ($user->can('create', Post::class)) {
    // 执行相关策略中的「create」方法...
}
```

## 策略通过中间件
`Laravel` 包含一个可以在请求到达路由或控制器之前就进行动作授权的中间件 

`Illuminate\Auth\Middleware\Authorize` 中间件被指定到 `App\Http\Kernel` 类中 **can** 键上。

我们用一个授权用户更新博帖子的例子来看看 **can中间件**的使用：
```php?start_inline=1
Route::put('/post/{post}', function (Post $post) {
    // 当前用户可以更新帖子...
})->middleware('can:update,post');
```
**can中间件**接受两个参数 第一个是需要授权的动作的名称，第二个是我们希望传递给策略方法的路由参数 当然如果是不需要指定模型实例的话
```php?start_inline=1
Route::post('/post', function () {
    // 当前用户可以创建帖子...
})->middleware('can:create,App\Post');
```
就这样提供一个类名就行了  当然还有使用`authorize`这样的`helper function` 之前我们也有提到过

使用方法其实都是一样的 具体的看下文档就知道了

## 使用数据库来保存用户权限
首先我们可以去创建一个`Model Permission`
```shell
$ php artisan make:model Permission -m
```
定义字段信息
```php?start_inline=1
Schema::create('permissions', function (Blueprint $table) {
    $table->increments('id');
    $table->string('name');
    $table->string('label')->nullable();
    $table->timestamps();
});
```
还有一个就是我们的角色`(Role)`比如会员 普通用户 和管理员 分别担当者不同的角色 对于每一个角色他的`Permission`当然也就不同了
```shell
$ php artisan make:model Role -m
```
定义字段信息
```php?start_inline=1
Schema::create('roles', function (Blueprint $table) {
    $table->increments('id');
    $table->string('name');//角色的名字
    $$table->string('label')->nullable();
    $table->timestamps();
});
```
有了`users` `permissions` `roles`这三张表 就可以描述用户在一个系统的权限 当然这三张表之间是一个多对多的关系

因为一个用户可以有多个角色 一个角色也可以是多个用户所共有的 这样一来我们还需要去生成他们之间的中间表
```shell
$ php artisan make:migration create_role_user_table --create=role_user
```
生成`permission_role`表
```shell
$ php artisan make:migration create_permission_role_table --create=permission_role
```
在每一个中间表去定义字段信息
```php?start_inline=1
Schema::create('role_user', function (Blueprint $table) {
    $table->increments('id');
    $table->integer('role_id')->unsigned()->index();
    $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
    $table->integer('user_id')->unsigned()->index();
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    $table->timestamps();
});
```
接着在`Model`去定义三者之间的关系 当然也就是我们所说的多对多的关系了
在`User Model`
```php?start_inline=1
public function roles()
{
    return $this->belongsToMany(Role::class);
}
```
`Role Model`去定义和`Permission`的关系
```php?start_inline=1
public function permissions()
{
    return $this->belongsToMany(Permission::class);
}
```
`Permission Model`定义和`Role`的关系
```php?start_inline=1
public function roles()
{
    return $this->belongsToMany(Role::class);
}
```
为了方便使用我们可以去定义一些方法 在`Role Model`里更加赋予角色权限
```php?start_inline=1
//赋予角色权限
public function givePermission(Permission $permission)
{
    return $this->permissions()->save($permission);
}
```
这样一来去`tinker`里生成一个`role`实例和`permission`实例 再去执行
```shell
$ $role->givePermission($permission)
```
就可以在我们的中间表`role_permission`里看到生成一条对应关系数据

定义完`Role`和`Permission` 现在我们可以去定义`User`和`Role` 在`app/providers/AuthServiceProvider.php`里去声明：
```php?start_inline=1
public function boot()
{
    $this->registerPolicies();
    foreach ($this->getPermissions() as $permission){
        Gate::define($permission->name,function($user) use ($permission){
            return $user->hasRole($permission->roles);
        });
    }
}
public function getPermissions()
{
    return Permission::with('roles')->get();
}
```
这个即使判断用户是否是这样的一个角色 然后就可以判断该用户是否拥有该角色的权限了

这个`hasRole`方法我们还需要在`User Model`去声明
```php?start_inline=1
public function hasRole($role)
{
    if(is_string($role)){
        return $this->roles->contains('name',$role);//admin
    }
    //如果是collection
    return !! $role->intersect($this->roles)->count();
}
```

> 这里的`hasRole`主要就是判断`$role`是否是一个**字符串**还是一个`role`的`collection`

## Middleware 后台管理
其实这样的应用场景就是你必须是`admin`这个角色的用户才能访问后台的路由 之前我们也提到过的就是可以通过中间件的方式
来决定用户的权限

首先创建管理员这个`middleware`
```shell
$ php artisan make:middleware MustBeAnAdmin
```
创建完毕之后来到这个`middleware` 我们主要就是去实现这个**handle**方法
```php?start_inline=1
public function handle($request, Closure $next)
{
    //Auth::user() 用户必须是登陆并且是管理员的身份
    if ($request->user() && $request->user()->isAdmin()) {
        dd($request->user());
        return $next($request);
    }
    return redirect('/');
}
```
在判断用户是否是管理员时可以在`User Model`去定义这个`function`
```php?start_inline=1
public function isAdmin()
{
  return $this->hasRole('admin');
}
```
当然写完我们的**handle**方法 我们还需要去`Kernel.php`注册我们这个新的`middleware`
```php?start_inline=1
protected $routeMiddleware = [
    'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
    'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
    'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
    'can' => \Illuminate\Auth\Middleware\Authorize::class,
    'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
    'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
    'admin' => \App\Http\Middleware\MustBeAnAdmin::class,
];
```

接着我们就可以在`PostController`使用这个`middleware` 我们在他的构造函数中去指定 当然我们也是可以直接在路由中去指定的
```php?start_inline=1
public function __construct()
{
    $this->middleware('admin');
}
```

这样的话如果用户是登陆进来的并且是`admin`这个角色才能访问到后台路由
不然的话就会跳转到首页 这也就实现了通过`middleware`来进行后台的管理操作

最后推荐几个我用过的感觉非常不错的针对用户权限的`Packages`
- [Laravel Permission](https://github.com/spatie/laravel-permission) 目前我的项目就是用的这个`Package`
- [Laravel Roles](https://github.com/romanbican/roles)
- [ultraware/roles](https://github.com/ultraware/roles)
