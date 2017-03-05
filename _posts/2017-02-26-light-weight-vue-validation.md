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

当然你也可以在需要用到验证的组件里去引用一个相对小的版本:
```php?start_inline=1
import { validationMixin } from 'vuelidate'

var Component = Vue.extend({
  mixins: [validationMixin],
  validation: { ... }
})
```

如果你偏好通过`require`这样的形式 你也可以这样引入:
```php?start_inliine=1
const { validationMixin, default: Vuelidate } = require('vuelidate')
const { required, minLength } = require('vuelidate/lib/validators')
```

## 2.使用
其实使用起来真的很方便 下面举例来说就是在我的项目里的使用


1.注册验证
在用户注册时 我们通常的需要处理的表单字段就是`name`,`email`,`password`,`confirm_pwd`

首先我在`Register.vue`这个组件文件中把基本的样式结构写好 这取决于每个人

接着是我们对表单数据的验证:

这里是对用户名和邮箱的验证 就像之前提到的 我们先引入我们的验证规则:
```php?start_inline=1
import { required,minLength,between,email } from 'vuelidate/lib/validators'
```
因为我是对一个新用户的注册 所以我定义一个`data`
```php?start_inline=1
 data(){
    return{
        newUser: {
            name:'',
            email:'',
            password:'',
            confirm_pwd:''
        },
    }
},
```

接着去定义我们的验证字段的规则:
```php?start_inline=1
validations: {
    newUser:{
       name: {
            required,
            minLength: minLength(2)
       },
       email: {
            required,email
       }
    }
},
```

定义这些验证规则之后 下面是我的`html`部分内容
```html
<div class="control-group" v-bind:class="{ 'form-group--error': $v.newUser.name.$error }">
<label class="control-label">用户名</label>
<el-input
        placeholder="请输入你的用户名"
        v-model.trim="newUser.name"
        @input="$v.newUser.name.$touch()"
>
</el-input>
</div>
<span class="form-group__message" v-if="!$v.newUser.name.required">用户名不能为空</span>
<span class="form-group__message" v-if="!$v.newUser.name.minLength">用户名不能太短</span>

<div class="control-group" v-bind:class="{ 'form-group--error': $v.newUser.email.$error }">
<label class="control-label">邮箱</label>
<el-input
        placeholder="请输入你的邮箱"
        v-model.trim="newUser.email"
        @input="$v.newUser.email.$touch()"
>
</el-input>
</div>
<span class="form-group__message" v-if="!$v.newUser.email.required">邮箱不能为空</span>
<span class="form-group__message" v-if="!$v.newUser.email.email">请填写正确的邮箱格式</span>
```

每个人可以都不一样 官方文档上也给出了`demo`:
```html
<div>
  <div class="form-group" v-bind:class="{ 'form-group--error': $v.flatA.$error }">
    <label class="form__label">Flat A</label>
    <input class="form__input" v-model.trim="flatA" @input="$v.flatA.$touch()">
  </div><span class="form-group__message" v-if="!$v.flatA.required">Field is required.</span>
  <div class="form-group" v-bind:class="{ 'form-group--error': $v.flatB.$error }">
    <label class="form__label">Flat B</label>
    <input class="form__input" v-model.trim="flatB" @input="$v.flatB.$touch()">
  </div><span class="form-group__message" v-if="!$v.flatB.required">Field is required.</span>
  <div class="form-group" v-bind:class="{ 'form-group--error': $v.forGroup.nested.$error }">
    <label class="form__label">Nested field</label>
    <input class="form__input" v-model.trim="forGroup.nested" @input="$v.forGroup.nested.$touch()">
  </div><span class="form-group__message" v-if="!$v.forGroup.nested.required">Field is required.</span>
  <div class="form-group" v-bind:class="{ 'form-group--error': $v.validationGroup.$error }"></div><span class="form-group__message" v-if="$v.validationGroup.$error">Group is invalid.</span>
  <pre>validationGroup: {{ $v.validationGroup }}</pre>
</div>
```
我们先这样举例 值得注意的是我们需要去知道他的`$v.name`里面的内容

也就是 `$invalid` `$dirty` `$error` `$pending` `$each` 这个`value`

> 特别的注意 `$error`里的解释：`It is a shorthand to $invalid && $dirty` 
>
> 也就是一个与的组合 你可以去试着改变这两者的值 再去看`$error`的值

当然还有两个重要的方法: `$touch` `$reset` 上面也有实例 说简单点就是设置这个以及子节点的`$dirty` 为`true`或者`false`

而设置这个`$dirty` 再结合 `$invalid`就可以判断验证成功与否

> `$error` 是由`$dirty`和`$invalid`共同决定的 
> 
> 在这里的验证规则流程是这样的 如果`$error`为`true`那么`form-group`会添加一个`form-group--error`这个`class`
> 只有在`$error`为`true`时 如果你不符合任意一个验证规则 例如不符合`required` 那么就会提示验证失败

如果验证错误就给出错误提示 这是我的错误样式:
```css
.form-group__message{
    display: none;
    font-size: .95rem;
    color: #CC3333;
    margin-left: 10em;
    margin-bottom: 12px;
}
.form-group--error+.form-group__message {
    display: block;
    color: #CC3333;
}

.form-group--error input, .form-group--error input:focus, .form-group--error input:hover, .form-group--error textarea {
    border-color: #CC3333;
}
```

2.密码验证其实和上面的差不多 只不过他的验证规则时通过 `sameAs` 来进行验证的

除了上面这些还有一个组合验证 也就是如果任意一个不符合验证规则就不通过 这个还是挺常用的

我们可以在验证字段这样去组合:
```php?start_inline=1
validations: {
    flatA: { required },
    flatB: { required },
    forGroup: {
      nested: { required }
    },
    validationGroup: ['flatA', 'flatB', 'forGroup.nested']
}
```
如果任意一个就是`FlatA flatB forGroup`其中一个不符合验证规则 那么`$v.validationGroup.$error`就是`false`


3.异步验证

特别是在验证唯一性的时候 我们肯定会遇到这样的一个场景:

就比如我们的邮箱 如果已经注册过这个邮箱了 那么再用这个邮箱去注册显然不是我们想要的

还有就是我们登录时我们需要去核对我们的用户的密码


4.自定义验证

同样的我们不仅可以使用它提供给我们的验证规则 我们也可以自定义验证规则并与之前的进行组合

官方给出了一个简单实例:
```php?start_inline=1
export default value => {
  if (Array.isArray(value)) return !!value.length

  return value === undefined || value === null
    ? false
    : !!String(value).length
}
```
#### 相关网址
- [github地址](https://github.com/monterail/vuelidate)
- [package官网](https://monterail.github.io/vuelidate/)