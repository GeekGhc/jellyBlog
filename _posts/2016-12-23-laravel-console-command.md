---
layout: post
title: Laravel console command
description: Laravel 为我们提供了不同的命令行创建方式，这样一来，我们可以向定义路由一样创建自定义的命令行 这在我们项目发布的初始化的时候
            非常的方便和必要
tags:
     Laravel
     Console
     Command
class: post-one
comments: true
poster: /attachments/images/articles/2016-12-23/poster.jpg
---

## 开始
在**laravel(5.3)**项目里`routes`文件夹下包含了需要的路由的定义 当然还有就是定义我们的`command` 也就是`console.php`这里面的定义和路由的
定义其实还是非常的象的

在`console.php`里我们是可以看到:
```php?start_inline=1
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->describe('Display an inspiring quote');
```
这里就是定义了一个`inspire` 命令 我们可以去命令行去执行:
```shell
$ php artisan inspire
```
这里其实就会随机返回给我们一句名言警句

在这里去我们就可以自定义一个简单的命令 我们去简单声明一下
```php?start_inline=1
Artisan::command('hello', function () {
    $this->comment("Hello!!");
});
```
现在再去命令行执行
```shell
$ php artisan 
```
那么我们就会看到有`php artisan hello`这个命令了

我们而是可以是去传递参数的 比方说是这样:
```php?start_inline=1
Artisan::command('hello {name}', function () {
    $this->comment("Hello ".$this->argument('name'));
})->describe('Say Hello to somebody');
```

如果想去为这条命令生成一个说明的话可以直接在后面加上`describe`(就像之前的那样)

和很多的命令一样 如果对命令的参数或其他有疑问的话 就可以借助help这个tag去查看
```shell
$ php artisan help hello
```

## 自定义 **Artisan** 命令
之前基本熟悉了`artisan` 命令的作用 那么现在我们可以自己去自定义一个命令来实现更多的业务需求

我们在命令行执行:
```shell
$ php artisan make:command InstallProject 
```

> 特别的在**5.1**之前的版本是执行`php artisan make:cnsole xxxx` 

生成的文件就在`App\Console\Command`下

其中我们需要注意的是
```php?start_inline=1
protected $signature = 'command:name';
```
定义了我们需要在命令行输入的命令 举个例子来说如果是一个Blog项目 那么我们就可以这样去定义
```php?start_inline=1
protected $signature = 'blog:install';
```
定义完命令之后 下面的`handle function`就负责我们最后的输出

这里先做一个小的测试 就是去打印一些信息提示:
```php?start_inline=1
public function handle()
{
    $this->info("This is test data");
}
```

会后我们会需要去`Kernel`文件去注册我们刚定义好的`command`
```php?start_inline=1
protected $commands = [
    \App\Console\Commands\InstallProject::class
];
```

写好之后再去执行:
```shell
$ php artisan 
```
就会看到我们刚定义好的命令了

我们可以去执行一下这个命令是可以看到打印出来的数据的
```shell
$ php artisan blog:install
```

和之前在路由里面去定义我们的命令一样 我们同样可以去传递参数
```php?start_inline=1
protected $signature = 'blog:install {name}';
```

在去修改一下`handle`方法
```php?start_inline=1
public function handle()
{
    $this->info("This is test data and name is ".$this->argument('name'));
}
```

如果需要可选参数的话就和路由的要求一样 只需要在`name`去声明
```php?start_inline
protected $signature = 'blog:install {name?}';
```

## 实际项目应用
1.更多的时候我们可能需要在项目初始化时需要用户手动去提交一些信息 比如用户名 邮箱等等
这样的应用场景的话我们就需要一种交互式输入 先来一个简单的栗子 :smile: 

```php?start_inline
public function handle()
{
    $name = $this->ask('请输入你的名字?');
    $email = $this->ask('请输入你的邮箱?');
    $data = [
        'name'     => $name,
        'email'    => $email,
    ];
    $this->register($data);
}
```
然后就可以去定义这个`register function`
```php?start_inline=1
public function register($data)
{
    $this->info($data['name']);
}
```
这样的话就可以拿到用户输入的数据的话 这样看的话好像用处不到 其实在拿到这组数据之后我们就可以进行验证 并去创建一个用户数据

特别是对一个后台 这样去创建一个管理员还是有必要的

其实这样的交互式输入还有很多 比如给用户的选择 具体的看下文档就明白了

2.调用其他命令
其实这个实现起来也很容易 也就是去调用`call`这个方法
```php?start_inline=1
public function handle()
{
     $this->call('key:generate');
     $this->call('migrate');
     $this->info('数据表创建成功');
}
```

> 当然前提是数据库是对应的你对应的数据库 如果在`homestead`下开发 这些也就不用管他了
