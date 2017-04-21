---
layout: post
title: CSS 实现IOS毛玻璃的虚化效果
description: 今天不谈php 偶尔闲下来 就稍谈下了下css的毛玻璃效果 其实这样的效果如果处理的好的话 给用户的体验还是非常不错的
tags:
     Css
     Html
     CodePen
class: post-two
comments: true
poster: /attachments/images/articles/2017-04-19/poster.png
---
## 介绍
可能我们最初见到的也就是`IOS`的毛玻璃的效果 现在很多的软件 例如一些音乐软件 在背静虚化上都有处理 这其实实现起来并不是一件什么

难事，但对于用户的视觉效果还是很有必要的。我们经常会遇到这样的背景虚化过滤效果。 作为一名`PHPer` 我想一些基本的前端技能还是要有的 

所以今天不谈后端 就单纯的说下  磨砂的这种效果实现 最后我会将代码发布到[CodePen](https://codepen.io/)上

> [MDN filter说明](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)

## CodePen
首先说下`CodePen`这个平台 可能很多人也知道 但我想更多人最为熟悉的还是 [jsfiddle](https://jsfiddle.net/)

这个我们平常用来测试页面的网站 很多的`demo`我们在这里运行以达到自己的想要的效果  我在`CodePen`上已经用了半年多了 确实体验不错

特别是做前端的话 很多时候你会在这里发现很多设计灵感  说起来这明义上是一个代码笔记的意思 不过其创新程度确实让人眼前一亮

在`CodePen`里只提供最新版本的`jQuery`, `MooTools`, `Prototype`框架，且默认不使用任何库 这给开发者很大的空间

另外还有一点很重要的就是`CodePen`的所见即所得  这点对于一名程序员来说是一件非常爽的一件事 

当然作为现在很多的平台 我想更多的还是支持每一位开发者更好的更为自由去交流自己的想法

## 开始

首先当然新建一个index.html文件  为了方便说明 在本地就直接新建一个css文件 并进行引入
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Css 实现磨砂效果</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="main">
    <h1>Hello JellyBean</h1>
</div>
</body>
</html>
```

接下来就是在style.css定义相关的样式

为了最终的效果 这里引入一张图片作为背景
```css
body , .main::before {
    background: url("http://i2.muimg.com/567571/63ce92cd55b62c6c.jpg") 0/cover fixed;
}
```

接着定义一下`.main`和`h1`的布局 只需放在你需要的网页个位置
```css
.main {
    position: relative;
    top: 12vh;
    margin: auto;
    min-height: 75vh;
    max-height: 440px;
    width: 80%;
    max-width: 680px;
    color: rgba(255, 255, 255, 0.94);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset, 0 1px 1px rgba(0, 0, 0, 0.3);
    text-shadow: 0 1px 1px rgba(25, 25, 25, 0.5);
    background: rgba(255, 255, 255, 0.06);
    cursor: pointer;
    overflow: hidden;
}

.main > h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    font-size: 3rem;
    margin-top: 0;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
}
```
这边只是将这个`div`相对的放在了屏幕中间而已 效果就是这样的最后

![1](/attachments/images/articles/2017-04-19/1.png)

接下来其实就是最只要的 我们前提是要了解下`filter`这个属性

## filter 函数

`filter` 属性定义了元素(通常是<img>)的可视效果(例如：模糊与饱和度)。

> 滤镜通常使用百分比 (如：75%), 当然也可以使用小数来表示 (如：0.75)

还有一点需要注意的是

> Internet Explorer 不支持 filter 属性。

所以这里我们是在`Chrome`里进行测试的

`filter`函数里有几种效果 这几种具体的效果很简单 在[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)里讲的也挺明白 在这我们用到的就是`blur`

`blur` 提供了图片的高斯模糊的效果

所以我们在`.main`里可以去加上这个属性:
```css
.main::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -20px;
    -webkit-filter: blur(6px);
    filter: blur(6px);
    -webkit-transition: all .2s ease-in-out, -webkit-filter .8s .22s ease-in-out;
    transition: all .2s ease-in-out, -webkit-filter .8s .22s ease-in-out;
    transition: all .2s ease-in-out, filter .8s .22s ease-in-out;
    transition: all .2s ease-in-out, filter .8s .22s ease-in-out, -webkit-filter .8s .22s ease-in-out;
}
```
这里我们给出的 `filter:blur(6px)`  `6px` 的模糊度 为了对比效果  我们可以加上一个`hover`的效果
```css
.main:hover::before {
    -webkit-filter: blur(0);
    filter: blur(0);
}
```
**So** 最终的效果:

![1](/attachments/images/articles/2017-04-19/1.gif)



