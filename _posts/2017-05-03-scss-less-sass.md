---
layout: post
title: 浅谈CSS常用的预处理器(框架)
description: CSS预处理器技术已经非常的成熟，而且也涌现出了很多种不同的CSS预处理器语言，而我们接触最多的就是Scss,Stylus,Less。
             如此之多的CSS预处理器 其终究目的是使得CSS开发更灵活和更强大
tags:
     CSS
     Framework
     前端
class: post-two
comments: true
poster: /attachments/images/articles/2017-05-03/poster.jpg
---
## 简介

`CSS` 预处理器技术已经非常的成熟，而且也涌现出了越来越多的 `CSS` 的预处理器框架。

不过这里就来谈谈最为普遍的三款 `CSS` 预处理器框架 不过最主要还是谈谈`Sass`和`Less`

## 定义说明

### CSS预处理器
`CSS` 预处理器是一种语言用来为 `CSS` 增加一些编程的的特性，无需考虑浏览器的兼容性问题，
例如你可以在 `CSS` 中使用变量、简单的程序逻辑、

函数等等在编程语言中的一些基本技巧，可以让你的 `CSS` 更为简洁，适应性更强，代码更直观等诸多好处

通俗的将就是讲原本的`CSS`语言抽象出来使他具有一定的程序逻辑 也省去了中间的很多步骤

而这些预处理器无非就是集合了语法、变量、嵌套、混入(Mixin)、继承、导入、函数和操作符等方面的操作处理

### Sass
**Sass**是一种动态样式语言，`Sass`语法属于缩排语法，

比`css`比多出好些功能(如变量、嵌套、运算,混入(Mixin)、继承、颜色处理，函数等)，这样也使开发者更加的容易阅读

说白了`sass`就是`scss`的严格模式 所以说他更像一门编程语言 因为他有一些诸如语言的特性

- `sass`有变量和作用域 变量有全局和局部之分，并且有优先级
- `sass`有函数的概念
- 进程控制(也就是我们所说的@if @else等)
- 数据结构 `$list`类型-数组 `$map`类型-object 其余的也有`string`、`number`、`function`等类型


### Scss
`SCSS` 是 `Sass 3` 引入新的语法，其语法完全兼容 `CSS3`，并且继承了 `Sass` 的强大功能。也就是说，任何标准的 `CSS3` 

样式表都是具有相同语义的有效的 `SCSS` 文件。另外，`SCSS` 还能识别大部分 `CSS hacks`（一些 CSS 小技巧）和特定于浏览器的语法

### Scss 和 Sass 的区别
`Sass` 和 `SCSS` 也可以说是同一种的，我们平时都称之为 `Sass`，两者之间不同之处有以下两点：

首先文件扩展名不同，`Sass` 是以`".sass"`后缀为扩展名，而 `SCSS` 是以`".scss"`后缀为扩展名

语法书写方式不同，`Sass` 是以严格的缩进式语法规则来书写(这也是之前我们所提到的) 
 
不带大括号`({})`和分号`(;)`，而 `SCSS` 的语法书写和我们的 `CSS` 语法书写方式非常类似。

我们平常所说的`Sass`文件基本都是以`.scss`文件 这样也是避免 `sass` 后缀名的严格格式要求报错。

举个例子来说的话:

##### Sass语法
```sass?
$primary-color: #eee //定义变量

body
  color: $primary-color
```
##### Scss语法
```scss?
$primary-color: #eee;

body {
  color: $primary-color;
}
```
最后编译的结果是:
```css?
body {
  color: #eee;
}
```


### Less
受`SASS`的影响较大，但又使用`CSS`的语法，让大部分开发者和设计师更容易上手，在`ruby`社区之外支持者远超过`SASS`

其缺点是比起`SASS`来，可编程功能不够，不过优点是简单和兼容`CSS`，个人实际开发的话会更容易上手 

反过来也影响了`SASS`演变到了`SCSS`的时代 这也就是为什么现在`Scss`完全兼容`Css3`的原因了


### Stylus
**2010**年产生，来自`Node.js`社区，主要用来给`Node`项目进行`CSS`预处理支持

在此社区之内有一定支持者，在广泛的意义上人气还完全不如`SASS`和`LESS`

## 简单语法使用

#### 1.变量
你可以在 `CSS` 预处理器中声明变量，并在整个样式单中使用，支持任何类型的变量
例如颜色、数值(不管是否包括单位)、文本。然后你可以任意引用该变量

不同的是`Sass`允许使用变量，所有变量以`$`开头 
```sass?
$mainColor: #0982c1;
$siteWidth: 1024px;
$borderStyle: dotted;
 
body 
  color: $mainColor;
  border: 1px $borderStyle $mainColor;
  max-width: $siteWidth;

```
而`Less`则以`@`开始
```scss?
@mainColor: #0982c1;
@siteWidth: 1024px;
@borderStyle: dotted;
 
body {
  color: @mainColor;
  border: 1px @borderStyle @mainColor;
  max-width: @siteWidth;
}
```

所以最后的编译结果就是:
```css?
body {
  color: #0982c1;
  border: 1px dotted #0982c1;
  max-width: 1024px;
}
```
可以体会得到的是变量的使用 就和一个全局变量的作用差不多  我们在需要修改颜色等样式的值时只需要去修改定义的值就好了

