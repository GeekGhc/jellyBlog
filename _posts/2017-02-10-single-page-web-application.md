---
layout: post
title: 使用VueJs开发SPA应用
description: 对于近年来火热的SPA 我们可以有多种解决方案 现在我们可以尝试着用vueJs去开发我们的SPA应用
tags:
     SPA
     vueJs
     vuex
     Laravel
class: post-six
comments: true
poster: /attachments/images/articles/2017-02-10/poster.png
---

> 因为最近自己正在开发类似知加这样的一款应用 利用好自己已学的`vueJs`和`SPA`相关的知识 :stuck_out_tongue_closed_eyes:

## 介绍
因为最近也在学习和开发自己的SPA应用 项目开始也有一段时间了 整个过程实现起来还是会有点问题的 当然写代码这也是一个过程啦

## 1.集成`UEditor`
1.其实有很多这样的文本编辑器 例如我找到的两款:
- [UEditor](http://ueditor.baidu.com/website/index.html)
- [Quill](https://quilljs.com/)  个人感觉还是比较好看的 :stuck_out_tongue_closed_eyes:


但我发现好像还是百度的`UEditor`用的比较多点 其实自己也想到就是文档资料找起来比较方便 这样处理问题也很快

当然后面的话我还是想再去集成其他的文本编辑器 尽管这款编辑器功能还是很强大的 但是我发现我并没有这么多的需求 顺便也多一种体验嘛
(功能和样式选项都是可以配置的 在下面我也会给出我的一些配置项)

2.开始集成`UEditor`

来到我们的官网的下载[http://ueditor.baidu.com/website/download.html](http://ueditor.baidu.com/website/download.html) 我下载的是
`PHP`最新版本的 因为后端处理还是会交给`PHP`去处理

下载完成后我将文件放在了根目录的`static`文件夹下

然后去`components`文件夹下我在公共目录`common`(这是我自己创建的)创建了`Ueditor.vue`组件
内容期初是这样:
```php?start_inline=1
<template>
    <div id="ueditor">
        <div ref="editor" id="editor"></div>
    </div>
</template>
<script>
    import '../../../static/ueditor/ueditor.config.js'
    import '../../../static/ueditor/ueditor.all.js'
    import '../../../static/ueditor/lang/zh-cn/zh-cn.js'
    export default{
        data(){
            return{
              edtior: null
            }
        },
        mounted() {
            this.editor = UE.getEditor(this.$refs.editor.id);
        },
        beforeDestroy() {
            if(this.editor) {
            this.editor.destroy();
           }
        },
        components:{
        }
    }
</script>
```
当然这个时候是引用不到的 还得去配置一下`UEDITOR_HOME_URL`(文件路径)
这个实在集成进来的`UEditor`下面的`ueditor.config.js`里面:
```php?start_inline=1
 // var URL = window.UEDITOR_HOME_URL || getUEBasePath();
    var URL = window.UEDITOR_HOME_URL || "/static/ueditor/";
```
最后可以在页面看到成功显示:

![first](/attachments/images/articles/2017-02-10/first.png)