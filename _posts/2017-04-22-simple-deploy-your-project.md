---
layout: post
title: 轻松部署你的项目-Deployer
description: 实现轻松部署你的个人项目 这是一个具有模块化、代码回滚、并行任务等功能的 PHP 部署工具。
tags:
     PHP
     Deployer
     Project
class: post-four
comments: true
poster: /attachments/images/articles/2017-04-22/poster.png
---

## 安装
1.第一种方法:
```shell
curl -LO https://deployer.org/deployer.phar
mv deployer.phar /usr/local/bin/dep
chmod +x /usr/local/bin/dep
```
如果你需要其他的版本 需要升级`Deployer` 可以使用命令
```shell
$ dep self-update
```
2.`composer` 安装
```shell
$ composer require deployer/deployer --dev
```
当然你也可以使用全局安装
```shell
$ composer global require deployer/deployer
```
接着使用下面的命令:
```shell
$ php vendor/bin/dep
```
3.如果你想使用源代码部署 那么可以
```shell
$ git clone https://github.com/deployphp/deployer.git
```

接着在项目文件夹里运行
```shell
$ php ./build
```
这是会建立 `deployer.phar` 的 `Phar` 存档

> 为了方便使用 这里还是推荐第一种方式安装 如果你不是在MAC环境下 那么你可以使用全局安装

## 使用
现在我们就可以通过dep这个命令使用`Deployer`了 在你的项目目录的终端执行:
```shell
$ dep init
```
运行此命令后会给出下图的选项，可选择你的项目类型，这里我以`Laravel`项目为例 ，**so** 选择 [1] Laravel

![1](/attachments/images/articles/2017-04-22/1.png)

初始化完成后，会自动生成 `deployer.php` 文件。里面包含了基本的部署配置和任务，

且有明确的注释，你可以根据注释在适当的地方添加配置以及任务。
![2](/attachments/images/articles/2017-04-22/2.png)

我们设置好相应的`Repository` 和`server` 即可以完成部署

在`deployer.php`我们可以定义一系列的任务 举个官方的列子来说 如果我们想查看当前的目录
我们可以为这个task提供一个说明
```php?start_inline=1
desc('My task');
```
接着就是定义`task`:
```php?start_inline=1
task('pwd', function () {
    $result = run('pwd');
    writeln("Current dir: $result");
});
```
接着我们去命令行执行:
```shell
$ task pwd
```
我们会得到如下反馈
```shell
➤ Executing task pwd
Current dir: /var/www/domain.com
✔ Ok
```
现在我们可以开始我们的第一次部署 我们可以根据文件的注释填写相关的信息 如`repository`, `shared_files`


在第一次部署后会在服务器上生成下面的目录
- `releases` 包含你部署的项目的版本
- `shared`   包含你部署项目的共享文件或目录（如：Laravel 的 Storage 目录、.env 文件等 ）
- `current`  软连接到你当前发布的版本

所以如果你是`nginx`服务器 那么最后的`server root`应该这样配置
```php?start_inline=1
server {
  listen 80;
  server_name domain.org;

  root /var/www/html/current/public;

  location / {
    try_files $uri /index.php$is_args$args;
  }
}
```

release默认保存5个版本  当然你也可以修改成你希望的值
```shell
$ set('keep_releases', 10);
```
如果在部署的过程中出席那问题 你可以像在`laravel`数据库迁移一样 回滚当前的操作
```shell
$ dep rollback
```

你可以在执行一个任务之前或者之后去运行其他的任务 无非就是`before` `after`里的逻辑操作 
这个在`deployer.php`都有实例的

所以这里我们可以定义一系列的处理业务 如重启`php-fpm` 执行项目的初始化数据 就以`laravel`项目来说

就可以执行`php artisan migrate` 这些都可以在部署时自动在Task里定义完成 而你只需要给出这一系列任务的顺序就行