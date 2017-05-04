---
layout: post
title: VueJs处理后端Laravel Api
description: 用vueJs实现组件化时，我们可以在项目中引入后端API的概念，在这里我们就是去处理利用Laravel提供的后端API去实现我们通常说的前后端分离
tags:
     API
     VueJs
     Laravel
class: post-five
comments: true
poster: /attachments/images/articles/2016-12-07/poster.png
---

## 1.后端提供**API**
在用`vue-cli`构建好我们的项目 并且实现`vueJs`组件化.下面我们可以去尝试从后端的提供的`API`来获取我们前端需要的数据
因为我们的数据不可能都是预先写好在我们的组件里的 

> 而后端的话就用我熟悉的Laravel项目作为Api的提供者

这样一来也就实现了我们通常所说的前后端分离

假设这样的一个应用场景就是任务管理系统(想来想去感觉还是这个应用场景比较容易理解):

我们需要：
- Todo component(每一个任务 当然也可以执行删除和已完成的状态)
- Todos component(所有任务)
- TodoForm component(添加任务)

在后端我们可以执行
```
$ php artisan make:model Todo -m
```
去生成我们的任务表 然后在数据库里生成一定的测试数据
其中todos表的结构是这样的:
```php?start_inline=1
Schema::create('todos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->boolean('completed')->default(false);
            $table->timestamps();
});
```
定义好表的内容结构之后 我们去完成一些我们的`Factory`:
```php?start_inline=1
$factory->define(App\Todo::class, function (Faker\Generator $faker) {
    return [
        'title' => $faker->paragraph,
    ];
});
```
当然不要忘了在`Todo model`里去声明我们的`fillable`:
```php?start_inline=1
 class Todo extends Model
 {
     protected $fillable = ['title'];
 }

```
完成之后去用我们的`tinker`去生成大概**10**条数据(这里就不作介绍)

生成完毕我们的数据之后我们需要在`routes`的`api.php`里给出我们的数据:
```php?start_inline=1
Route::get('/todos',function(){
    $todos = Todo::all();
    return $todos;
})->middleware('api');
```

有了数据之后我们在前端`VueJs`项目的组件里就要去获取我们提供的`api`里的数据
这里就是我们的App.vue里需要我们后端提供的数据:
```php?start_inline=1
export default{
        computed: {
            //todos就需要我们后端传过来的数据
            todos () {
               ...
            }
        },  
    }
```
这样才算完成我们前后端的一个流程 :laughing:

## 2.前端去处理后端数据
1.后端的数据已经准备好 这时我们的`vueJs`项目就需要发起`http`请求去得到我们的数据

`vueJs`之前官方推荐的是使用[vue-resource](https://github.com/pagekit/vue-resource) 但是后来作者有给我们推荐了[vue-axios](https://github.com/mzabriskie/axios)
使用这个package的话我们去执行:
> 如果你只需要在`vueJs`项目区使用`axios`的话就使用这个`package` 这个在之前的`package`做了一定的**vue兼容**
 [https://github.com/imcvampire/vue-axios](https://github.com/imcvampire/vue-axios)

```
$ npm install --save axios vue-axios
```

安装完成之后我们就可以在我们的`main.js`去添加配置:
```php?start_inline=1
import axios from 'axios'
import VueAxios from 'vue-axios'

//去声明下这个package
Vue.use(VueAxios, axios)
```

现在我们就可以去`App.vue`里的`mounted`使用我们刚刚引入的`package`：
```php?start_inline=1
export default {
  name: 'app',
  mounted(){
    this.axios.get('http://localhost:8000/api/todos').then(response => {
        //获取我们后端api的数据(response.data)  
        ...
    })
   },
  components: {
    Hello
  }
}
```
至于`this.axios.get()`这个用法其实和我们`vue-resource`的`tihs.$http.get()`的用法是差不多的 
而这个`package`在`github`上也给出了用法

> 这个时候我们发现并不能成功获取到我们的数据 是因为涉及到**跨域**这个问题 当然在`laravel`也有`package`给出了解决方案
 [https://github.com/barryvdh/laravel-cors](https://github.com/barryvdh/laravel-cors)
 
这个`package`就是去解决`laravel`作为后端api跨域的问题
 
安装的话参照`github`上的步骤就行了

安装完毕之后我们在**路由**上需要去添加我们的`cors`这个`middleware`:
```php?start_inline=1
Route::get('/todos',function(){
    $todos = Todo::all();
    return $todos;
})->middleware('api','cors');
```

添加完毕之后再去刷新我们的浏览器 我们发现数据已经成功获取到了

他会返回相应的我们之前生成的**10**条测试数据的`object`

2.拿到我们的数据后我们就去在vueJs项目中去展示
我们去初始化我们的`todos`为一个空的数组 在拿到后端数据后再赋予给我们的`todos`:
```php?start_inline=1
export default {
  name: 'app',
  data(){
  todos:[]
  },
  mounted(){
  this.axios.get('http://localhost:8000/api/todos').then(response => {
    this.todos = response.data
    })
   },
  components: {
    Hello
  }
}
```

已经拿到我们后端的API数据 并且已经存放在`todos`里 接下来怎么去展示就是看业务的要求了

到这我们其实就实现了以`vueJs`作为前端项目 `laravel`作为后端`API` 的前后端分离这种开发模式了

这样的话我们只需要后端去提供`API` 前端去请求我们的`API去`获取所需要的数据并在前端进行渲染展示

我们后端只需要去关心前端需要什么的数据并去提供这个`API` 而我们的前端则是要去关心怎么渲染这些数据

> 当然这只是获取到我们所有的数据 我们的业务要求肯定远不止这些 比如我们对数据的`CURD`这些其实我们都可以通过类似的
  形式去实现 但总的来说我们前后端的业务就是这样的一个处理流程

