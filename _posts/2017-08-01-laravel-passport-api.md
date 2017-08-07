---
layout: post
title: Laravel Passport 之API授权
description: 我们常常会遇到多账号系统的认证这样的一个应用场景 那么在Laravel中 我们常常会用Passport获取Token
               来进行密码验证
tags:
     Laravel
     Passport
     API
class: post-two
comments: true
poster: /attachments/images/articles/2017-08-01/poster.jpg
---

在`Laravel5.3`时`Taylor`就发布了`passport`的`package` 用于开发 `OAuth` 服务端 可以作为`Auth`验证

其实为什么最近又在整理这个呢  因为我做安卓也有近两个月的时间  期间也接触了不少的客户端的开发 此时我发现再去

研究下`laravel`的`passport`的`API`认证真的会深有体会  之前在写服务端的API只是集成了`Dingo`和`jwt`认证  而对于与多账号系统的认证体会不深

所以这几天想写点下来  也会自己以写安卓客户端做更好的服务和认证

这里新建一个项目 以**5.3**为例

新建完项目之后 开始引入我们的 [passport](https://github.com/laravel/passport) 现在的话应该已经是3.1的版本

可以在`composer.json`里添加:
```php?start_inline=1
 "laravel/passport": "^3.0"
```
在终端执行:
```shell
$ composer update
```
在 `app/config/app.php` 添加服务:
```php?start_inline=1
 Laravel\Passport\PassportServiceProvider::class,
```
当然还需要安装项目依赖(也可以适应`yarn`):
```shell
$ npm install
```

`Passport` 使用服务提供者注册内部的数据库迁移脚本目录，所以上一步完成后，你需要更新你的数据库结构。

`Passport` 的迁移脚本会自动创建应用程序需要的客户端数据表和令牌数据表:
```shell
$ php artisam migrate
```

接下来我们需要运行`passport:install` 命令来创建生成安全访问令牌时用到的加密密钥

当然这条命令也会创建「私人访问」客户端和「密码授权」客户端(这些解释文档上解释的也很清楚)
```shell
$ php artisan passport:install
```
具体表现在`oauth_clients` 这张表会新增两条数据 

执行完毕后在`User Model`了添加`HasApiTokens` 这个 `Trait` 这会为我们提供一些辅助函数
```php?start_inline=1
class User extends Authenticatable
{
    use HasApiTokens,Notifiable;
}
```
接着我们在 `AuthServiceProvider` 服务中添加路由方法(函数会注册一些发放令牌等一些必要的路由)
```php?start_inliine=1
public function boot()
{
    $this->registerPolicies();

    Passport::routes();
}
```

> 需要的话可以执行`php artisan route:list`这些路由在之后也会用到

最后还得需要在`config/auth.php`中将`api`的驱动配置为`passport` 这样的话我们的`api`请求时会使用
`Passport`的`TokenGuard`
```php?start_inline=1
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
]
```
我们可以注册一个用户接下来  可以使用`Laravel`自带的 `auth`登录注册
```shell
$ php artisan make:auth
```
这样访问首页 去注册一个账号 

为了使用这些`api` 我们可能需要一些前端代码  当然在`passport`中也预定了一些`vue`组件 我们如果嫌麻烦直接使用他所提供的
```shell
$ php artisan vendor:publish --tag=passport-components
```
使用这些组件时 我们需要去注册这些组件 在`app.js`中添加给我们的组件
```php?start_inline=1
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue')
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue')
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue')
);
```

接下来就是去模板中使用客户端的访问和私人令牌
```php?start_inline=1
<passport-clients></passport-clients>
<passport-authorized-clients></passport-authorized-clients>
<passport-personal-access-tokens></passport-personal-access-tokens>
```
我们会看到创建客户端和 `assess token`
![1](/attachments/images/articles/2017-08-01/1.png)

我们可以去创建一个客户端  因为我们的数据要为很多的客户端服务  如果一个客户端需要访问我们的数据我们就可以为他创建一个客户端

其实这样的应用场景可以想象的就是 当我们比如安卓的`app`需要使用服务端的数据  可能多个`app`会使用到同一组数据

那么为了辨识  我们就需要为每个客户端创建一个`client` 并提供一个回调地址

如果做过第三方授权的就知道了  无论我们是做分享还是授权登陆  我们需要为我们这个客户端提供`appID`,回调地址

所以这里我们可以先去创建一个客户端

应户名就为`codespace` 回调`url`为:`http://laravel-passport.dev/callback`

创建完成之后就会给出我们的`clientId`和`clientSecret`这些是不是很熟悉  其实我们的服务端为我们生成的也就是客户端所需要的这些`id`和`secret`

而这个在数据库中的表现就是`oauth_clients`表中  生成了对应的客户端数据(也就是我们刚刚所创建的)

接下来就是模拟客户端去发起请求 这里我新建了另一个项目`passport-client`

进入刚创建的项目 因为之前我们已经创建了一个客户端 那么开发者会使用此客户端的 ID 和密钥向你的应用程序请求一个授权码和访问令牌。

首先,接入应用会将用户重定向到你应用程序的 `/oauth/authorize` 路由上 在刚创建项目的路由添加
```php?start_inline
Route::get('/redirect', function () {
    $query = http_build_query([
        'client_id' => 'client-id',
        'redirect_uri' => 'http://example.com/callback',
        'response_type' => 'code',
        'scope' => '',
    ]);

    return redirect('http://your-app.com/oauth/authorize?'.$query);
});
```
正如我们所看到的当客户端接受到授权请求你时 会显示默认页面 用户可以取消或者允许 用户确认之后才能重定向到指定的
`resirect_uri`这和我们平时手机`app`授权登录是一样的流程  只有用户允许授权了  才会跳转到相应页面

当用户允许操作之后会跳转到对应的`redirect_uri`那么我们定义的是一个`callback`

所以我们会增加一个路由
```php?start_inline=1
Route::get('callback','OAuthController@oauth');
```
当然我们还是要去实现这样的回调方法
```php?stRt_inline=1
public function oauth(Request $request)
{
    $http = new GuzzleHttp\Client;

    $response = $http->post('http://your-app.com/oauth/token', [
        'form_params' => [
            'grant_type' => 'authorization_code',
            'client_id' => 'client-id',
            'client_secret' => 'client-secret',
            'redirect_uri' => 'http://example.com/callback',
            'code' => $request->code,
        ],
    ]);

    return json_decode((string) $response->getBody(), true);
}
```
相关代码对照着文档看应该没什么问题

值得注意的是上面的客户端和服务端的访问地址根据每个人所定义的地址 在这里我们需要修改的是我们客户端

拿到的`client_id`和`client_secret`这是我们开发者在开发客户端都可以拿得到的 填写上我们之前创建客户端所生成的值就行


既然有了这些信息  客户端就可以发起请求  我们访问`oauth`这个路由  这样应该会跳转到服务端的授权页面
![2](/attachments/images/articles/2017-08-01/2.png)

这个过程和我们平时的无论是web端还是移动端的授权是一样的  也就是不同的客户端拿到指定的客户端`key`之后访问到的服务端的内容

这个时候我们点击授权的话就会跳转到`callback`这个`url`这里 也就相当于一个回调地址

我们已经在`callback`写了我们客户端的处理内容 如果执行到的话我们应该会得到一个`access_token`

当然授权之后我们也可以拿到一个`refresh_token`

我们有了这个`access_token` 就可以去请求我们的`api`数据了  还记得一开始我们就修改了我们`api`的`driver`为**passport**

所以我们理所当然的得用这个`access_token`去请求我们需要的数据

其中在`api.php`这个路由文件中已经默认为我们创建了一个关于用户的`api` 简单来说就去拿到我们之前注册的用户数据好了

所以在用`postman`去访问这个`http:///your-server.com/api/user`时 一开始是访问不到的
![3](/attachments/images/articles/2017-08-01/3.png)

只有经过之前的授权认证 拿到我们的额`access_token` 这个时候加上这个参数再去访问这个url时我们就可以成功访问到了用户数据

## 总结
其实整个的过程就是我们所熟悉的`oauth`认证过程 服务端创建一个客户端数据  这也就是对应着我们去一些开发平台盛情得到我们的
`ID`和`key`等相关信息  这样服务端会存储这个客户端的信息

我们在不同的客户端当然对应着不同的客户端`id`  我们在客户端如`app`或者网站去发起客户端的请求 

当然这些请求会附带上我们申请得到的`ID`和`key`这样服务端平台校验正确后会返回一个授权页面 这时候用户可以选择授权或者取消

试想一下我们平时在网站或者`app`利用第三方登录时的场景就知道了  当用户给予授权之后

会执行到客户端的回调地址 在这个回调函数中我们会处理自己的逻辑 比如存储用户的基本信息等

当然也会拿到服务端给我们的`access_token`和`refresh_token`这也就是我们平常所说的令牌

拿到令牌之后我们就可以对服务端的一些数据进行操作 比如获取一个用户的信息 用户的相关资料等

如果没有这个`token`的话是无法访问的 因为我们之前配置的就是`api`的`driver`为我们的`passport ` 

所以相应的访问数据我们是需要拿到这个`token`的
## 相关链接
- [Laravel Passport GitHub地址](https://github.com/laravel/passport)
- [Laravel Passport 官方文档](https://laravel.com/docs/master/passport)
- [Laravel Passport 中文文档](http://d.laravel-china.org/docs/5.3/passport)