> 当然变量也是有作用域的 就如上面的是声明在规则块定义外的 如果定义在css规则块内，那么该变量只能在此规则块内使用

```scss?
$nav-color: #F90;
nav {
  $width: 100px;
  width: $width;
  color: $nav-color;
}

//编译后

nav {
  width: 100px;
  color: #F90;
}
```
这里的`$width`就只能在`nav`这个规则快里使用

#### 2.嵌套
这个也是我认为非常方便的一个地方 很多时候样式的定义需要一堆的父级类名的限制 最后的结果呢一个样式却堆成很长 又很难后期维护

特别的在我们需要在`CSS`中相同的 `parent` 引用多个元素，这将是非常乏味的，你需要一遍又一遍地写 `parent`。例如
```css?
section {
  margin: 10px;
}
section nav {
  height: 25px;
}
section nav a {
  color: #0982C1;
}
section nav a:hover {
  text-decoration: underline;
}
```

这时我们在`Css`预处理器里可以这样定义
```scss?
section {
  margin: 10px;
 
  nav {
    height: 25px;
 
    a {
      color: #0982C1;
 
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
```
这里最后的编译结果和上面的是一样的 最后的结果也一目了然了 下面的定义我们很清楚的看到父级与子级的关系 修改起来也十分方便

> 这里使用了一个父选择器的标识符&

当然还有就是群组选择器的嵌套 举例来说的话就是:
```scss?
.container {
  h1, h2, h3 {margin-bottom: .8em}
}
```
当然这样是等价于:
```css?
.container h1, .container h2, .container h3 { margin-bottom: .8em }
```
这样其实也很容易明白

> 对于选择器的使用其实还有诸如  子组合选择器和同层组合选择器：>、+和~ 这些在文档上都有写到 看一下就能明白了
>
> 理解起来和父选择器差不多

还有一个值得看一下的就是属性的嵌套  比如在对于`border`的定义

如果要反复写`border-style` `border-width` `border-color`以及`border-*`等也是非常烦人的。在预处理器中，你只需敲写一遍`border`

```scss?
nav {
  border: {
  style: solid;
  width: 1px;
  color: #ccc;
  }
}
```
最后的编译结果看看也能知道就是:
```css? 
nav {
  border: {
  style: solid;
  width: 1px;
  color: #ccc;
  }
}
```
#### 3. Mixins (混合器)
`Mixins` 有点像是函数或者是`C`语言的宏，我个人更觉得更像是函数的定义  当你某段 `CSS` 经常需要在多个元素中使用时

你可以为这些共用的 `CSS` 定义在一个 `Mixin`，然后你只需要在需要引用这些 `CSS` 地方调用该 `Mixin` 即可 

同时你可以传入你的`参数` 那么那块就会载入你定义在`Mixins`的样式代码了

##### 使用混合器
在**Sass**里
```scss?
@mixin rounded-corners {
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
```
这样你就可以在需要这块代码的地方去引入
```css?
notice {
  background-color: green;
  border: 2px solid #00aa00;
  @include rounded-corners;
}
```
所以最终编译的结果就是
```css?
.notice {
  background-color: green;
  border: 2px solid #00aa00;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
```

在**Less**语法里
```sass?
.error(@borderWidth: 2px) {
  border: @borderWidth solid #F00;
  color: #F00;
}
 
.generic-error {
  padding: 20px;
  margin: 4px;
  .error(); 
}
.login-error {
  left: 12px;
  position: absolute;
  top: 20px;
  .error(5px); 
}
```

> 当然混合器中不仅可以包含属性，也可以包含css规则，包含选择器和选择器中的属性

举例来说就是
```scss?
@mixin no-bullets {
  list-style: none;
  li {
    list-style-image: none;
    list-style-type: none;
    margin-left: 0px;
  }
}
```
其实最后编译的道理是相同的这里就不过多展开说了

##### 混合器传递参数
这时就更像一个`function`了
```scss?
@mixin link-colors($normal, $hover, $visited) {
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
```
所以接下来你在引入时需要给这个`CSS`函数传递必要的参数 就像这样
```scss?
a {
  @include link-colors(blue, red, green);
}
```
而在`Less`里就可以这样定义
```scss?
.link-colors($normal, $hover, $visited) {
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
```
那么调用的时候就是
```scss?
a {
  .link-colors(blue, red, green);
}
```
两者其实都差不多 只不过表示方式不太一样而已

#### 4. 继承
#### 5. 导入

## 总结

不管是`Sass`，还是`Less`，`Stylus` 都可以视为一种基于`CSS`之上的高级语言，其目的是使得`CSS`开发更加灵活和强大

`Sass`的功能比`Less`强大,因为他更像一门编程语言了，而`Less`则相对清晰明了,易于上手,对编译环境要求比较宽松。因为`Sass`需要`Ruby`环境的支持 

编译比不上`less.js`那么直接  但我想这个并不是什么大问题

相对而言，国内前端团队使用`Less`的同学会略多于`Sass`  尽管现在很多的公司都开始转向于用`Sass` 而个人开发的话`Less`更为容易上手和方便 其实无论哪种选择 都是可以的

始终记住存在即合理  所以也没必要太纠结选择那种工具 实现自己最为满意的开发方式就`ok`


### 相关链接
- [SASS中文网](http://www.sasschina.com/)
- [Less手册](http://less.bootcss.com/)