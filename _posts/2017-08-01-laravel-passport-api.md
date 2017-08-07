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

在Laravel5.3时`Taylor`就发布了`passport`的`package` 用于开发 `OAuth` 服务端 可以作为`Auth`验证


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



## 相关链接
- [Laravel Passport GitHub地址](https://github.com/laravel/passport)
- [Laravel Passport 官方文档](https://laravel.com/docs/master/passport)
- [Laravel Passport 中文文档](http://d.laravel-china.org/docs/5.3/passport)