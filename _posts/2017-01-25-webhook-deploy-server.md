---
layout: post
title: Webhook 自动部署
description: 在使用Git来管理自己的项目的时候，我们可以通过Coding的Webhook来进行一些自动的代码部署，
             这样每一次提交代码后就可以自动部署 省去了很多的麻烦 也提高了效率
tags:
     SSH
     Server
     Github
class: post-two
comments: true
poster: /attachments/images/articles/2017-01-25/poster.jpg
---

## 介绍
在实现服务器的自动化的部署时 我们就可以利用到之前讲ssh免登陆服务器和免密码推送代码的那篇博文了

这里推荐两篇文章 这也是`JellyBool`教主所推荐的 但整个部署过程还是得自己亲自去实验体会下这个过程 至少我之前还是遇到了

不少的坑  现在有时间稍微整理一下这些内容 权当笔记和经验

## 密钥部署

1.当然首先还是登陆服务器 填写你的服务器`ip`
```shell
$ ssh root@xxx.xxx.xxx.xxx 
```
2.接着执行  填写你自己的邮箱
```shell
$ ssh-keygen -t rsa -C "ghcz10@outlook.vom"
```
一直`enter`下去即可 和我们在本地生成密钥是一样的 最后就是这样的

![1](/attachments/images/articles/2017-01-25/1.png)

生成完毕之后我们可以去目录看一下 也就是之前存放登录公钥的文件夹下面
```shell
$ cd ~/.ssh
```
查看一下具体的文件
```shell
$ ls
```
你会看到下面的文件
```shell
authorized_keys  id_rsa  id_rsa.pub
```

3.接下来就是创建目录
```shell
$ sudo mkdir /var/www/.ssh
$ sudo chown -R root:root /var/www/.ssh/
```
这里的`root:root`是我的用户组 如果你想知道你当前的用户组的话`ll`一下就行了

在安正超的文章是这样的 
```shell
sudo chown -R apache:apache /var/www/.ssh/
```
因为他是在`apache`环境 我这里的服务器是 `nginx` 所以说视具体环境而定

接着我们需要生成一个部署公钥 之前生成的公钥是用户公钥 是进行`git push`等认证用户的

4.所以接下来我们去生成一个部署公钥
```shell
$ sudo -Hu root ssh-keygen -t rsa
```
这里我的还是`root`用户组

接着你会在这个`/var/www/.ssh`目录下有个`id_rsa.pub`这个部署公钥

所以我们现在可以去`Coding`部署这个公钥 首先拿到这个公钥 去执行
```shell
$ sudo cat /var/www/.ssh/id_rsa.pub # 查看生成的密钥内容，复制全部
```
5.复制完这个公钥 我们就可以去`Coding` 新建一个私有项目 并在部署公钥填写我们已经复制好的公钥

6.准备钩子文件
在你的`www`目录建立一个目录`hook`, 里面放上一个`php`文件`index.php`
```shell
$ sudo -Hu root touch /var/www/hook/index.php
```
```php?start_inline=1
<?php
    error_reporting(1);
    $target = '/var/www'; // 生产环境web目录

    $token = 'ispace';
    $wwwUser = 'root';
    $wwwGroup = 'root';

    $json = json_decode(file_get_contents('php://input'), true);

    if (empty($json['token']) || $json['token'] !== $token) {
        exit('error request');
    }

    $repo = $json['repository']['name'];

    $cmd = "sudo -Hu www cd $target && git pull";

    shell_exec($cmd)
```
确保你的`hook`文件可以访问：`http://example.com/hook/index.php` 这样钩子准备完成。

7.3.修改git配置
```shell
git config --global user.name "jellybean" 
git config --global user.email "gehuachun@outlook.com" # 邮箱请与conding上一致
```

## 部署公钥
1.添加用户公钥

复制上面的`~/.ssh/id_rsa.pub`的内容到个人设置页`https://coding.net/user/setting/keys`添加即可

2.复制`/var/www/.ssh/id_rsa.pub`的内容并添加到`Coding.net`公钥(这个在之前已经添加完成):

选择项目 > 设置 > 部署公钥 > 新建 > 粘贴到下面框并确认

3.添加hook

选择项目 > 设置 > WebHook > 新建hook > 粘贴你的`hook/index.php`所在的网址。比如:`http://example.com/hook/index.php`, 令牌可选，建议写上。

稍过几秒刷新页面查看hook状态，显示为绿色勾就OK了。

## 初始化
1.我们需要先在服务器上clone一次，以后都可以实现自动部署了：

```
sudo -Hu www git clone https://git.coding.net/yourname/yourgit.git /home/wwwroot/website.com/  --depth=1
```
这个时候应该会要求你输入一次Coding的帐号和密码

**！！注意，这里初始化clone必须要用www用户**

2.往`Coding.net`提交一次代码测试：

在本地`clone`的仓库执行：
```shell
$ git commit -am "test hook" --allow-empty
$ git push 
```
OK，稍过几秒，正常的话你在配置的项目目录里就会有你的项目文件了。

## 相关文章链接

- [利用WebHook实现PHP自动部署Git代码-Nginx](https://m.aoh.cc/149.html)
- [使用PHP脚本远程部署git项目-Apache](http://overtrue.me/articles/2015/01/how-to-deploy-project-with-git-hook.html)

当然还有教主的视频课程
- [Laravist Coding Webhook 自动部署Git项目](https://www.laravist.com/series/something-that-a-little-helpful/episodes/3)