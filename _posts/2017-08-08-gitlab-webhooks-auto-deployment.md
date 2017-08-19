---
layout: post
title: GitLab [Webhooks] 实现自动化服务器部署
description: 利用的GitLab创建私人仓库 通过钩子实现代码推送时能同步到服务器 这样也就实现了自动化的部署
tags:
     github
     deployment
     server
class: post-four
comments: true
poster: /attachments/images/articles/2017-08-08/poster.jpg
---

## 简介

我们在部署我们的`web`应用时 我们一般会寻求一些云平台服务器部署 当然也可以直接在服务器里拉取远程仓库的代码

当然我们也可以实现通过`Webhooks`(钩子)来实现服务器与远程仓库代码的同步

这样一来我们在本地提交功能分支到仓库中  仓库也会同步到服务器  这样我们就无需自己手动去同步项目代码

## 选择
我们的项目大都托管在`Github`  当然`Github`在建立私有仓库时是需要付费的 那么在自己的网站部署时 我们完全可以选择其他的平台

目前来说我们需要试下`Webhooks`自动化部署  那么我们可以选择自己合适的平台 这里我选择[GitLab](https://gitlab.com/)

当然国内的话还可以选择 [Coding](https://coding.net)  和  [码云](http://git.oschina.net)

这些在国内都是不错的代码托管平台 你都可以创建自己的私有项目仓库

之前我的网站项目是托管在`Coding`  但是近期我重写我的网站项目  因为`GitLab`本身可以建立自己的私有仓库并且没有限制

同样的也可以设置成员的权限 分支的工作流也十分清晰强大 现在很多的公司也都选择了`GitLab` `so` 我还是会去尝试一下新的服务

## 前期准备
和`Github`一样  我们都要去生成一个`ssh key`这样我们以后在提交项目和项目分支时就可以免去身份验证

在本地终端执行
```shell
$ ssh-keygen -t rsa -C "youremail@example.com"
```
这里填写你`GitLLab`注册的邮箱即可(最好保持一致)

你可以一直默认下去 当然为了和之前的发生冲突 你可以自己在生成的时候重新命名

我这里生成的是`gitlab_rsa`和`gitlab_rsa.pub`

接着在命令行执行(添加刚生成的公钥和私钥)
```shell
eval $(ssh-agent -s)
ssh-add ~/.ssh/gitlab_rsa
```
查看我们的公钥内容
```shell
cat ~/.ssh/gitlab_rsa.pub
```
拿到我们的公钥内容 我们就可以去`GitLab`添加我们的`sh key`

![1](/attachments/images/articles/2017-08-08/1.png)

添加完毕之后当然是测试本地连接
```shell
$ ssh -T git@gitlab.com
```
如果没有问题的话 会回馈给我们正确的欢迎信息

> 具体的生成信息可以看官方的 [ssh文档](https://gitlab.com/help/ssh/README)

我们在此之前在`GitLab`已经上传了我们的项目 在项目中的`Setting->Integrations`里添加脚本钩子

比如这边我添加的url是`http://kobeman.com/hook/index.php`

然后填入的`token`是`ispace`

现在可以去服务器的站点目录下克隆远程仓库的项目 这里我的站点目录是`/data/www`

那么在这个目录下克隆我们远程的项目 克隆完毕后 当然这里以`Laravel`项目为例 完成一些权限 这些可自行查阅

能够成功跑起来我们的项目就**ok**  这里我访问的网址是`www.kobeman.com`  下面就需要添加钩子文件

这里我们项目的根目录 这里可以是`public`目录下新建`hook`目录  添加一个`index.php`  具体内容如下

> 具体代码我已经放在我的[gist](https://gist.github.com/GeekGhc/43b0927de6016578f741bc6beab3023a)上  如果有什么问题欢迎提出`issue`

```php?start_inline=1
<?php

error_reporting(1);

$target = '/data/www/ISpace'; // 生产环境web目录

$token = 'ispace'; //GitLab 添加的token
$wwwUser = 'root';
$wwwGroup = 'root';


if (empty($_SERVER['HTTP_X_GITLAB_TOKEN']) || $_SERVER['HTTP_X_GITLAB_TOKEN'] !== $token) {
    exit('error request');
}

/*if($_SERVER['HTTP_X_GITLAB_TOKEN'] == $token){
    echo "校验成功";
}*/

//$repo = $json['repository']['name'];

// $cmds = array(
//     "cd $target && git pull",
//     "chown -R {$wwwUser}:{$wwwGroup} $target/",
// );

// foreach ($cmds as $cmd) {
//     shell_exec($cmd);
// }

chdir($target);

$cmd = "sudo -Hu root git pull";

shell_exec($cmd);
```

这里的钩子文件需要注意以下几点
- `php`配置里需要注释掉`shell_exec`这些被禁用的函数 详见[shell_exec](https://www.zhihu.com/question/57879484?from=profile_question_card)
- 执行命令时切换到管理员用户最好
- 查看是否进入你的项目目录 这里我是通过`chdir`进入项目目录 因为`cd`命令是没有用的 详见[Can't 'cd' with PHP shell_exec()](https://stackoverflow.com/questions/12521053/cant-cd-with-php-shell-exec)


这里为什么我们需要获取这个`$_SERVER`的参数呢 因为`GitLab`是通过`post`请求这个地址 所以为了验证之前填入的`token`

我们这里是去验证他的请求头部  因为他是以请求头部传递给我们的  如图所示
![1](/attachments/images/articles/2017-08-08/1.png)

为了了解他的头部到底包含了什么信息  我们可以都打印出来看下
![2](/attachments/images/articles/2017-08-08/2.png)

所以说如果我们验证这个`token`成功的话再去进入到项目目录 执行`git pull`拉取我们最新的代码 这样也就实现了
自动化的代码部署  在验证过程中我打印了下这个 `$_SERVER['HTTP_X_GITLAB_TOKEN']`

![3](/attachments/images/articles/2017-08-08/3.png)

这样一来下次再去提交我们的最新的功能代码时就可以哦同步到我们的服务器

## 相关链接
- [Gist 地址](https://gist.github.com/GeekGhc/43b0927de6016578f741bc6beab3023a)
- [GitLab 官网](https://gitlab.com/)
- [Coding 官网](https://coding.net)
- [码云 官网](http://git.oschina.net)
- [GitLab key生成](https://gitlab.com/help/ssh/README)

