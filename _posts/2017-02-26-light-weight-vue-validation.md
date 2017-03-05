---
layout: post
title: vuelidate-vueJs验证解决方案
description: 基于vueJs的轻量级的验证解决方案 在我们的登录注册以及表单提交时会是一个不错的选择
tags:
     vue
     validation
class: post-five
comments: true
poster: /attachments/images/articles/2017-02-26/poster.png
---
## 介绍
在后端项目里 比如我们的`Laravel`框架 对于表单验证有自己的一套`validation`机制 他将验证集成在`FormRequest` 

我们只需要在我们的方法中依赖注入我们自己实例化后的验证类 当然也可以直接去在方法里去验证表单数据
   
而在我们的前端的项目里 也就是在我们的`vue`项目里 也有比较好的验证解决方案 也就是这的`vuelidate`

## 1.安装
和我们安装前端包一样 在项目终端执行:
```
$ npm install vuelidate --save
```

安装完成后和我们去使用`vuex`一样 在`main.js`去引入声明这个`package`:
```php?start_inline=1
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
```

当然你也可以在相应的组件里去引用:
```php?start_inline=1
import { validationMixin } from 'vuelidate'

var Component = Vue.extend({
  mixins: [validationMixin],
  validation: { ... }
})
```

#### 相关网址
- [github地址](https://github.com/monterail/vuelidate)
- [package官网](https://monterail.github.io/vuelidate/)