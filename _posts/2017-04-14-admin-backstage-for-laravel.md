---
layout: post
title: Laravel AdminLTE 后台模板
description: 基本AdminLTE的后台模板 集成于laravel5 为实现更为方便的后台管理
tags:
     Laravel
     AdminLTE
     BackStage
class: post-five
comments: true
poster: /attachments/images/articles/2017-04-14/1.png
---

# AdminLTE For Laravel

##  介绍
基于[AdminLTE](https://github.com/almasaeed2010/AdminLTE)的后台模板样式 集成基本的文章 用户模块 其余的功能模板可根据实际项目需求添加

> `GitHub` 项目地址  [AdminlTE-For-Laravel](https://github.com/GeekGhc/adminLTE-for-laravel)


## 效果图
### 后台首页
![image](/attachments/images/articles/2017-04-14/1.png)
### 文章列表
![image](/attachments/images/articles/2017-04-14/2.png)
### 创建文章
![image](/attachments/images/articles/2017-04-14/3.png)

## 安装
### 1.clone到本地
```
git clone https://github.com/GeekGhc/adminLTE-for-laravel.git
```
### 2.根目录下创建.env文件
```
 php artisan key:generate
```

后台开发过程时可借助`MustBeAnAdmin` middleware 完成逻辑判断

在管理用户权限的`Packages`
- [Laravel Permission](https://github.com/spatie/laravel-permission) 目前我的项目就是用的这个`Package`
- [Laravel Roles](https://github.com/romanbican/roles)
- [ultraware/roles](https://github.com/ultraware/roles)
