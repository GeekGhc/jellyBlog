---
layout: post
title: JavaScript 异步方案 async/await
description: 无论是在 Web 前端界面，还是 Node.js 服务端都是如此，JavaScript 里面处理异步调用一直是非常头疼的一件事情。
             以前只能通过回调函数，后来渐渐又演化出来很多方案。终于在 ES7 中决定支持 async 和 await。
tags:
     javascript
     async
     await
class: post-two
comments: true
poster: /attachments/images/articles/2017-03-02/poster.jpg
---
## 介绍
无论是在 `Web` 前端界面，还是 `Node.js` 服务端都是如此，`JavaScript` 里面处理异步调用一直是非常令人头疼的一件事情。

以前只能通过回调函数，到 `Promise` 对象，再到 `Generator` 函数 后来也演化出来很多方案。终于在 **ES7** 中决定支持 `async` 和 `await`。

## Promise 
通俗来讲就是函数之间的承诺 用来传递异步操作的消息 就是`方法A`去调用`方法B` `方法B`会返回一个`Promise`给`A` 这样方法`A`会对`B`返回的内容进行逻辑处理

理解起来就是对未来才会知道结果事件(承诺不就是这个意思喽)

**Promise**规范:

* 一个`promise`可能有三种状态：**等待(pending)**、**已完成(Resolved也称为fulfilled)**、**已拒绝(rejected)**
* 一个`promise`的状态只可能从“等待”转到“完成”态或者“拒绝”态，不能逆向转换，同时“完成”态和“拒绝”态不能相互转换
* `promise`必须实现`then`方法（可以说，then就是promise的核心），而且`then`必须返回一个`promise`，同一个`promise`的`then`可以调用多次(这也是async/await需要解决的)，
  并且回调的执行顺序跟它们被定义时的顺序一致
* `then`方法接受两个参数，第一个参数是成功时的回调，在`promise`由“等待”态转换到“完成”态时调用，另一个是失败时的回调，在`promise`由“等待”态转换到“拒绝”态时调用。
  同时，`then`可以接受另一个`promise`传入，也接受一个“类then”的对象或方法，即`thenable`对象


## Async 函数和Await 关键词

- `Async`函数是一个`Promise`

- `Await`会暂停`async`方法的执行 直到接收到一个`Promise`结果 下面的例子就可以看出 这样的话你就可以不需要`callback`就可以
写自己的异步代码 看起来就像是写一段同步的方法代码


## 基本语法
`async/await` 究竟是怎么解决异步调用的写法呢？简单来说，

就是将异步操作用同步的写法来写。下面是一段最基本的语法：
```php?start_inline=1
const fun = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = async () => {
  const t = await fun();
  console.log(t);
};

testAsync();
```

这里的函数`fun`返回一个`Promise` 并且延迟**2**秒 其中`resolve`中传入值**123**

`testAsync`函数使用了关键字`async` 配合使用了`await` 最后去执行函数`testAsync`

最后的结果是整个程序延迟两秒输出**123** 这是因为`testAsync`中的t取得了`fun`中`resolve`的值

并且通过`await`阻塞了后面代码的执行 

## Promise比较
还是之前那样的简单的调用 我们不难看出使用`async/await`的方便和强大 这样很好的处理了异步函数 这也让我们告别了之前使用的then

方法 当然`then`方法我们在很多的框架中也会看到 只不过是执行了一系列的回调函数 就比如在执行与后端的数据交互后

下面我们也可以看看 如果使用`Promise`去执行这段程序
```php?start_inline=1
const fun = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = () => {
  fun().then((t) => {
    console.log(t);
  });
};
testAsync();
```
这里就体现出`Promise`一些不太好的处理 比如可能会有太多的`then`方法 这样会使得整个代码段臃肿并且难以维护

其实在每一个`then`方法内都是一个独立的作用域
