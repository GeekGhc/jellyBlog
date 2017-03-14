---
layout: post
title: vuex开发SPA应用
description: 在使用vueJs开发SPA应用时 官方也提供了我们解决方案就是vuex 他就是使用状态管理机制去实现数据的更新
tags:
     vuex
     vueJs
     state
class: post-two
comments: true
poster: /attachments/images/articles/2017-01-15/poster.png
---

## 1.安装vuex
文档:[http://vuex.vuejs.org/en/](http://vuex.vuejs.org/en/)

来到我们的[github](https://github.com/vuejs/vuex)上面打开我们的文档开始安装:
```
$ npm install vuex --save
```
当然来到我们的`main.js`去引入`vuex`
```php?start_inline=1
import Vuex from 'vuex'
Vue.use(Vuex)
```

## 2.处理业务
1.其实最主要的我们是去理解官方所示的流程图
![流程图](/attachments/images/articles/2017-01-15/poster.png)

我们可以先从提供的`demo`开始:

还是去`main.js`文件加入官方提供的`demo`:
```php?start_inline=1
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```
还是以任务管理系统为应用场景 这时我们在去定义我们的`vuex`(这时最后的业务代码):
```php?start_inline=1
const store = new Vuex.Store({
  state: {
      todos:[],
      newTodo: {
        id: null,
        title: '',
      }
  },
  mutations: {
    get_todos_list (state,todos) {
      state.todos = todos
    },
    delete_todo(state,index){
      state.todos.splice(index,1);
    },
    add_todo(state,todo){
      state.todos.push(todo);
    }
  },
  actions:{
    getTodos(store){
      Vue.axios.get('http://localhost:8000/api/todos').then(response=>{
        store.commit('get_todos_list',response.data);
      });
    },
    removeTodo(store,payload){
      console.log('pindex = '+payload.index);
      Vue.axios.delete('http://localhost:8000/api/todo/'+payload.todo.id+'/delete').then(response=>{
        store.commit('delete_todo',payload.index);
      });
    },
    saveTodo(store,todo){
      Vue.axios.post('http://localhost:8000/api/todo/create',{'title':todo.title}).then(response=>{
        console.log(response.data);
        store.commit('add_todo',response.data);
      });
      store.state.newTodo = {id: null, title: '', completed: false}
    }
  }
})
```
需要说明的是:
- **`mutations`**可以理解成在有了后端数据后去处理我们前端的数据内容
- **`actions`**则是去实现方法的具体业务逻辑 他负责去与我们后端的数据进行交互 在每个`component`可以`dispatch`一个`action`
  比如触发了一个更新操作
  
> 理解起来即使`component`也可以说是一个视图里去`dispatc`一个`action` , `action`里面就是和后端去进行交互 , 
  得到或者更新数据之后再`commit` 一个`mutation` 这样一来`mutation`就会去改变了`state`里面的数据 , 
  而一旦我们`state`里面的数据发生改变它就会去渲染我们的`Vue Components`
  
还有要说明的就是前后端数据肯定是统一的 那么在`vuex`里 后端数据的操作就是通过`action`去实现的  而前端的数据就是通过`mutation`去改变`state`里面的
数据 这样前后端就统一起来了

而`state`里面的数据是每个组件都可以访问 这和我们通常的全局变量的功能差不多 当我们的项目越来越大的时候 我们的`store`也会变得十分臃肿

维护起来也十分困难 那么我们可以将`store`分成几个`module` 每个`module`有相当于一个`store` 因为它有自身的
`state`、`mutation`、`action`、`getters`

举个例子来说就是 

我们在`App.vue`里面去触发一个`action`:
```php?start_inline=1
export default {
  name: 'app',
  mounted(){
    this.$store.dispatch('getTodos')
   },
}
```
就是在生成页面时`dispatch`了一个`action`: **getTodos**
```php?start_inline=1
getTodos(store){
      Vue.axios.get('http://localhost:8000/api/todos').then(response=>{
        store.commit('get_todos_list',response.data);
      });
},
```

`getTodos`去从后端拿到了所有的任务数据 然后它`commit`了一个`get_todos_list`的`mutation`:
```php?start_inline=1
get_todos_list (state,todos) {
      state.todos = todos
},
```
`get_todos_list`将从后端得到的数据赋予给了我们`state`里面的`todos`:
```php?start_inline=1
state: {
      todos:[],
      newTodo: {
        id: null,
        title: '',
      }
},
```
`state`的`todos`的内容改变后就会去渲染我们的`Vue Components`
我们就可以看到页面的数据信息发生改变 这样也就完成用户和数据的交互过程

对于`vuex`的使用 最好还是官方推荐的架构形式

以我的一个项目为例来说吧 就是将各个工作模块区分开来
![first](/attachments/images/articles/2017-01-15/first.png)

我们可以直接去引用我们`index.js`作为入口 具体的怎么实现 我可能需要重新在一篇文章中去写到

参考资料:
- [http://vuex.vuejs.org/en/](http://vuex.vuejs.org/en/)