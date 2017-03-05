---
layout: post
title: 使用vue-router处理前端路由
description: vue-router是Vue.js官方的路由插件，我们可以用它去处理我们前端路由,比较适合用于构建单页面应用
tags:
     SPA
     vueJs
     router
class: post-one
comments: true
poster: /attachments/images/articles/2017-01-12/poster.png
---

## 1.介绍
在标准的`SPA应用`中 我们的前端路由都是交给我们的前端框架去处理的

`vueJs`官方推荐的路由处理就是我们的`vue-router`

## 2.安装
1.在命令行执行
```
$ npm install vue-router
```
安装完毕之后我们只需要import进来就可以使用
```php?start_inline=1
import VueRouter from 'vue-router'
Vue.use(VueRouter)
```
2.下面就是定义我们的路由

> 前端的路由定义是交给我们的`component`去处理 而我们熟悉的框架路由是交给我们的**视图**去处理
  其实可以这么理解`SPA`中不同的`component`就代替了我们传统框架中每个不同的**视图**
  
```php?start_inline=1
const routes = [
  { path: '/', component: Todos },
  { path: '/todo/:id', component: Todo ,name:'todo'}
]
```
就是说我们的首页就是我们的`Todos`这个`component`(之前也说了`SPA`应用中每个视图就是一个`component`)

当然我们得去引进我们的`Todos`和`Todo component`:
```php?start_inline=1
import Todos from './components/Todos'
import Todo from './components/Todo'
```
定义完我们的路由后我们就需要去实例化我们的:
```php?start_inline=1
//实例化我们的router
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})
```

> 如果我们初始化项目时就已经安装了`vue-router` 那么就会默认的在`src/router`下生成了`index.js`文件
  这样我们的路由就可以在里面定义(我觉得这样去定义更加清晰 当然定义的方法都是同理的)
  
这样我们的路由就会交给我们的`vue-router`去处理

如果这个时候我们的浏览器的访问时是`http://localhost:8080/#/`这样的 就说明我们已经使用了`vue-router`

## 3.业务处理
这里我们还是以一个任务管理系统为应用场景

1.在我们的laravel返回我们的todos数据:
```php?start_inline=1
Route::get('/todos',function(){
    $todos = Todo::all();
    return $todos;
})->middleware('api','cors');
```

有了数据之后我们需要将数据交给我们的`component` 当然`component`也会交给我们的`vue-router`去处理

在`vue-router`官网上是这样给出的:
```php?start_inline=1
 <router-view></router-view>
```
我们之前已经定义过每个路由的指向(即每个路由都需要访问到的`component`)

> 我们可以这么理解: 当访问到一个路由时 那么这个`router-view`就会去访问到我们指向的`component`
 这个`router-view`就是填充我们需要展示的`component`的
 就比如访问到首页时就展示的是`Todos`这个`component`的内容 
 当访问到**http://localhost:8000/todo/2** 就会展示id为**2**的`Todo`的内容

因为我们需要渲染我们后端传过来的数据 我们需要将我们的数据传入:
```php?start?inline=1
<router-view :todos="todos"></router-view>
```

> 另外我们可以想象得到的是一个视图是由很多组件构成 而有个组件下面会有很多的子组件 而这个父组件(应该可以这么说吧)
  就代表了我们这个视图
  
2.接下来就是去实现我们另一条路由 也就是`/todo/:id`这条路由了

其实实现起来的效果就是当我们点击某任务时就会跳转到这个任务的详情 也就是去展示这个任务的数据

我们可以先去完成好我们每个任务也就是Todo component的内容(大致就是去展示它的具体内容):
```php?start_inline=1
<template>
    <div class="todo">
        <div class="loading" v-if="loading">
            Loading...
        </div>

        <div v-if="error" class="error">
            {{ error }}
        </div>

        <div v-if="todo" class="content">
            <h2>{{ todo.title }}</h2>
        </div>
    </div>
</template>
```
这是官方给出的一个实例我们加以修改让它去展示我们任务的名称就行

而在script里我们也要给出每个任务的数据(依然使用我们的`vue-axios`):
```php?start_inline=1
<script>
  export default {
  data () {
    return {
      loading: false,
      todo: null,
      error: null
    }
  },
  created () {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this.fetchData()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.todo = null
      this.loading = true
      this.axios.get("http://localhost:8000/api/todo/"+this.$route.params.id).then(response=>{
         this.todo = response.data;
         console.log(response.data);
         this.loading = false
      })
    }
  }
}
</script>
```
在这边`this.$route.params.id`就可以获取到我们路由的`id`值

当然在后端我们是可以通过这个`url`去获取我们指定`id`的任务信息的:
```php?start_inline=1
Route::get('/todo/{id}',function($id){
    $data = Todo::find($id);
    return $data;
})->middleware('api','cors');
```
这些都定义好之后 我们就可以去定义我们的链接了:

我们可以去参照我们的官方文档[router-link](https://router.vuejs.org/zh-cn/api/router-link.html)

我们在T`odos component`里面就可以去定义我们的链接:
```php?start_inline=1
 <router-link :to="{ name: 'todo', params: { id: todo.id }}">{{todo.title}}</router-link>
```
这里的`name`我们是可以在定义路由时给出的:
```php?start_inline=1
const routes = [
  { path: '/', component: Todos },
  { path: '/todo/:id', component: Todo ,name:'todo'}
]
```
这个就和我们`laravel`里面通过`use`的**路由命名**是一个意思 这样我们就可以对应到我们的这个路由了

这个时候我们把去查看页面的链接时就会发现是诸如这样的`http://localhost:8080/#/todo/2`

我们点击链接之后就会跳转到我们`Todo`这个`component`的内容页面

> 当然这个时候我们会发现`url`都是`http://localhost:8080/todo/2`这样的形式 如果你想去掉`#`
  我们可以在定义路由时在这样去定义
  
```php?start_inline=1
const router = new VueRouter({
    mode: 'history',
    history: true,
    routes // （缩写）相当于 routes: routes
})
```

参考资料:
- [https://router.vuejs.org/zh-cn/](https://router.vuejs.org/zh-cn/)