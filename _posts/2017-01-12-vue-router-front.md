---
layout: post
title:  vue-router处理前端路由
description: vue-router是Vue.js官方的路由插件，我们可以用它去处理我们前端路由,比较适合用于构建单页面应用 在构建前端vue-cli项目我们就可以利用
            他去实现路由的处理
tags:
     SPA
     VueJs
     Router
class: post-one
comments: true
poster: /attachments/images/articles/2017-01-12/poster.png
---

### 1.介绍
在标准的`SPA应用`中 我们的前端路由都是交给我们的前端框架去处理的

`vueJs`官方推荐的路由处理就是我们的`vue-router`

### 2.安装
1.在命令行执行
```
$ npm install vue-router
```
安装完毕之后我们只需要import进来就可以使用
```php?start_inline=1
import VueRouter from 'vue-router'
Vue.use(VueRouter)
```

> 如果我们初始化项目时就已经安装了`vue-router` 那么就会默认的在`src/router`下生成了`index.js`文件
  这样我们的路由就可以在里面定义(我觉得这样去定义更加清晰 当然定义的方法都是同理的)

这样我们的路由就会交给我们的`vue-router`去处理

如果这个时候我们的浏览器的访问时是`http://localhost:8080/#/`这样的 就说明我们已经使用了`vue-router`

### 3.要点说明

> 以下说明我个人结合文档和自己在写项目时的体会 如有不到位还请见谅

##### 1.路由的命名
路由的命名采取`name`去定义 这样在路由跳转时 可以直接提供这个路由的`name` 就拿官方文档的例子来说
```php?start_inline=1
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```
这边定义了一个名字为user的路由 这样我们在链接到一个路由时就可以这样给出
```html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

> 这里的params是以一个参数传递的 也就是userId的值 那么这样就可以跳转到名为user这个路由

而`:to`这样的定义和`router.push`是一样的 这个在下面会说到


##### 2.首先谈一下vue-router的路由嵌套

其实官方解释起来也很简单 例如我们在实现`/user`展示的`User`这个`component` 而``/user/post/:id`展示的是用户的一个帖子

那么我们在之前我们路由的渲染是放在`App`这个入口`component` 我们在里面是这样定义的
```html
<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
```
这里的 `<router-view>` 是最顶层的出口  同时我们也是可以在User component去包含 `<router-view>`

这样就相当于他的子路由就会在这里被渲染  那么我们在路由的定义的时候就可以去定义它的子路由

```php?start_inline=1
const router = new VueRouter({
  routes: [
    {
      path: '/user', component: User,
      children: [
        // 当 /user 匹配成功，
        // Post 会被渲染在 User 的 <router-view> 中
        { path: '', component: Post },
        // ...其他子路由
      ]
    }
  ]
})
```

###### 3. **router.push**、 **router.replace** 和 **router.go**

这三者如果说区别的话 我们从字面的解释也可以看出一二

对于`router.push`就可以想象成一个堆栈的组合 那么我们在路由导航时定义的
```html
<router-link :to="..." name=""></router-link>
```
这样的作用就等同与`router.push` 这样我们在访问每一个组件回退到上一个页面 其实最终的效果就是这样的

当然我们也会用到`router-replace`就是一个替换 他不像`router-push`会将之前的路由记录保存

对于`router-go` 作用就是`js`里的`window.history.go(n)` 我们在一开始写`js`跳转页面的时候肯定用到过

###### 4. 导航钩子
这个其实说起来就是一个中间件的作用 这个在`laravel`我们会经常接触到

那么在`vue-router`里 这样的钩子可以是全局的 也可以是由单个组件 也可以是一个组件

那么就谈一下全局的路由钩子好了 其余的官方文档将的也很清楚了

首先我们在`route`的`index.js`(也就是初始化路由的**index**文件)去注册这样的全局性的钩子

```php?start_inline=1
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```
这三个参数的作用就是(发现文档的解释还是挺容易理解的):
- **to**: `Route`: 即将要进入的目标 路由对象
- **from**: `Route`: 当前导航正要离开的路由
- **next**: `Function`: 一定要调用该方法来 `resolve` 这个钩子。可以说执行了一个类似回调函数

##### 5. 导航的数据获取
首先明白一点的是导航的数据获取可以在导航完成之前也可以是导航完成之后 这个主要取决于你所想要的用户体验

1.导航完成后获取数据
结合官方给出的例子来说就是在导航结束后 我们可以在组件created这个时间钩子去获取路由中的数据

> 比如在展示一个用户主页的需求时 在导航之后获取到用户的`id`这样就可以去服务器去请求这个`id`用户的数据信息

官方给出的实例是展示一个`post`的信息 和展示用户是一样的 在组件`created`这个钩子去调用`fetchData`方法
在`fetchData`方法里去请求`post`的数据


2.在导航完成前获取数据

在导航转入新的路由前获取数据。我们可以在接下来的组件的 `beforeRouteEnter` 钩子中获取数据，当数据获取成功后只调用 `next` 方法

我们之前也有说过钩子可以是组件级的 这样一来我们在组件的路由钩子中我们就可以去获取路由的数据

这里我们在获取数据的期间 用户也会停留在当前的界面 这个时候我们可以加一些进度条 缓冲的效果之类的

##### 6. 路由的懒加载
官方给出的说法就是我们在打包项目时 我们可以将每个组件打包成异步加载 这样你的路由被访问的时候就高效多了

我们需要做的就是将每个组件定义成异步组件 在配置路由时依然和之前的一样  不同的是在路由的定义上

就拿我项目里的几条路由来说就是这样去定义:
```php?start_inline=1
const Profile = r => require.ensure([], () => r(require('components/users/Profile')), 'profile')
const Account = r => require.ensure([], () => r(require('components/users/Account')), 'account')
```

这边就定义了两个异步组件 然后我们爱配置的时候还是之前的配置
```php?start_inline=1
export default new Router({
    mode: 'history',
    history: true,
    routes: [
        {path: '/profile', name: 'profile', component: Profile},
        {path: '/account', name: 'account', component: Account},
    ]
})
```

### 4.结合简单业务处理
这里我们还是以一个任务管理系统为应用场景

1.下面就是定义我们的路由

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

2.在我们的laravel返回我们的todos数据:
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

3.接下来就是去实现我们另一条路由 也就是`/todo/:id`这条路由了

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


#### 参考资料:
- [https://router.vuejs.org/zh-cn/](https://router.vuejs.org/zh-cn/)
