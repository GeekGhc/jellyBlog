---
layout: post
title: vue-cli集成quill富文本编辑器
description: 在前端vue项目中我们会需要文本编辑器 当然我们用的比较多的是百度的Ueditor 当然我们也有其他非常的
            解决方案
tags:
     vue-cli
     Quill
     Editor
class: post-two
comments: true
poster: /attachments/images/articles/2017-03-03/poster.png
---

> 具体的editor组件代码我已经放在我的`gist`

## 集成**Quill-editor**

1.集成`quill`

> 这里是我项目里集成的文本编辑器的地址 [Vue-Quill-Editor](https://github.com/surmon-china/vue-quill-editor)

在已经使用我们的脚手架工具初始化我们的`vue`项目后 我们在终端执行
```
$ npm install vue-quill-editor --save
```

接着去项目中的`main.js`引用
```php?start_inline=1
import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor)
```

这和我们使用`vue-router`是一样的

为了方便使用我在 `src/components/common`新建了一个`QEditor.vue`
接着就是去初始化我们的`editor`组件
```php?start_inline=1
  data(){
    return{
        content: '',
        editorOption: {
            modules: {
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline','strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                   [{ 'color': [] }, { 'background': [] }],
                  ['image', 'link','code-block']
                ]
          },
        }
    }
},
```
这里的`toolbar`是定义自己需要的功能组件 你可以根据自己的需要来定义 具体的可以看文档定义:

[https://quilljs.com/docs/modules/toolbar/](https://quilljs.com/docs/modules/toolbar/)

在安装初始化之后 这里是监听了`change`的方法
```php?start_inline=1
onEditorChange({ editor, html, text }) {
  this.content = html
},
```
这里的`html`返回的就是`html`文本内容 而`text`则是不包含`html`标签的纯文本内容

2.完成好后就可以去引入我们的`editor`组件 这里我在`Start.vue`里去使用的话
```php?start_inline=1
  import QEditor from 'components/common/QEditor'
```
接着就是去声明我们的组件
```php?start_inline=1
 components:{
    'qeditor':QEditor,
 }
```

最后的效果的话就是这样的(部分样式可以自己去修改)
![first](/attachments/images/articles/2017-03-03/first.png)

#### 部分资料
- [gist地址](https://gist.github.com/GeekGhc/152d677e6e512513e9e671b2a271da31)
- [Api文档](https://quilljs.com/docs/quickstart/)
- [Web前端开发资源库](https://www.awesomes.cn/)
