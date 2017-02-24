---
layout: post
title: Vue使用脚手架进行组件化开发
description: Vuejs 脚手架工具是 Vuejs 官方提供的一个命令行操作工具，我们可以初始化一个 Vuejs 项目来进行组件化开发
tags:
     vueJs
     组件化开发
     脚手架工具
class: post-three
comments: true
poster: /attachments/images/articles/2017-02-04/poster.png
---

## 1.vue-cli安装
1.首先确保你已经正确安装了**nodejs环境**以及**git** 然后可以全局方式安装**vue-cli**：

> 当然对`node` 和 `npm` 版本也有一定要求

```
$ npm install -g vue-cli
```
2.初始化项目
```
$ vue init <template-name> <project-name>
```
现在我们开始创建我们的项目:
```
$ vue init webpack my-project
```